// ============================================================================
// AI CONTROLLERS
// ============================================================================

import { Request, Response } from "express";
import { Types } from "mongoose";
import { 
  AIRecommendationEvent, 
  AIChatEvent 
} from "../types";
import { Product, Order, ProductEmbeddingModel, ETAHistoryModel } from "../models";
import { 
  cacheGet, 
  cacheSet, 
  cacheInvalidate, 
  publishEvent, 
  cosineSimilarity, 
  genAIService,
  parseUserIntent,
  buildProductQuery,
  generateChatResponse,
  redis, 
  generateProductEmbedding
} from "../utils";
import { producer } from "../index";

export const getAIRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, limit = 5 } = req.query;
    const userId = req.user?.id;

    const cacheKey = `recommendations:${userId}:${query}`;
    const cached = await cacheGet(cacheKey);

    if (cached) {
      res.json({
        source: "cache",
        recommendations: cached,
      });
      return;
    }

    let searchText = query as string;

    if (!searchText && userId) {
      const userOrders = await Order.find({
        userId: new Types.ObjectId(userId),
        status: { $in: ["DELIVERED", "PICKED_UP"] },
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("items.productId");

      if (userOrders.length > 0) {
        const recentProducts = userOrders.flatMap((order) =>
          order.items.map((item) => {
            const product = item.productId as any;
            return product.name;
          })
        );
        searchText = recentProducts.join(" ");
        console.log(` Using recent orders for recommendations: ${searchText}`);
      }
    }

    if (!searchText) {
      const popularProducts = await Product.find({ isAvailable: true })
        .sort({ rating: -1 })
        .limit(limit as number);

      const result = popularProducts.map((product) => ({
        productId: product._id,
        name: product.name,
        score: 0.9,
        product: {
          name: product.name,
          price: product.price,
          category: product.category,
          imageUrls: product.imageUrls,
          rating: product.rating,
        },
      }));

      await cacheSet(cacheKey, result, 1800);
      res.json({
        source: "popular_fallback",
        recommendations: result,
      });
      return;
    }

    console.log(` Generating AI recommendations for: "${searchText}"`);

    const queryEmbedding = await genAIService.generateEmbedding(searchText);

    const allEmbeddings = await ProductEmbeddingModel.find().populate("productId");

    if (allEmbeddings.length === 0) {
      res.status(404).json({
        error: "No product embeddings found. Please wait for embeddings to be generated.",
      });
      return;
    }

    const similarities = allEmbeddings.map((productEmbedding) => {
      const similarity = cosineSimilarity(
        queryEmbedding,
        productEmbedding.embedding
      );
      return {
        productId: (productEmbedding.productId as any)._id,
        name: (productEmbedding.productId as any).name,
        score: similarity,
        category: productEmbedding.category,
      };
    });

    const recommendations = similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit as number)
      .filter((rec) => rec.score > 0.3);

    console.log(` Found ${recommendations.length} recommendations with score > 0.3`);

    const productIds = recommendations.map((rec) => rec.productId);
    const products = await Product.find({
      _id: { $in: productIds },
      isAvailable: true,
    });

    const result = recommendations
      .map((rec) => {
        const product = products.find(
          (p) => p._id.toString() === rec.productId.toString()
        );
        return {
          productId: rec.productId,
          name: rec.name,
          score: Math.round(rec.score * 100) / 100,
          product: product
            ? {
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                imageUrls: product.imageUrls,
                rating: product.rating,
                isAvailable: product.isAvailable,
              }
            : null,
        };
      })
      .filter((rec) => rec.product !== null);

    await cacheSet(cacheKey, result, 1800);

    const aiEvent: AIRecommendationEvent = {
      type: "RECOMMENDATIONS_GENERATED",
      userId: userId,
      query: searchText,
      count: result.length,
      timestamp: Date.now(),
    };

    await publishEvent(producer, "ai-recommendations", aiEvent);

    res.json({
      source: "ai",
      query: searchText,
      recommendations: result,
    });
  } catch (error) {
    console.error(" Recommendation error:", error);
    res.status(500).json({
      error: "Failed to generate recommendations",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const chatWithAI = async (
  req: Request<{}, {}, { message: string }>,
  res: Response
): Promise<void> => {
  try {
    const { message } = req.body;
    const userId = req.user!.id;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    console.log(` Chat request from user ${userId}: "${message}"`);

    const chatEvent: AIChatEvent = {
      type: "CHAT_QUERY_RECEIVED",
      userId: userId,
      message: message,
      response: "",
      productsFound: 0,
      timestamp: Date.now(),
    };

    await publishEvent(producer, "ai-chat-queries", chatEvent);

    console.log(` Parsing user intent...`);
    const filters = await parseUserIntent(message);
    console.log(` Extracted filters:`, JSON.stringify(filters, null, 2));

    console.log(` Searching products...`);
    const productQuery = buildProductQuery(filters);
    const products = await Product.find(productQuery)
      .limit(10)
      .sort({ rating: -1, price: 1 });

    console.log(` Found ${products.length} matching products`);

    console.log(` Generating AI response...`);
    const aiResponse = await generateChatResponse(message, products, filters);

    await redis.xadd(
      "ai-chat-sessions",
      "*",
      "userId",
      userId,
      "query",
      message,
      "response",
      aiResponse,
      "productsFound",
      products.length.toString(),
      "filters",
      JSON.stringify(filters),
      "timestamp",
      Date.now().toString()
    );

    const responseData = {
      response: aiResponse,
      products: products.slice(0, 5),
      filters: filters
    };

    chatEvent.type = "CHAT_RESPONSE_GENERATED";
    chatEvent.response = aiResponse;
    chatEvent.productsFound = products.length;
    await publishEvent(producer, "ai-chat-queries", chatEvent);

    console.log(`Chat response sent successfully`);
    
    res.json(responseData);

  } catch (error) {
    console.error(" AI chat error:", error);
    
    const fallbackResponse = {
      response: "I'm having trouble processing your request right now. Please try again in a moment or browse our menu directly!",
      products: [],
      filters: {}
    };
    
    res.status(500).json(fallbackResponse);
  }
};

export const generateAllEmbeddings = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isAvailable: true });

    res.json({
      message: "Started background embedding generation",
      totalProducts: products.length,
    });

    let generatedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        await generateProductEmbedding(product);
        generatedCount++;

        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(` Failed to generate embedding for ${product.name}:`, error);
        errorCount++;
      }
    }

    console.log(
      ` Embedding generation completed: ${generatedCount} success, ${errorCount} errors`
    );
  } catch (error) {
    console.error("Background embedding generation error:", error);
  }
};

export const getETAAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const recentPredictions = await ETAHistoryModel.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('orderId');

    const completedDeliveries = recentPredictions.filter(
      p => p.actualETA !== undefined && p.actualETA !== null
    );

    let totalError = 0;
    let accuracyCount = 0;

    completedDeliveries.forEach(prediction => {
      const error = Math.abs((prediction.actualETA || 0) - prediction.predictedETA);
      totalError += error;
      if (error <= 10) accuracyCount++;
    });

    const avgError = completedDeliveries.length > 0 
      ? (totalError / completedDeliveries.length).toFixed(2) 
      : 0;
    
    const accuracyRate = completedDeliveries.length > 0
      ? ((accuracyCount / completedDeliveries.length) * 100).toFixed(1)
      : 0;

    res.json({
      totalPredictions: recentPredictions.length,
      completedDeliveries: completedDeliveries.length,
      averageError: `${avgError} minutes`,
      accuracyRate: `${accuracyRate}%`,
      recentPredictions: recentPredictions.map(p => ({
        orderId: p.orderId,
        predictedETA: p.predictedETA,
        actualETA: p.actualETA,
        distance: p.distance,
        timeOfDay: p.timeOfDay,
        accuracy: p.actualETA ? Math.abs(p.actualETA - p.predictedETA) : null,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    console.error("ETA analytics error:", error);
    res.status(500).json({ error: "Failed to fetch ETA analytics" });
  }
};