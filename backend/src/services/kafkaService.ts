// ============================================================================
// KAFKA SERVICE
// ============================================================================

import { Kafka, Producer, Consumer } from "kafkajs";
import { CONFIG } from "../config";

class KafkaService {
  private kafka: Kafka;
  public producer: Producer;
  public consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "zomato-backend",
      brokers: CONFIG.KAFKA_BROKERS,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "order-tracking-group" });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      console.log("✅ Kafka Producer and Consumer Connected");
    } catch (error) {
      console.error("❌ Kafka connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      console.log("✅ Kafka Disconnected");
    } catch (error) {
      console.error("❌ Kafka disconnection error:", error);
      throw error;
    }
  }
}

export const kafkaService = new KafkaService();