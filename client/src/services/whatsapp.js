export const BUSINESS_INFO = {
  name: 'Bela Bakers',
  category: 'Cakes, pastries, cupcakes, cookies, donuts, and desserts',
  phoneDisplay: '9060305323',
  whatsappNumber: '919060305323',
  location: 'Gopalganj, Bihar, India',
  address: 'Dayal Complex, Cinema Road, Near Ambedkar Chowk, Gopalganj',
  instagram: 'https://www.instagram.com/bela.desserts',
  facebook: 'https://www.facebook.com/share/19vyPgVh6g/',
  whatsappOrderNotice:
    'Place your order through WhatsApp. Our team will contact you to confirm availability, delivery details, and payment arrangements.',
  unconfirmedOrderNotice:
    'Your order is not confirmed until Bela Bakers confirms it through WhatsApp.',
};

export const formatINR = (amount) => {
  const num = Number(amount || 0);
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Generates the official WhatsApp order URL for cart items or single-product orders.
 */
export const buildWhatsAppOrderUrl = ({
  items = [],
  customerName = '',
  deliveryDate = '',
  deliveryAddress = '',
  specialInstructions = '',
}) => {
  const itemLines = items.map((item, idx) => {
    const qty = Number(item.quantity || 1);
    const priceStr =
      qty > 1 ? `${formatINR(item.price)} each` : `${formatINR(item.price)}`;
    let line = `${idx + 1}. ${item.name} — ${item.weight} — Quantity: ${qty} — ${priceStr}`;

    if (item.customDetails) {
      const details = [];
      if (item.customDetails.occasion) details.push(`Occasion: ${item.customDetails.occasion}`);
      if (item.customDetails.flavour) details.push(`Flavour: ${item.customDetails.flavour}`);
      if (item.customDetails.cakeMessage) details.push(`Cake Message: "${item.customDetails.cakeMessage}"`);
      if (item.customDetails.designDescription) details.push(`Design: ${item.customDetails.designDescription}`);
      if (details.length > 0) {
        line += `\n   (${details.join(' | ')})`;
      }
    }
    return line;
  });

  const estimatedTotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const messageLines = [
    `Hello ${BUSINESS_INFO.name}!`,
    '',
    'I would like to place an order.',
    '',
    'Items:',
    ...itemLines,
    '',
    `Estimated total: ${formatINR(estimatedTotal)}`,
    '',
    `Customer name: ${customerName.trim() || 'Not provided'}`,
    `Delivery date: ${deliveryDate.trim() || 'To be discussed'}`,
    `Delivery address: ${deliveryAddress.trim() || 'Pickup / To be discussed'}`,
    `Special instructions: ${specialInstructions.trim() || 'None'}`,
    '',
    'Please confirm availability, final pricing, delivery charges, and payment arrangements.',
    '',
    'Thank you!',
  ];

  const encodedText = encodeURIComponent(messageLines.join('\n'));
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodedText}`;
};

/**
 * Generates a WhatsApp link for Custom Cake Requests.
 */
export const buildCustomCakeWhatsAppUrl = ({
  productName = 'Custom Celebration Cake',
  occasion = '',
  desiredWeight = '',
  preferredFlavour = '',
  designDescription = '',
  cakeMessage = '',
  deliveryDate = '',
  customerName = '',
  deliveryAddress = '',
  estimatedPrice = null,
}) => {
  const lines = [
    `Hello ${BUSINESS_INFO.name}!`,
    '',
    'I would like to request a Custom Cake.',
    '',
    `Cake / Reference: ${productName}`,
    `Occasion: ${occasion.trim() || 'Celebration'}`,
    `Desired weight: ${desiredWeight.trim() || 'To be discussed'}`,
    `Preferred flavour: ${preferredFlavour.trim() || 'To be discussed'}`,
    `Cake message: ${cakeMessage.trim() || 'None'}`,
    `Design description: ${designDescription.trim() || 'Standard celebration design'}`,
    estimatedPrice !== null ? `Reference starting price: ${formatINR(estimatedPrice)}` : null,
    '',
    `Customer name: ${customerName.trim() || 'Not provided'}`,
    `Required delivery date: ${deliveryDate.trim() || 'To be discussed'}`,
    `Delivery address: ${deliveryAddress.trim() || 'Pickup / To be discussed'}`,
    '',
    'Please confirm availability, final custom cake pricing, delivery details, and payment arrangements.',
    '',
    'Thank you!',
  ].filter((l) => l !== null);

  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
};

/**
 * Direct general enquiry link for "Contact the Shop" / "Order on WhatsApp" hero button.
 */
export const buildGeneralWhatsAppUrl = (customGreeting = '') => {
  const text =
    customGreeting ||
    `Hello ${BUSINESS_INFO.name}! I would like to enquire about ordering a cake from your shop in Gopalganj.`;
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
};
