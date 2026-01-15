// ============================================================================
// ADMIN CONTROLLERS
// ============================================================================

import { Request, Response } from "express";
import { Order, User } from "../models";
import { redis, processRedisStream } from "../utils";

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getAdminOrderById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("items.productId")
      .populate("userId", "name email phone address");

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ order });
  } catch (error) {
    console.error("Get admin order error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const getMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderMetrics = await redis.hgetall("metrics:orders");
    const rateLimitEvents = await redis.xrevrange(
      "rate-limit-events",
      "+",
      "-",
      "COUNT",
      10
    );
    const cacheInfo = await redis.info("stats");
    const recentOrders = await redis.xrevrange(
      "order-stream",
      "+",
      "-",
      "COUNT",
      20
    );

    res.json({
      orderMetrics,
      rateLimitViolations: rateLimitEvents.length,
      recentOrders: processRedisStream(recentOrders),
      cacheStats: cacheInfo,
    });
  } catch (error) {
    console.error("Metrics error:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};

export const getAuthLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await redis.xrevrange(
      "auth-activity",
      "+",
      "-",
      "COUNT",
      50
    );
    const activities = processRedisStream(logs);
    res.json({ activities });
  } catch (error) {
    console.error("Auth logs error:", error);
    res.status(500).json({ error: "Failed to fetch auth logs" });
  }
};

export const getDLQEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const dlqEntries = await redis.xrevrange(
      "dlq:orders",
      "+",
      "-",
      "COUNT",
      20
    );
    const failures = processRedisStream(dlqEntries);
    res.json({ failures });
  } catch (error) {
    console.error("DLQ error:", error);
    res.status(500).json({ error: "Failed to fetch DLQ entries" });
  }
};