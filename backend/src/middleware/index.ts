// ============================================================================
// MIDDLEWARE FUNCTIONS
// ============================================================================

import { Express } from "express";
import cors from "cors";
import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { CONFIG } from "../config";
import { redis, cacheGet } from "../utils";
import { JwtPayload } from "../types";
import { User } from "../models";

// CORS and body parsing middleware
export const setupMiddleware = (app: Express): void => {
  app.use(express.json());
  app.use(cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }));
};

// Multer configuration for file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  },
});

// ============================================================================
// 🔐 AUTHENTICATION MIDDLEWARE
// ============================================================================

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as JwtPayload;
    req.user = decoded;

    await redis.xadd(
      "auth-activity",
      "*",
      "userId",
      decoded.id,
      "action",
      "API_ACCESS",
      "endpoint",
      req.path,
      "timestamp",
      Date.now().toString()
    );

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authorize = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
};

// ============================================================================
// 🚦 RATE LIMITING MIDDLEWARE
// ============================================================================

type RateLimitType = "LOGIN" | "ORDER" | "API";

export const rateLimit = (limitType: RateLimitType): RequestHandler => {
  return async (req, res, next) => {
    const userId = req.user?.id ?? req.ip;
    const redisKey = `ratelimit:${limitType}:${userId}`;
    const maxRequests  = CONFIG.RATE_LIMIT[limitType];

    try {
      const current = await redis.incr(redisKey);

      if (current === 1) {
        await redis.expire(redisKey, 60);
      }

      if (current > maxRequests ) {
        await redis.xadd(
          "rate-limit-events",
          "*",// Auto-generate ID
          "userId",userId ?? "unknown",
          "limitType", limitType,
          "timestamp", Date.now().toString()
        );
        res
          .status(429)
          .json({ error: "Rate limit exceeded. Try again later." });
        return;
      }

      next();
    } catch (error) {
      console.error("Rate limit error:", error);
      next();
    }
  };
};

// ============================================================================
// 🧠 AI CHAT ASSISTANT MIDDLEWARE UTILITIES
// ============================================================================

import { ChatFilters, IProduct } from "../types";
import { genAIService } from "../utils";
import { Product } from "../models";

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
    console.error(' Intent parsing failed, using keyword fallback:', error);
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
    console.error(' Chat response generation failed:', error);
    
    const dishNames = products.slice(0, 3).map(p => p.name).join(', ');
    return `I found these options for you: ${dishNames}. Would you like to know more about any of these dishes?`;
  }
};