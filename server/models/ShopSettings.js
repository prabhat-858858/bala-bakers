import mongoose from 'mongoose';

const shopSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
    },
    openingHoursConfigured: {
      type: Boolean,
      default: false,
    },
    openingHoursText: {
      type: String,
      trim: true,
      default: '',
    },
    mapConfigured: {
      type: Boolean,
      default: false,
    },
    mapLink: {
      type: String,
      trim: true,
      default: '',
    },
    mapEmbedUrl: {
      type: String,
      trim: true,
      default: '',
    },
    announcementText: {
      type: String,
      trim: true,
      default: 'Place your order through WhatsApp. Our team will contact you to confirm availability, delivery details, and payment arrangements.',
    },
  },
  { timestamps: true }
);

const ShopSettings = mongoose.model('ShopSettings', shopSettingsSchema);
export default ShopSettings;
