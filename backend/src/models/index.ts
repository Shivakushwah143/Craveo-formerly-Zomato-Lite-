// ============================================================================
// DATABASE MODELS
// ============================================================================

import mongoose, { Schema, Model, Types } from "mongoose";
import { 
  IUser, 
  IProduct, 
  IOrder, 
  IProductEmbedding, 
  IETAHistory, 
  IPayment 
} from "../types";

// User Schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "admin", "delivery"],
    default: "customer",
  },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
});

// Product Schema
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrls: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Order Schema
const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "PICKED_UP",
      "DELIVERED",
      "CANCELLED",
    ],
    default: "PLACED",
  },
  deliveryAddress: String,
  deliveryAgentId: { type: Schema.Types.ObjectId, ref: "User" },
  estimatedDeliveryTime: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Product Embedding Schema
const productEmbeddingSchema = new Schema<IProductEmbedding>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  embedding: [{ type: Number }],
  name: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

// ETA History Schema
const etaHistorySchema = new Schema<IETAHistory>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  predictedETA: { type: Number, required: true },
  actualETA: Number,
  distance: Number,
  timeOfDay: Number,
  dayOfWeek: Number,
  restaurantLoad: Number,
  createdAt: { type: Date, default: Date.now }
});

// Payment Schema
const paymentSchema = new Schema<IPayment>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: {
    type: String,
    enum: ["created", "captured", "failed", "refunded"],
    default: "created",
  },
  method: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export models
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
export const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export const ProductEmbeddingModel: Model<IProductEmbedding> = mongoose.model<IProductEmbedding>("ProductEmbedding", productEmbeddingSchema);
export const ETAHistoryModel: Model<IETAHistory> = mongoose.model<IETAHistory>("ETAHistory", etaHistorySchema);
export const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);