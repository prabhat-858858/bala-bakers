import mongoose from 'mongoose';

export const ORDER_STATUSES = [
  'enquiry',
  'contacted',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
];

const orderItemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Item product name is required'],
      trim: true,
    },
    selectedWeight: {
      type: String,
      required: [true, 'Selected weight or variant is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Agreed or estimated item price is required'],
      min: [0, 'Price cannot be negative'],
    },
    customDetails: {
      occasion: { type: String, trim: true, default: '' },
      flavour: { type: String, trim: true, default: '' },
      designDescription: { type: String, trim: true, default: '' },
      cakeMessage: { type: String, trim: true, default: '' },
    },
  },
  { _id: false }
);

const orderRecordSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [120, 'Customer name cannot exceed 120 characters'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters'],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Order record must contain at least one item',
      },
    },
    estimatedTotal: {
      type: Number,
      required: [true, 'Estimated or agreed total is required'],
      min: [0, 'Total cannot be negative'],
    },
    deliveryAddress: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Delivery address cannot exceed 500 characters'],
    },
    requestedDeliveryDate: {
      type: String,
      trim: true,
      default: '',
    },
    orderStatus: {
      type: String,
      enum: {
        values: ORDER_STATUSES,
        message: '{VALUE} is not a valid order status',
      },
      default: 'enquiry',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Internal notes cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const OrderRecord = mongoose.model('OrderRecord', orderRecordSchema);
export default OrderRecord;
