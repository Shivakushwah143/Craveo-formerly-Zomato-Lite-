// ============================================================================
// ORDER CONTROLLERS
// ============================================================================

import { Request, Response } from "express";
import { Types } from "mongoose";
import { 
  CreateOrderRequestBody, 
  UpdateOrderStatusRequestBody 
} from "../types";
import { Order, Product } from "../models";
import { 
  cacheGet, 
  cacheSet, 
  publishEvent, 
  predictOrderETA,
  redis 
} from "../utils";
import { sendOrderStatusUpdateEmail } from "../services";
import { kafkaService } from "../services/kafkaService";

export const createOrder = async (
  req: Request<{}, {}, CreateOrderRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: "Order items required" });
      return;
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isAvailable) {
        res.status(400).json({ error: `Product ${item.productId} not available` });
        return;
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      userId: new Types.ObjectId(req.user!.id),
      items: orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress || req.user!.address,
      status: "PLACED",
    });

    await order.save();

    const predictedETA = await predictOrderETA(order);
    order.estimatedDeliveryTime = new Date(Date.now() + predictedETA * 60 * 1000);
    await order.save();

    await publishEvent(kafkaService.producer, "eta-predictions", {
      type: "ETA_PREDICTED",
      orderId: order._id.toString(),
      predictedETA,
      timestamp: Date.now(),
    });

    await publishEvent(kafkaService.producer, "order-status", {
      type: "ORDER_PLACED",
      orderId: order._id.toString(),
      userId: req.user!.id,
      status: "PLACED",
      totalAmount,
      timestamp: Date.now(),
    });

    res.status(201).json({
      message: "Order placed successfully. Please complete payment to confirm.",
      order: {
        ...order.toObject(),
        predictedETA,
        paymentRequired: true,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.user!.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const cached = await cacheGet(`order:${id}`);
    const order = await Order.findById(id).populate("items.productId");

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (order.userId.toString() !== req.user!.id && req.user!.role !== "admin") {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json({
      order,
      realtimeStatus: cached || null,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const updateOrderStatus = async (
  req: Request<{ id: string }, {}, UpdateOrderStatusRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "CONFIRMED",
      "PREPARING",
      "PICKED_UP",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const oldStatus = order.status;
    order.status = status;
    order.updatedAt = new Date();

    if (status === "PICKED_UP") {
      order.deliveryAgentId = new Types.ObjectId(req.user!.id);
    }

    await order.save();

    if (oldStatus !== status) {
      await sendOrderStatusUpdateEmail(order, oldStatus);
    }

    await publishEvent(kafkaService.producer, "order-status", {
      type: `ORDER_${status}`,
      orderId: id,
      status,
      timestamp: Date.now(),
    });

    await redis.hincrby("metrics:orders", status, 1);

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

export const getOrderETA = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const cachedETA = await cacheGet<{
      predictedETA: number;
      features: any;
      lastUpdated: number;
    }>(`eta:${id}`);
    
    const order = await Order.findById(id);
    
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (order.userId.toString() !== req.user!.id && req.user!.role !== "admin") {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json({
      orderId: id,
      predictedETA: cachedETA?.predictedETA,
      currentStatus: order.status,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      features: cachedETA?.features,
      lastUpdated: cachedETA?.lastUpdated ? new Date(cachedETA.lastUpdated).toISOString() : null
    });
  } catch (error) {
    console.error("Get ETA error:", error);
    res.status(500).json({ error: "Failed to fetch ETA" });
  }
};