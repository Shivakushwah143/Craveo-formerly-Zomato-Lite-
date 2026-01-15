// ============================================================================
// BUSINESS LOGIC SERVICES
// ============================================================================

import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { CONFIG } from "../config";
import { IOrder, IUser, EmailTemplate } from "../types";

// ============================================================================
// 📧 EMAIL SERVICE
// ============================================================================

const emailTransporter = nodemailer.createTransport({
  service: CONFIG.EMAIL.SERVICE,
  host: CONFIG.EMAIL.HOST,
  port: CONFIG.EMAIL.PORT,
  secure: CONFIG.EMAIL.PORT === 465,
  auth: {
    user: CONFIG.EMAIL.USER,
    pass: CONFIG.EMAIL.PASS,
  },
} as nodemailer.TransportOptions);

emailTransporter.verify((error: any) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email service configured successfully");
  }
});

const emailTemplates = {
  orderPlaced: (order: IOrder, user: IUser): EmailTemplate => {
    const itemsList = order.items
      .map(
        (item) =>
          `<li>${(item.productId as unknown as IProduct)?.name || "Product"} - ₹${
            item.price
          } x ${item.quantity}</li>`
      )
      .join("");

    return {
      subject: `Order Confirmed - #${order._id.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Zomato Lite</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Confirmation</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${user.name},</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for your order! We're preparing your food and will notify you when it's on its way.
            </p>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin-bottom: 15px;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order._id.toString().slice(-8)}</p>
              <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
              
              <h4 style="color: #1f2937; margin: 15px 0 10px 0;">Items Ordered:</h4>
              <ul style="color: #4b5563; padding-left: 20px;">
                ${itemsList}
              </ul>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Estimated delivery time: ${order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleTimeString() : '30-45 minutes'}
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${CONFIG.CLIENT_URL}/orders" 
                 style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Track Your Order
              </a>
            </div>
          </div>
          
          <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px;">
            <p>© 2024 Zomato Lite. All rights reserved.</p>
            <p>If you have any questions, contact us at support@zomato-lite.com</p>
          </div>
        </div>
      `,
      text: `
        Order Confirmed - #${order._id.toString().slice(-8)}
        
        Hello ${user.name},
        
        Thank you for your order! We're preparing your food and will notify you when it's on its way.
        
        Order Details:
        - Order ID: #${order._id.toString().slice(-8)}
        - Total Amount: ₹${order.totalAmount}
        - Status: ${order.status}
        - Delivery Address: ${order.deliveryAddress}
        
        Items Ordered:
        ${order.items.map(item => `- ${(item.productId as unknown as IProduct)?.name || "Product"} - ₹${item.price} x ${item.quantity}`).join('\n')}
        
        Estimated delivery time: ${order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleTimeString() : '30-45 minutes'}
        
        Track your order: ${CONFIG.CLIENT_URL}/orders
        
        © 2024 Zomato Lite. All rights reserved.
        Contact: support@zomato-lite.com
      `,
    };
  },

  orderStatusUpdate: (order: IOrder, user: IUser, oldStatus: string): EmailTemplate => {
    return {
      subject: `Order ${order.status} - #${order._id.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Zomato Lite</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Update</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${user.name},</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Your order status has been updated from <strong>${oldStatus}</strong> to <strong>${order.status}</strong>.
            </p>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin-bottom: 15px;">Order Update</h3>
              <p><strong>Order ID:</strong> #${order._id.toString().slice(-8)}</p>
              <p><strong>New Status:</strong> ${order.status}</p>
              <p><strong>Updated At:</strong> ${new Date(order.updatedAt).toLocaleString()}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${CONFIG.CLIENT_URL}/orders" 
                 style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                View Order Details
              </a>
            </div>
          </div>
        </div>
      `,
      text: `Order status updated for order #${order._id.toString().slice(-8)} from ${oldStatus} to ${order.status}`,
    };
  },
};

export const sendEmail = async (to: string, template: EmailTemplate): Promise<void> => {
  try {
    const mailOptions = {
      from: CONFIG.EMAIL.FROM,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

export const sendOrderConfirmationEmail = async (order: IOrder): Promise<void> => {
  try {
    const user = await User.findById(order.userId);
    if (!user || !user.email) {
      console.log("User not found or no email address");
      return;
    }

    const template = emailTemplates.orderPlaced(order, user);
    await sendEmail(user.email, template);
    
    console.log(`✅ Order confirmation email sent for order: ${order._id}`);
  } catch (error) {
    console.error("❌ Failed to send order confirmation email:", error);
  }
};

export const sendOrderStatusUpdateEmail = async (order: IOrder, oldStatus: string): Promise<void> => {
  try {
    const user = await User.findById(order.userId);
    if (!user || !user.email) {
      console.log("User not found or no email address");
      return;
    }

    const template = emailTemplates.orderStatusUpdate(order, user, oldStatus);
    await sendEmail(user.email, template);
    
    console.log(`✅ Order status update email sent for order: ${order._id}`);
  } catch (error) {
    console.error("❌ Failed to send order status update email:", error);
  }
};

// ============================================================================
// 💳 PAYMENT SERVICE
// ============================================================================

export const razorpay = new Razorpay({
  key_id: CONFIG.RAZORPAY_KEY_ID,
  key_secret: CONFIG.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amount: number, currency: string = "INR") => {
  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw new Error("Failed to create payment order");
  }
};

export const verifyPaymentSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean => {
  const hmac = crypto.createHmac("sha256", CONFIG.RAZORPAY_KEY_SECRET);
  hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
  const generatedSignature = hmac.digest("hex");
  return generatedSignature === razorpaySignature;
};

// ============================================================================
// 📤 CLOUDINARY SERVICE
// ============================================================================

cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY.CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY.API_KEY,
  api_secret: CONFIG.CLOUDINARY.API_SECRET,
});

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = "zomato-products"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      }
    );
    uploadStream.end(buffer);
  });
};

// Import models at the end to avoid circular dependencies
import { User } from "../models";
import { IProduct } from "../types";