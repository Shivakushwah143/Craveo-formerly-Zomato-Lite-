// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

import { Express } from "express";
import { authenticate, authorize, rateLimit,   upload } from "../middleware";
import {
  // Auth
  register,
  login,
  refreshToken,
  
  // Products
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Orders
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderETA,
  
  // Payments
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  
  // AI
  getAIRecommendations,
  chatWithAI,
  generateAllEmbeddings,
  getETAAnalytics,
  
  // Admin
  getAllOrders,
  getAdminOrderById,
  getMetrics,
  getAuthLogs,
  getDLQEntries
} from "../controllers";

export const setupRoutes = (app: Express): void => {
  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // ============================================================================
  // 🔐 AUTH ROUTES
  // ============================================================================
  app.post("/api/auth/register", rateLimit("API"), register);
  app.post("/api/auth/login", rateLimit("LOGIN"), login);
  app.post("/api/auth/refresh", refreshToken);

  // ============================================================================
  // 🍔 PRODUCT ROUTES
  // ============================================================================
  app.get("/api/products", rateLimit("API"), getProducts);
  app.get("/api/products/:id", rateLimit("API"), getProductById);
  app.post(
    "/api/products",
    authenticate,
    authorize("admin"),
    upload.array("images", 5),
    createProduct
  );
  app.put(
    "/api/products/:id",
    authenticate,
    authorize("admin"),
    upload.array("images", 5),
    updateProduct
  );
  app.delete(
    "/api/products/:id",
    authenticate,
    authorize("admin"),
    deleteProduct
  );

  // ============================================================================
  // 📦 ORDER ROUTES
  // ============================================================================
  app.post("/api/orders", authenticate, rateLimit("ORDER"), createOrder);
  app.get("/api/orders", authenticate, getOrders);
  app.get("/api/orders/:id", authenticate, getOrderById);
  app.patch(
    "/api/orders/:id/status",
    authenticate,
    authorize("admin", "delivery"),
    updateOrderStatus
  );
  app.get("/api/orders/:id/eta", authenticate, getOrderETA);

  // ============================================================================
  // 💳 PAYMENT ROUTES
  // ============================================================================
  app.post(
    "/api/payments/create-order",
    authenticate,
    rateLimit("ORDER"),
    createPaymentOrder
  );
  app.post("/api/payments/verify", authenticate, verifyPayment);
  app.get("/api/payments/order/:orderId", authenticate, getPaymentStatus);

  // ============================================================================
  // 🧠 AI ROUTES
  // ============================================================================
  app.get("/api/ai/recommendations", authenticate, rateLimit("API"), getAIRecommendations);
  app.post("/api/ai/chat", authenticate, rateLimit("API"), chatWithAI);
  app.post(
    "/api/ai/generate-all-embeddings",
    authenticate,
    authorize("admin"),
    generateAllEmbeddings
  );
  app.get("/api/ai/eta-analytics", authenticate, authorize("admin"), getETAAnalytics);

  // ============================================================================
  // 📊 ADMIN ROUTES
  // ============================================================================
  app.get("/api/admin/orders", authenticate, authorize("admin"), getAllOrders);
  app.get("/api/admin/orders/:id", authenticate, authorize("admin"), getAdminOrderById);
  app.get("/api/metrics", authenticate, authorize("admin"), getMetrics);
  app.get("/api/logs/auth", authenticate, authorize("admin"), getAuthLogs);
  app.get("/api/dlq/orders", authenticate, authorize("admin"), getDLQEntries);
};