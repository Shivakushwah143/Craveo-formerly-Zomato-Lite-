// ============================================================================
// PRODUCT CONTROLLERS
// ============================================================================

import { Request, Response } from "express";
import { 
  CreateProductRequestBody 
} from "../types";
import { Product } from "../models";
import { 
  cacheGet, 
  cacheSet, 
  cacheInvalidate, 
  publishEvent, 
  generateProductEmbedding 
} from "../utils";
import { producer } from "../index";
import { uploadToCloudinary } from "../utils/cloudinary";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const cached = await cacheGet("menu:all");
    if (cached) {
      res.json({ source: "cache", products: cached });
      return;
    }

    const products = await Product.find({ isAvailable: true });
    await cacheSet("menu:all", products);

    res.json({ source: "database", products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const cached = await cacheGet(`product:${id}`);
    if (cached) {
      res.json({ source: "cache", product: cached });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await cacheSet(`product:${id}`, product);
    res.json({ source: "database", product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category } = req.body as CreateProductRequestBody;

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length < 3) {
      res.status(400).json({ error: "At least 3 product images required" });
      return;
    }

    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.buffer, "zomato-products")
    );
    const imageUrls = await Promise.all(uploadPromises);

    const product = new Product({
      name,
      description,
      price: parseFloat(price.toString()),
      category,
      imageUrls,
    });

    await product.save();
    await generateProductEmbedding(product);
    await cacheInvalidate("menu:*");
    await cacheInvalidate("product:*");

    await publishEvent(producer, "product-updates", {
      type: "PRODUCT_CREATED",
      productId: product._id.toString(),
      timestamp: Date.now(),
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price.toString());
    if (category) product.category = category;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      if (files.length < 3) {
        res.status(400).json({ error: "At least 3 product images required" });
        return;
      }

      const uploadPromises = files.map((file) =>
        uploadToCloudinary(file.buffer, "zomato-products")
      );
      const imageUrls = await Promise.all(uploadPromises);
      product.imageUrls = imageUrls;
    }

    product.updatedAt = new Date();
    await product.save();
    await generateProductEmbedding(product);

    await cacheInvalidate("menu:*");
    await cacheInvalidate(`product:${id}`);

    await publishEvent(producer, "product-updates", {
      type: "PRODUCT_UPDATED",
      productId: id,
      timestamp: Date.now(),
    });

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await cacheInvalidate("menu:*");
    await cacheInvalidate(`product:${id}`);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};