// ============================================================================
// PAYMENT CONTROLLERS
// ============================================================================

import { Request, Response } from "express";
import { 
  CreatePaymentRequestBody, 
  VerifyPaymentRequestBody 
} from "../types";
import { Order, Payment, User } from "../models";
import { 
  createRazorpayOrder, 
  verifyPaymentSignature,
  sendOrderConfirmationEmail 
} from "../services";
import { publishEvent } from "../utils";
import { producer } from "../index";

export const createPaymentOrder = async (
  req: Request<{}, {}, CreatePaymentRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { orderId, amount, currency = "INR" } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (order.userId.toString() !== req.user!.id && req.user!.role !== "admin") {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    if (Math.abs(amount - order.totalAmount) > 1) {
      res.status(400).json({ error: "Amount doesn't match order total" });
      return;
    }

    const razorpayOrder = await createRazorpayOrder(amount, currency);

    const payment = new Payment({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency: currency,
    });

    await payment.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

export const verifyPayment = async (
  req: Request<{}, {}, VerifyPaymentRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValidSignature = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      res.status(400).json({ error: "Invalid payment signature" });
      return;
    }

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.status = "captured";
    payment.updatedAt = new Date();
    await payment.save();

    const order = await Order.findById(payment.orderId);
    if (order) {
      const oldStatus = order.status;
      order.status = "CONFIRMED";
      order.updatedAt = new Date();
      await order.save();

      await sendOrderConfirmationEmail(order);

      await publishEvent(producer, "order-status", {
        type: "ORDER_CONFIRMED",
        orderId: order._id.toString(),
        status: "CONFIRMED",
        timestamp: Date.now(),
      });

      if (oldStatus !== "CONFIRMED") {
        // Status update email will be sent by the order status update mechanism
      }
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

export const getPaymentStatus = async (
  req: Request<{ orderId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ orderId }).populate("orderId");
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    const order = payment.orderId as any;
    if (order.userId.toString() !== req.user!.id && req.user!.role !== "admin") {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json({ payment });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
};