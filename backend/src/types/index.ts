// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

import { Types, Document } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin" | "delivery";
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrls: string[];
  isAvailable: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status:
    | "PLACED"
    | "CONFIRMED"
    | "PREPARING"
    | "PICKED_UP"
    | "DELIVERED"
    | "CANCELLED";
  deliveryAddress: string;
  deliveryAgentId?: Types.ObjectId;
  estimatedDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductEmbedding extends Document {
  productId: Types.ObjectId;
  embedding: number[];
  name: string;
  category: string;
  createdAt: Date;
}

export interface IETAHistory extends Document {
  orderId: Types.ObjectId;
  predictedETA: number;
  actualETA?: number;
  distance: number;
  timeOfDay: number;
  dayOfWeek: number;
  restaurantLoad: number;
  createdAt: Date;
}

export interface IPayment extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  method?: string;
  createdAt: Date;
  updatedAt: Date;
}

// JWT & Authentication Types
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  address?: string;
}

export interface CacheSession {
  accessToken: string;
  refreshToken: string;
}

// Request Body Types
export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "admin" | "delivery";
  phone?: string;
  address?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface CreateProductRequestBody {
  name: string;
  description?: string;
  price: number;
  category: string;
}

export interface CreateOrderRequestBody {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  deliveryAddress?: string;
}

export interface UpdateOrderStatusRequestBody {
  status: "CONFIRMED" | "PREPARING" | "PICKED_UP" | "DELIVERED" | "CANCELLED";
}

export interface RefreshTokenRequestBody {
  refreshToken: string;
}

export interface CreatePaymentRequestBody {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface VerifyPaymentRequestBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

// Event Types
export interface OrderEvent {
  type: string;
  orderId: string;
  userId?: string;
  status: string;
  totalAmount?: number;
  timestamp: number;
}

export interface ProductEvent {
  type: string;
  productId: string;
  timestamp: number;
}

export interface AIRecommendationEvent {
  type: "RECOMMENDATIONS_GENERATED";
  userId?: string;
  query: string;
  count: number;
  timestamp: number;
}

export interface AIChatEvent {
  type: "CHAT_QUERY_RECEIVED" | "CHAT_RESPONSE_GENERATED";
  userId: string;
  message: string;
  response?: string;
  productsFound?: number;
  timestamp: number;
}

export interface ETAEvent {
  type: "ETA_PREDICTED" | "ETA_UPDATED";
  orderId: string;
  predictedETA: number;
  actualETA?: number;
  timestamp: number;
}

export interface ETAPredictionFeatures {
  distance: number;
  timeOfDay: number;
  dayOfWeek: number;
  restaurantLoad: number;
}

// AI & Chat Types
export interface ChatFilters {
  category?: string;
  spicy?: boolean;
  price_max?: number;
  dietary_preferences?: string;
  keywords?: string[];
}

export interface ChatResponse {
  response: string;
  products: IProduct[];
  filters: ChatFilters;
}

// Email Types
export interface EmailConfig {
  service: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// GenAI Types
export interface GenAIConfig {
  provider: "ollama" | "gemini";
  baseURL: string;
  apiKey?: string;
  model: string;
}

// Union Types
export type AIEvent = AIRecommendationEvent | AIChatEvent;
export type SystemEvent = OrderEvent | ProductEvent | AIEvent | ETAEvent;

// Extend Express Request type globally
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}