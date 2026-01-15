// ============================================================================
// CLOUDINARY UTILITIES
// ============================================================================

import { v2 as cloudinary } from "cloudinary";
import { CONFIG } from "../config";

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