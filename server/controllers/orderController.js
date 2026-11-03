import OrderRecord, { ORDER_STATUSES } from '../models/OrderRecord.js';
import Product from '../models/Product.js';
import { sanitizePayload } from '../utils/sanitize.js';

// GET /api/orders
export const getOrders = async (_req, res) => {
  try {
    const [orders, totalActiveProducts, unavailableProducts, flaggedForReviewProducts] =
      await Promise.all([
        OrderRecord.find().sort({ createdAt: -1 }).lean(),
        Product.countDocuments({ isAvailable: true }),
        Product.countDocuments({ isAvailable: false }),
        Product.countDocuments({ needsOwnerReview: true }),
      ]);

    // Calculate most popular products ONLY if sufficient real order data exists
    const popularityMap = new Map();
    for (const order of orders) {
      if (order.orderStatus === 'cancelled') continue;
      for (const item of order.items || []) {
        const key = item.productName;
        const prev = popularityMap.get(key) || { productName: key, totalQuantity: 0, orderCount: 0 };
        prev.totalQuantity += Number(item.quantity || 1);
        prev.orderCount += 1;
        popularityMap.set(key, prev);
      }
    }

    const popularProducts = Array.from(popularityMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    return res.json({
      success: true,
      orders,
      overview: {
        totalActiveProducts,
        unavailableProducts,
        flaggedForReviewProducts,
        totalRecordedOrders: orders.length,
        recentOrders: orders.slice(0, 5),
        popularProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch manual order records.',
      error: error.message,
    });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderRecord.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order record not found.',
      });
    }
    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order record.',
    });
  }
};

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const cleanBody = sanitizePayload(req.body);
    const {
      customerName,
      customerPhone,
      items,
      estimatedTotal,
      deliveryAddress,
      requestedDeliveryDate,
      orderStatus,
      notes,
    } = cleanBody;

    if (!customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone number are required.',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required to record an enquiry or order.',
      });
    }

    const validatedItems = items.map((item) => {
      const productName = String(item.productName || '').trim();
      const selectedWeight = String(item.selectedWeight || item.weight || '').trim();
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);

      if (!productName || !selectedWeight) {
        throw new Error('Each item must specify a product name and selected weight.');
      }
      if (Number.isNaN(quantity) || quantity < 1) {
        throw new Error(`Invalid quantity for "${productName}".`);
      }
      if (Number.isNaN(price) || price < 0) {
        throw new Error(`Invalid price for "${productName}".`);
      }

      return {
        productName,
        selectedWeight,
        quantity,
        price,
        customDetails: {
          occasion: String(item.customDetails?.occasion || '').trim(),
          flavour: String(item.customDetails?.flavour || '').trim(),
          designDescription: String(item.customDetails?.designDescription || '').trim(),
          cakeMessage: String(item.customDetails?.cakeMessage || '').trim(),
        },
      };
    });

    const computedTotal =
      estimatedTotal !== undefined && !Number.isNaN(Number(estimatedTotal))
        ? Number(estimatedTotal)
        : validatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const status = ORDER_STATUSES.includes(orderStatus) ? orderStatus : 'enquiry';

    const order = await OrderRecord.create({
      customerName,
      customerPhone,
      items: validatedItems,
      estimatedTotal: computedTotal,
      deliveryAddress: deliveryAddress || '',
      requestedDeliveryDate: requestedDeliveryDate || '',
      orderStatus: status,
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: 'WhatsApp enquiry / order recorded manually.',
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Could not create order record.',
    });
  }
};

// PUT /api/orders/:id
export const updateOrder = async (req, res) => {
  try {
    const order = await OrderRecord.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order record not found.',
      });
    }

    const cleanBody = sanitizePayload(req.body);
    const {
      customerName,
      customerPhone,
      items,
      estimatedTotal,
      deliveryAddress,
      requestedDeliveryDate,
      orderStatus,
      notes,
    } = cleanBody;

    if (customerName !== undefined) order.customerName = String(customerName).trim();
    if (customerPhone !== undefined) order.customerPhone = String(customerPhone).trim();
    if (deliveryAddress !== undefined) order.deliveryAddress = String(deliveryAddress).trim();
    if (requestedDeliveryDate !== undefined) {
      order.requestedDeliveryDate = String(requestedDeliveryDate).trim();
    }
    if (notes !== undefined) order.notes = String(notes).trim();

    if (orderStatus !== undefined) {
      if (!ORDER_STATUSES.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed values: ${ORDER_STATUSES.join(', ')}`,
        });
      }
      order.orderStatus = orderStatus;
    }

    if (Array.isArray(items) && items.length > 0) {
      order.items = items.map((item) => ({
        productName: String(item.productName || '').trim(),
        selectedWeight: String(item.selectedWeight || '').trim(),
        quantity: Math.max(1, Number(item.quantity || 1)),
        price: Math.max(0, Number(item.price || 0)),
        customDetails: {
          occasion: String(item.customDetails?.occasion || '').trim(),
          flavour: String(item.customDetails?.flavour || '').trim(),
          designDescription: String(item.customDetails?.designDescription || '').trim(),
          cakeMessage: String(item.customDetails?.cakeMessage || '').trim(),
        },
      }));
    }

    if (estimatedTotal !== undefined && !Number.isNaN(Number(estimatedTotal))) {
      order.estimatedTotal = Math.max(0, Number(estimatedTotal));
    }

    await order.save();

    return res.json({
      success: true,
      message: 'Order record updated.',
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update order record.',
    });
  }
};
