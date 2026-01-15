// ============================================================================
// CONFIGURATION & ENVIRONMENT VARIABLES
// ============================================================================

import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/zomato",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh-secret-key",
  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  RATE_LIMIT: {
    LOGIN: 5,
    ORDER: 10,
    API: 50,
  },
  CACHE_TTL: 300,
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    API_KEY: process.env.CLOUDINARY_API_KEY || "",
    API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  },
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret',
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.EMAIL_PORT || '587'),
    USER: process.env.EMAIL_USER || 'shivakushwah144@gmail.com',
    PASS: process.env.EMAIL_PASS || 'bhhaiphbziefhkbu',
    FROM: process.env.EMAIL_FROM || 'Zomato Lite <noreply@zomato-lite.com>'
  },
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
} as const;

export const GENAI_CONFIG = {
  provider: (process.env.GENAI_PROVIDER as "ollama" | "gemini") || "ollama",
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GENAI_MODEL || "llama2",
};