// ============================================================================
// KAFKA CONSUMER
// ============================================================================

import { Consumer } from "kafkajs";
import { redis, cacheSet, publishEvent } from "./index";
import { OrderEvent } from "../types";

export const startKafkaConsumer = async (consumer: Consumer): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: "order-status", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) {
          console.error("Empty message value");
          return;
        }

        const event: OrderEvent = JSON.parse(message.value.toString());
        console.log(`📥 Received event:`, event.type);

        const orderKey = `order:${event.orderId}`;
        await cacheSet(orderKey, event, 600);

        await redis.xadd(
          "order-stream",
          "*",
          "orderId",
          event.orderId,
          "status",
          event.status,
          "timestamp",
          Date.now().toString()
        );

        await redis.publish("order-updates", JSON.stringify(event));
        await redis.hincrby("metrics:orders", event.status, 1);
      } catch (error) {
        console.error("Consumer processing error:", error);
        await redis.xadd(
          "dlq:orders",
          "*",
          "message",
          message.value?.toString() || "empty",
          "error",
          (error as Error).message,
          "timestamp",
          Date.now().toString()
        );
      }
    },
  });

  console.log("✅ Kafka Consumer Started");
};