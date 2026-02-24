// ============================================================================
// KAFKA SERVICE
// ============================================================================

import { Kafka, Producer, Consumer } from "kafkajs";
import getKafkaConfig from "../config/kafkaConfig";
import { CONFIG } from "../config";

class KafkaService {
  private kafka: Kafka | null;
  public producer: Producer | null;
  public consumer: Consumer | null;

  constructor() {
    if (!CONFIG.KAFKA_ENABLED) {
      this.kafka = null;
      this.producer = null;
      this.consumer = null;
      return;
    }

    this.kafka = new Kafka(getKafkaConfig());
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "order-tracking-group" });
  }

  async connect(): Promise<void> {
    if (!this.producer || !this.consumer) {
      return;
    }
    try {
      await this.producer.connect();
      await this.consumer.connect();
      console.log("? Kafka Producer and Consumer Connected");
    } catch (error) {
      console.error("? Kafka connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.producer || !this.consumer) {
      return;
    }
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      console.log("? Kafka Disconnected");
    } catch (error) {
      console.error("? Kafka disconnection error:", error);
      throw error;
    }
  }
}

export const kafkaService = new KafkaService();
