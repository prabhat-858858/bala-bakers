import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

export const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  return (
    Boolean(CLOUDINARY_CLOUD_NAME) &&
    Boolean(CLOUDINARY_API_KEY) &&
    Boolean(CLOUDINARY_API_SECRET) &&
    CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
  );
};

export const initCloudinary = () => {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    console.log('☁️ Cloudinary configured for product image management.');
  } else {
    console.log('ℹ️ Cloudinary credentials not configured in .env; using local /uploads storage fallback.');
  }
};

/**
 * Upload an image file to Cloudinary with automatic compression & sizing,
 * or store locally in /uploads if Cloudinary credentials are not set yet.
 */
export const uploadCakeImage = async (filePath, originalName = 'cake') => {
  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'bela-bakers/products',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
      });
      // Clean up temporary file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  // Fallback for local testing when Cloudinary env vars are not yet set
  const filename = path.basename(filePath);
  return {
    url: `/uploads/${filename}`,
    publicId: `local:${filename}`,
  };
};

/**
 * Delete an image from Cloudinary (or local fallback) when a product image is replaced or deleted.
 */
export const deleteCakeImage = async (publicId) => {
  if (!publicId) return;

  if (publicId.startsWith('local:')) {
    const filename = publicId.replace('local:', '');
    const localPath = path.join(process.cwd(), 'uploads', filename);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.warn('Failed to remove local image:', err.message);
      }
    }
    return;
  }

  if (isCloudinaryConfigured() && !publicId.startsWith('catalogue:')) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn(`Failed to delete Cloudinary asset ${publicId}:`, err.message);
    }
  }
};
