import dns from "node:dns/promises";
import mongoose from "mongoose";
import { CONFIG } from "../config";

export const connectMongoDB = async (): Promise<void> => {
  try {
    // Force reliable public DNS servers to resolve MongoDB SRV records
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    await mongoose.connect(CONFIG.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
