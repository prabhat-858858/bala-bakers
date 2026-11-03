import ShopSettings from '../models/ShopSettings.js';
import { sanitizePayload } from '../utils/sanitize.js';

export const getSettings = async (_req, res) => {
  try {
    let settings = await ShopSettings.findOne({ key: 'main' }).lean();
    if (!settings) {
      settings = await ShopSettings.create({ key: 'main' });
    }
    return res.json({
      success: true,
      settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load shop settings.',
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const cleanBody = sanitizePayload(req.body);
    let settings = await ShopSettings.findOne({ key: 'main' });
    if (!settings) {
      settings = new ShopSettings({ key: 'main' });
    }

    if (cleanBody.openingHoursConfigured !== undefined) {
      settings.openingHoursConfigured = Boolean(cleanBody.openingHoursConfigured);
    }
    if (cleanBody.openingHoursText !== undefined) {
      settings.openingHoursText = String(cleanBody.openingHoursText).trim();
    }
    if (cleanBody.mapConfigured !== undefined) {
      settings.mapConfigured = Boolean(cleanBody.mapConfigured);
    }
    if (cleanBody.mapLink !== undefined) {
      settings.mapLink = String(cleanBody.mapLink).trim();
    }
    if (cleanBody.mapEmbedUrl !== undefined) {
      settings.mapEmbedUrl = String(cleanBody.mapEmbedUrl).trim();
    }

    await settings.save();

    return res.json({
      success: true,
      message: 'Shop settings updated.',
      settings,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update shop settings.',
    });
  }
};
