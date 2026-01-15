import mongoose from "mongoose";
import { CONFIG } from "../config";

export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(CONFIG.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};