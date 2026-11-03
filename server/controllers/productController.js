import mongoose from 'mongoose';
import Product, { PRODUCT_CATEGORIES } from '../models/Product.js';
import { uploadCakeImage, deleteCakeImage } from '../config/cloudinary.js';
import { slugify, sanitizePayload } from '../utils/sanitize.js';

const parseVariantsInput = (rawVariants) => {
  let parsed = rawVariants;
  if (typeof rawVariants === 'string') {
    try {
      parsed = JSON.parse(rawVariants);
    } catch {
      throw new Error('Invalid variants format.');
    }
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('At least one cake weight/price variant is required.');
  }
  return parsed.map((v) => {
    const weight = String(v.weight || '').trim();
    const price = Number(v.price);
    if (!weight) {
      throw new Error('Each variant must have a weight or unit label.');
    }
    if (Number.isNaN(price) || price < 0) {
      throw new Error(`Invalid price for variant "${weight}".`);
    }
    return {
      weight,
      price,
      pricingUnit: ['fixed', 'per_pound', 'per_piece'].includes(v.pricingUnit)
        ? v.pricingUnit
        : 'fixed',
      description: String(v.description || '').trim(),
    };
  });
};

const ensureUniqueSlug = async (baseName, excludeId = null) => {
  let baseSlug = slugify(baseName);
  if (!baseSlug) baseSlug = `cake-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Product.findOne(query).lean();
    if (!existing) return candidate;
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
};

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      featured,
      adminView,
    } = req.query;

    const isAdminView = Boolean(req.admin) && adminView === 'true';
    const filter = {};

    // Public customers only see available products
    if (!isAdminView) {
      filter.isAvailable = true;
    }

    if (category && category !== 'All') {
      filter.category = String(category);
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (search && String(search).trim()) {
      const safeSearch = String(search)
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { category: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    let products = await Product.find(filter).sort({ isFeatured: -1, createdAt: -1 }).lean();

    // Filter by minimum variant price if minPrice or maxPrice specified
    if (minPrice !== undefined && minPrice !== '') {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) {
        products = products.filter((p) => {
          const lowest = Math.min(...p.variants.map((v) => v.price));
          return lowest >= min;
        });
      }
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) {
        products = products.filter((p) => {
          const lowest = Math.min(...p.variants.map((v) => v.price));
          return lowest <= max;
        });
      }
    }

    // Sort products
    if (sort === 'price_asc') {
      products.sort(
        (a, b) =>
          Math.min(...a.variants.map((v) => v.price)) -
          Math.min(...b.variants.map((v) => v.price))
      );
    } else if (sort === 'price_desc') {
      products.sort(
        (a, b) =>
          Math.min(...b.variants.map((v) => v.price)) -
          Math.min(...a.variants.map((v) => v.price))
      );
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({
      success: true,
      count: products.length,
      categories: PRODUCT_CATEGORIES,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load products from database.',
      error: error.message,
    });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug: String(id).toLowerCase().trim() }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Cake or dessert not found.',
      });
    }

    if (!product.isAvailable && !req.admin) {
      return res.status(404).json({
        success: false,
        message: 'This product is currently unavailable.',
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product details.',
      error: error.message,
    });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const cleanBody = sanitizePayload(req.body);
    const {
      name,
      description,
      category,
      variants: rawVariants,
      isAvailable,
      isFeatured,
      needsOwnerReview,
      reviewNote,
      imageUrl,
    } = cleanBody;

    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name, description, and category are required.',
      });
    }

    if (!PRODUCT_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
      });
    }

    const variants = parseVariantsInput(rawVariants);
    const slug = await ensureUniqueSlug(name);

    const images = [];
    if (req.file) {
      const uploaded = await uploadCakeImage(req.file.path, name);
      images.push({
        url: uploaded.url,
        publicId: uploaded.publicId,
        alt: name,
      });
    } else if (imageUrl && String(imageUrl).trim()) {
      images.push({
        url: String(imageUrl).trim(),
        publicId: '',
        alt: name,
      });
    } else if (Array.isArray(cleanBody.images) && cleanBody.images.length > 0) {
      for (const img of cleanBody.images) {
        if (img.url) {
          images.push({
            url: img.url,
            publicId: img.publicId || '',
            alt: img.alt || name,
          });
        }
      }
    }

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a cake photograph or provide a valid image URL.',
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      images,
      variants,
      isAvailable: isAvailable === undefined ? true : String(isAvailable) === 'true' || isAvailable === true,
      isFeatured: String(isFeatured) === 'true' || isFeatured === true,
      needsOwnerReview: String(needsOwnerReview) === 'true' || needsOwnerReview === true,
      reviewNote: reviewNote || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Product added to Bela Bakers catalogue.',
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Could not create product.',
    });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const cleanBody = sanitizePayload(req.body);
    const {
      name,
      description,
      category,
      variants: rawVariants,
      isAvailable,
      isFeatured,
      needsOwnerReview,
      reviewNote,
      imageUrl,
    } = cleanBody;

    if (name !== undefined && String(name).trim()) {
      if (String(name).trim() !== product.name) {
        product.slug = await ensureUniqueSlug(name, product._id);
      }
      product.name = String(name).trim();
    }

    if (description !== undefined) {
      product.description = String(description).trim();
    }

    if (category !== undefined) {
      if (!PRODUCT_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
        });
      }
      product.category = category;
    }

    if (rawVariants !== undefined) {
      product.variants = parseVariantsInput(rawVariants);
    }

    if (isAvailable !== undefined) {
      product.isAvailable = String(isAvailable) === 'true' || isAvailable === true;
    }

    if (isFeatured !== undefined) {
      product.isFeatured = String(isFeatured) === 'true' || isFeatured === true;
    }

    if (needsOwnerReview !== undefined) {
      product.needsOwnerReview = String(needsOwnerReview) === 'true' || needsOwnerReview === true;
    }

    if (reviewNote !== undefined) {
      product.reviewNote = String(reviewNote).trim();
    }

    // Handle image replacement if a new file or new imageUrl was provided
    if (req.file) {
      const uploaded = await uploadCakeImage(req.file.path, product.name);
      // Clean up old Cloudinary images
      for (const oldImg of product.images) {
        if (oldImg.publicId) {
          await deleteCakeImage(oldImg.publicId);
        }
      }
      product.images = [
        {
          url: uploaded.url,
          publicId: uploaded.publicId,
          alt: product.name,
        },
      ];
    } else if (imageUrl && String(imageUrl).trim() && String(imageUrl).trim() !== product.images?.[0]?.url) {
      for (const oldImg of product.images) {
        if (oldImg.publicId) {
          await deleteCakeImage(oldImg.publicId);
        }
      }
      product.images = [
        {
          url: String(imageUrl).trim(),
          publicId: '',
          alt: product.name,
        },
      ];
    }

    await product.save();

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product.',
    });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Delete any associated Cloudinary images
    for (const img of product.images) {
      if (img.publicId) {
        await deleteCakeImage(img.publicId);
      }
    }

    await product.deleteOne();

    return res.json({
      success: true,
      message: 'Product removed from catalogue.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
      error: error.message,
    });
  }
};
