// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

import Redis from "ioredis";
import { CONFIG } from "../config";
import { IProduct, IOrder, ChatFilters } from "../types";
import { OrderEvent, ProductEvent, AIEvent, ETAEvent, SystemEvent } from "../types";
import { Producer } from "kafkajs";
import { genAIService } from "./genai";
import { ProductEmbeddingModel, ETAHistoryModel, Order, Product } from "../models";

// Redis client
export const redis = new Redis(CONFIG.REDIS_URL);
redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err: Error) => console.error("❌ Redis Error:", err));

// ============================================================================
// 🧠 GENAI SERVICE
// ============================================================================

export { genAIService } from "./genai";

// ============================================================================
// 💾 CACHING UTILITIES
// ============================================================================

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
};

export const cacheSet = async <T>(
  key: string,
  value: T,
  ttl: number = CONFIG.CACHE_TTL
): Promise<void> => {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error("Cache set error:", error);
  }
};

export const cacheInvalidate = async (pattern: string): Promise<void> => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Cache invalidate error:", error);
  }
};

// ============================================================================
// 📡 KAFKA EVENT PUBLISHING
// ============================================================================

export const publishEvent = async (
  producer: Producer,
  topic: string,
  event: SystemEvent
): Promise<void> => {
  try {
    let key: string;
    
    if ('orderId' in event && 'status' in event) {
      key = (event as OrderEvent).orderId;
    } else if ('productId' in event) {
      key = (event as ProductEvent).productId;
    } else if ('userId' in event && 'message' in event) {
      key = (event as AIEvent & { userId: string }).userId;
    } else if ('orderId' in event && 'predictedETA' in event) {
      key = (event as ETAEvent).orderId;
    } else if ('userId' in event && 'query' in event) {
      key = (event as AIEvent & { userId?: string }).userId || 'ai-recommendation';
    } else {
      key = "default";
    }

    await producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
        },
      ],
    });
    console.log(`📤 Event published to ${topic}:`, event.type);
  } catch (error) {
    console.error("Kafka publish error:", error);
    await redis.xadd(
      "retry:kafka-events",
      "*",
      "topic",
      topic,
      "event",
      JSON.stringify(event),
      "timestamp",
      Date.now().toString()
    );
  }
};

// ============================================================================
// 🔄 REDIS STREAM PROCESSING
// ============================================================================

export const processRedisStream = (
  entries: [string, string[] | null | undefined][]
): Array<{ id: string; data: Record<string, string> }> => {
  return entries
    .filter(
      (entry): entry is [string, string[]] =>
        entry[1] !== null && entry[1] !== undefined
    )
    .map(([id, fields]) => {
      const data: Record<string, string> = {};
      for (let i = 0; i < fields.length; i += 2) {
        const key = fields[i];
        const value = fields[i + 1];
        if (key && value) {
          data[key] = value;
        }
      }
      return { id, data };
    });
};

// ============================================================================
// 🍱 AI MENU RECOMMENDER UTILITIES
// ============================================================================

export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

export const generateProductEmbedding = async (product: IProduct): Promise<void> => {
  try {
    const text = `${product.name} ${product.description || ""} ${product.category}`;
    console.log(`🔄 Generating embedding for product: ${product.name}`);

    const embedding = await genAIService.generateEmbedding(text);

    await ProductEmbeddingModel.findOneAndUpdate(
      { productId: product._id },
      {
        productId: product._id,
        embedding,
        name: product.name,
        category: product.category,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Embedding generated for product: ${product.name}`);

    await cacheInvalidate("recommendations:*");
  } catch (error) {
    console.error("❌ Embedding generation failed:", error);
  }
};

// ============================================================================
// ⏱ SMART ETA PREDICTOR UTILITIES
// ============================================================================

export const calculateDistance = (userAddress?: string): number => {
  return 2 + Math.random() * 8;
};

export const calculateRestaurantLoad = async (): Promise<number> => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const activeOrders = await Order.countDocuments({
      createdAt: { $gte: oneHourAgo },
      status: { $in: ["PLACED", "CONFIRMED", "PREPARING", "PICKED_UP"] }
    });

    const load = Math.min(activeOrders / 20, 1);
    console.log(`📊 Restaurant load: ${load.toFixed(2)} (${activeOrders} active orders)`);
    
    return load;
  } catch (error) {
    console.error("❌ Restaurant load calculation error:", error);
    return 0.5;
  }
};

export const predictETA = (features: any): number => {
  const coefficients = {
    base: 20,
    distance: 4,
    timeRushHour: 8,
    timeLateNight: 5,
    weekend: 7,
    highLoad: 15,
    mediumLoad: 8
  };

  const now = new Date();
  const isRushHour = features.timeOfDay >= 17 && features.timeOfDay <= 21;
  const isLateNight = features.timeOfDay >= 22 || features.timeOfDay <= 4;
  const isWeekend = features.dayOfWeek === 0 || features.dayOfWeek === 6;

  let predictedETA = coefficients.base;
  predictedETA += coefficients.distance * features.distance;
  
  if (isRushHour) predictedETA += coefficients.timeRushHour;
  if (isLateNight) predictedETA += coefficients.timeLateNight;
  if (isWeekend) predictedETA += coefficients.weekend;
  
  if (features.restaurantLoad > 0.7) {
    predictedETA += coefficients.highLoad;
  } else if (features.restaurantLoad > 0.3) {
    predictedETA += coefficients.mediumLoad;
  }

  const variance = (Math.random() - 0.5) * 10;
  predictedETA += variance;

  return Math.max(Math.round(predictedETA), 25);
};

export const predictOrderETA = async (order: IOrder): Promise<number> => {
  try {
    console.log(`⏱ Predicting ETA for order: ${order._id}`);
    
    const distance = calculateDistance(order.deliveryAddress);
    const restaurantLoad = await calculateRestaurantLoad();
    const now = new Date();
    
    const features = {
      distance,
      timeOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
      restaurantLoad
    };

    const predictedETA = predictETA(features);

    const etaHistory = new ETAHistoryModel({
      orderId: order._id,
      predictedETA,
      ...features
    });
    await etaHistory.save();

    await cacheSet(`eta:${order._id}`, {
      predictedETA,
      features,
      lastUpdated: Date.now()
    }, 7200);

    console.log(`✅ ETA predicted: ${predictedETA} minutes for order ${order._id}`);
    
    return predictedETA;

  } catch (error) {
    console.error("❌ ETA prediction error:", error);
    return 45;
  }
};

// ============================================================================
// 🤖 AI CHAT ASSISTANT UTILITIES
// ============================================================================

export const parseUserIntent = async (userMessage: string): Promise<ChatFilters> => {
  try {
    const intentPrompt = `
    Analyze this food order query and extract structured filters. Return ONLY valid JSON format:
    
    User Query: "${userMessage}"
    
    Extract these filters if mentioned:
    - category (e.g., Italian, Indian, Chinese, American, Pizza, Burger, etc.)
    - spicy (true/false) - only if user explicitly mentions spicy, hot, mild, etc.
    - price_max (number) - if user mentions budget, cheap, expensive, under $X, etc.
    - dietary_preferences (vegetarian, vegan, gluten-free, etc.)
    - keywords (main dish keywords from the query)
    
    Important rules:
    - Return ONLY JSON, no other text
    - If a filter is not mentioned, omit it from JSON
    - For price_max: extract numbers only (e.g., "under $20" -> 20)
    - For spicy: only true if user explicitly wants spicy food
    - For keywords: extract food-related keywords only
    
    Example responses:
    User: "spicy indian food under 200 rupees" -> {"category": "Indian", "spicy": true, "price_max": 200}
    User: "vegetarian pizza" -> {"category": "Pizza", "dietary_preferences": "vegetarian", "keywords": ["pizza"]}
    User: "show me cheap chinese dishes" -> {"category": "Chinese", "price_max": 150, "keywords": ["chinese", "dishes"]}
    
    Your response for "${userMessage}":
    `;

    const intentResponse = await genAIService.chatCompletion([
      { role: "user", content: intentPrompt }
    ]);

    console.log(`🤖 LLM Intent Response: ${intentResponse}`);

    const cleanedResponse = intentResponse.trim().replace(/```json\n?|\n?```/g, '');
    const filters = JSON.parse(cleanedResponse) as ChatFilters;
    
    return filters;

  } catch (error) {
    console.error('❌ Intent parsing failed, using keyword fallback:', error);
    const keywords = userMessage.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !['show', 'me', 'find', 'get', 'want', 'looking', 'for'].includes(word)
    );
    return { keywords };
  }
};

export const buildProductQuery = (filters: ChatFilters): any => {
  const query: any = { isAvailable: true };

  if (filters.category) {
    query.category = new RegExp(filters.category, 'i');
  }

  if (filters.spicy !== undefined) {
    query.$or = [
      { name: new RegExp('spicy|hot|masala|chili', 'i') },
      { description: new RegExp('spicy|hot|masala|chili', 'i') }
    ];
  }

  if (filters.price_max) {
    query.price = { $lte: filters.price_max };
  }

  if (filters.dietary_preferences) {
    const diet = filters.dietary_preferences.toLowerCase();
    if (diet.includes('vegetarian') || diet.includes('vegan')) {
      query.$or = [
        { name: new RegExp('vegetarian|vegan|veg', 'i') },
        { description: new RegExp('vegetarian|vegan|veg', 'i') },
        { category: new RegExp('vegetarian|vegan', 'i') }
      ];
    }
  }

  if (filters.keywords && filters.keywords.length > 0) {
    const keywordQueries = filters.keywords.map(keyword => ({
      $or: [
        { name: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
        { category: new RegExp(keyword, 'i') }
      ]
    }));
    
    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: keywordQueries }];
      delete query.$or;
    } else {
      query.$or = keywordQueries;
    }
  }

  console.log(`🔍 Built query:`, JSON.stringify(query, null, 2));
  return query;
};

export const generateChatResponse = async (
  userMessage: string, 
  products: IProduct[], 
  filters: ChatFilters
): Promise<string> => {
  try {
    if (products.length === 0) {
      return "I couldn't find any dishes matching your request. Could you try different keywords or browse our full menu? I'd be happy to help you find something else!";
    }

    const productList = products.slice(0, 5).map(p => 
      `• ${p.name} - ₹${p.price} (${p.category})${p.description ? ` - ${p.description}` : ''}`
    ).join('\n');

    const responsePrompt = `
    User asked: "${userMessage}"
    
    I found these matching products:
    ${productList}
    
    Generate a friendly, helpful, and conversational response suggesting these dishes. 
    Requirements:
    - Keep it under 3 sentences
    - Sound natural and enthusiastic
    - Mention 2-3 specific dishes by name
    - Include price if relevant
    - Offer further assistance
    
    Example: "I found some great options for you! We have delicious Margherita Pizza (₹12.99) and Spicy Chicken Burger (₹9.99). Would you like me to help you with anything else?"
    
    Your response:
    `;

    const aiResponse = await genAIService.chatCompletion([
      { role: "user", content: responsePrompt }
    ]);

    return aiResponse.trim();

  } catch (error) {
    console.error('❌ Chat response generation failed:', error);
    
    const dishNames = products.slice(0, 3).map(p => p.name).join(', ');
    return `I found these options for you: ${dishNames}. Would you like to know more about any of these dishes?`;
  }
};