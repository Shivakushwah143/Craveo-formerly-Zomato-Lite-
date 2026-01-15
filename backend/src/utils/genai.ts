// ============================================================================
// GENAI SERVICE
// ============================================================================

import axios from "axios";
import { GenAIConfig } from "../types";
import { GENAI_CONFIG } from "../config";

export class GenAIService {
  private config: GenAIConfig;

  constructor(config: GenAIConfig) {
    this.config = config;
  }

  public setProvider(provider: "ollama" | "gemini", apiKey?: string): void {
    this.config.provider = provider;
    if (apiKey) this.config.apiKey = apiKey;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (this.config.provider === "ollama") {
        const response = await axios.post(
          `${this.config.baseURL}/api/embeddings`,
          {
            model: this.config.model,
            prompt: text,
          }
        );
        return response.data.embedding;
      } else {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${this.config.apiKey}`,
          {
            content: { parts: [{ text }] },
          }
        );
        return response.data.embedding.values;
      }
    } catch (error) {
      console.error("Embedding generation error:", error);
      throw new Error("Failed to generate embedding");
    }
  }

  async chatCompletion(
    messages: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      if (this.config.provider === "ollama") {
        const response = await axios.post(`${this.config.baseURL}/api/chat`, {
          model: this.config.model,
          messages: messages,
          stream: false,
        });
        return response.data.message.content;
      } else {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config.apiKey}`,
          {
            contents: messages.map((msg) => ({
              parts: [{ text: msg.content }],
              role: msg.role === "user" ? "user" : "model",
            })),
          }
        );
        return response.data.candidates[0].content.parts[0].text;
      }
    } catch (error) {
      console.error("Chat completion error:", error);
      throw new Error("Failed to generate chat response");
    }
  }
}

export const genAIService = new GenAIService(GENAI_CONFIG);