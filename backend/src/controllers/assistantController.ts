// ============================================================================
// ASSISTANT CONTROLLER
// ============================================================================

import { Request, Response } from "express";
import { Types } from "mongoose";
import { AssistantMessage, Order, Product, User } from "../models";
import { genAIService, parseUserIntent, buildProductQuery } from "../utils";

type IncomingHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

const buildSystemPrompt = (params: {
  userName?: string;
  recentOrders: string;
  menuHighlights: string;
  menuMatches: string;
}) => {
  const nameLine = params.userName ? `User name: ${params.userName}` : "User name: Guest";
  return `
You are Craveo's in-app assistant. You are human-sounding, calm, and concise.
Never say you are an AI, model, or bot. Do not mention policies.
Scope: menu guidance, ordering help, delivery windows, payment basics, and simple FAQs.
If asked about anything outside scope, politely redirect and offer help inside scope.

Brand notes:
- Craveo is a premium food delivery experience with curated menus.
- We highlight top-rated dishes and honest ingredients.
- Orders can be placed, tracked, and managed in the app.

${nameLine}
Recent orders (if any): ${params.recentOrders}
Menu highlights: ${params.menuHighlights}
Matching menu options: ${params.menuMatches}

Response rules:
- Keep it 2 to 5 short sentences.
- Use contractions and natural phrasing.
- If user asks to order, guide them to add items to cart.
- If user asks about order status, direct them to the Orders tab.
`;
};

export const chatWithAssistant = async (
  req: Request<{}, {}, { message: string; history?: IncomingHistoryItem[] }>,
  res: Response
): Promise<void> => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user?.id;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    let recentOrdersText = "None";
    let userName: string | undefined;

    if (userId) {
      const userDoc = await User.findById(userId);
      userName = userDoc?.name;

      const recentOrders = await Order.find({
        userId: new Types.ObjectId(userId),
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("items.productId");

      if (recentOrders.length > 0) {
        recentOrdersText = recentOrders
          .map((order) => {
            const items = order.items
              .map((item) => (item.productId as any)?.name || "Item")
              .join(", ");
            return `Order ${order._id.toString().slice(-6)}: ${items}`;
          })
          .join(" | ");
      }
    }

    let filters = {};
    try {
      filters = await parseUserIntent(message);
    } catch {
      filters = {};
    }

    const productQuery = buildProductQuery(filters);
    const matchingProducts = await Product.find(productQuery)
      .limit(6)
      .sort({ rating: -1, price: 1 });

    const menuHighlights = await Product.find({ isAvailable: true })
      .sort({ rating: -1 })
      .limit(5);

    const highlightsText = menuHighlights
      .map((p) => `${p.name} (â‚¹${p.price})`)
      .join(", ");

    const matchesText =
      matchingProducts.length > 0
        ? matchingProducts.map((p) => `${p.name} (â‚¹${p.price})`).join(", ")
        : "No close matches right now";

    const systemPrompt = buildSystemPrompt({
      userName,
      recentOrders: recentOrdersText,
      menuHighlights: highlightsText,
      menuMatches: matchesText,
    });

    const serverHistory =
      userId
        ? await AssistantMessage.find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .limit(20)
        : [];

    const historyMessages: IncomingHistoryItem[] = userId
      ? serverHistory
          .reverse()
          .map((m) => ({ role: m.role, content: m.content }))
      : history.slice(-20);

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: message },
    ];

    const reply = await genAIService.chatCompletion(chatMessages, {
      temperature: 0.6,
      maxTokens: 420,
    });

    if (userId) {
      await AssistantMessage.create([
        { userId, role: "user", content: message },
        { userId, role: "assistant", content: reply },
      ]);

      const total = await AssistantMessage.countDocuments({
        userId: new Types.ObjectId(userId),
      });
      if (total > 40) {
        const toDelete = await AssistantMessage.find({
          userId: new Types.ObjectId(userId),
        })
          .sort({ createdAt: 1 })
          .limit(total - 40)
          .select("_id");
        await AssistantMessage.deleteMany({
          _id: { $in: toDelete.map((d) => d._id) },
        });
      }
    }

    res.json({
      reply: reply.trim(),
      memory: userId ? "server" : "client",
    });
  } catch (error) {
    console.error("Assistant chat error:", error);
    res.status(500).json({
      reply:
        "I'm having a quick hiccup. Try again in a moment, or browse the menu and I'll help you choose.",
    });
  }
};
