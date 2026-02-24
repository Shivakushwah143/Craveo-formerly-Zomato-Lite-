
// Craveo Backend (formerly Zomato-Lite)
// ============================================================================
// MAIN APPLICATION ENTRY POINT
// ============================================================================

import express from "express";
import { Kafka } from "kafkajs";
import { CONFIG } from "./config";
import getKafkaConfig from "./config/kafkaConfig";
import { connectMongoDB } from "./utils/database";
import { setupMiddleware } from "./middleware";
import { setupRoutes } from "./routes";
import { startKafkaConsumer } from "./utils/kafka";

// Initialize Express app
const app = express();

// Initialize Kafka
export const kafka = new Kafka(getKafkaConfig());

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "order-tracking-group" });

const ensureKafkaTopics = async (): Promise<void> => {
  const admin = kafka.admin();
  const requiredTopics = ["order-status", "eta-predictions"];

  try {
    await admin.connect();
    const existingTopics = await admin.listTopics();
    const topicsToCreate = requiredTopics.filter(
      (topic) => !existingTopics.includes(topic)
    );

    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate.map((topic) => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1,
        })),
      });
      console.log(`✅ Kafka topics created: ${topicsToCreate.join(", ")}`);
    } else {
      console.log("✅ Kafka topics already exist");
    }
  } catch (error) {
    console.error("❌ Kafka topic creation failed:", error);
    throw error;
  } finally {
    await admin.disconnect();
  }
};

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectMongoDB();
    await ensureKafkaTopics();
    await producer.connect();
    console.log("✅ Kafka Producer Connected");
    await startKafkaConsumer(consumer);
    
    // Check AI configuration
    console.log(`🧠 GenAI Provider: ${process.env.GENAI_PROVIDER || 'ollama'}`);
    if (process.env.GENAI_PROVIDER === 'gemini' && !process.env.GEMINI_API_KEY) {
      console.warn('⚠️  Gemini API key not provided - AI features may not work');
    }

    app.listen(CONFIG.PORT, () => {
      console.log(`\n🚀 Zomato-Lite Backend Running on Port ${CONFIG.PORT}`);
      console.log(`📍 Health Check: http://localhost:${CONFIG.PORT}/health`);
      console.log(`📊 MongoDB: ${CONFIG.MONGO_URI}`);
      console.log(`💾 Redis: ${CONFIG.REDIS_URL}`);
      console.log(`📡 Kafka: ${CONFIG.KAFKA_BROKERS.join(', ')}`);
      console.log(`🧠 AI Features: Enabled (${process.env.GENAI_PROVIDER || 'ollama'})`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  await producer.disconnect();
  await consumer.disconnect();
  process.exit(0);
});

// Start the server
startServer();

export { app };
