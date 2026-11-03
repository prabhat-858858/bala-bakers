/**
 * Initial Bela Bakers Catalogue Data
 * Preserves original pricing units:
 * - per_pound: Price per pound (standard bakery unit in Bihar/Gopalganj)
 * - fixed: Fixed price for a specified weight (e.g., 500 g, 1 kg, 1 Pound)
 * - per_piece: Individual pastry, cupcake, donut, cookie, or dessert item
 *
 * Items with ambiguous or custom-dependent pricing are explicitly flagged with
 * needsOwnerReview: true and a reviewNote for the owner dashboard.
 */
export const INITIAL_CATALOGUE = [
  // ================= COUNTER CAKES =================
  {
    name: 'Belgian Chocolate Truffle Cake',
    slug: 'belgian-chocolate-truffle-cake',
    description:
      'Rich layers of moist dark chocolate sponge layered and finished with silky Belgian dark chocolate ganache and chocolate curls. Freshly baked daily at Bela Bakers.',
    category: 'Counter Cakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:belgian-chocolate-truffle-cake',
        alt: 'Belgian Chocolate Truffle Cake',
      },
    ],
    variants: [
      { weight: '1 Pound (450 g)', price: 450, pricingUnit: 'per_pound', description: 'Per pound rate (serves 4–6)' },
      { weight: '500 g', price: 480, pricingUnit: 'fixed', description: 'Fixed weight half-kg celebration cake' },
      { weight: '1 kg (2 Pounds)', price: 850, pricingUnit: 'fixed', description: 'Fixed weight 1 kg celebration cake' },
    ],
    isAvailable: true,
    isFeatured: true,
    needsOwnerReview: false,
    reviewNote: '',
  },
  {
    name: 'Classic Red Velvet Cream Cheese Cake',
    slug: 'classic-red-velvet-cream-cheese-cake',
    description:
      'Velvety crimson sponge with a hint of cocoa, layered with smooth whipped cream cheese frosting and topped with signature red velvet crumbs.',
    category: 'Counter Cakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:classic-red-velvet-cream-cheese-cake',
        alt: 'Classic Red Velvet Cream Cheese Cake',
      },
    ],
    variants: [
      { weight: '500 g', price: 500, pricingUnit: 'fixed', description: 'Fixed price for 500 g' },
      { weight: '1 kg', price: 950, pricingUnit: 'fixed', description: 'Fixed price for 1 kg' },
    ],
    isAvailable: true,
    isFeatured: true,
    needsOwnerReview: false,
    reviewNote: '',
  },
  {
    name: 'Fresh Pineapple Crown Cake',
    slug: 'fresh-pineapple-crown-cake',
    description:
      'Light vanilla sponge soaked in tropical pineapple compote, layered with airy whipped cream, juicy pineapple chunks, and glazed cherries.',
    category: 'Counter Cakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:fresh-pineapple-crown-cake',
        alt: 'Fresh Pineapple Crown Cake',
      },
    ],
    variants: [
      { weight: '1 Pound', price: 320, pricingUnit: 'per_pound', description: 'Per pound catalogue price' },
      { weight: '2 Pounds', price: 620, pricingUnit: 'fixed', description: 'Fixed price for 2 Pounds' },
    ],
    isAvailable: true,
    isFeatured: true,
    needsOwnerReview: false,
    reviewNote: '',
  },
  {
    name: 'German Black Forest Gateau',
    slug: 'german-black-forest-gateau',
    description:
      'Classic chocolate sponge layered with whipped Chantilly cream, dark cherry filling, chocolate shavings, and whole maraschino cherries.',
    category: 'Counter Cakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:german-black-forest-gateau',
        alt: 'German Black Forest Gateau',
      },
    ],
    variants: [
      { weight: '1 Pound', price: 360, pricingUnit: 'per_pound', description: 'Per pound catalogue price' },
      { weight: '1 kg', price: 700, pricingUnit: 'fixed', description: 'Fixed price for 1 kg' },
    ],
    isAvailable: true,
    isFeatured: false,
    needsOwnerReview: false,
    reviewNote: '',
  },
  {
    name: 'Royal Butterscotch Crunch Cake',
    slug: 'royal-butterscotch-crunch-cake',
    description:
      'Golden vanilla sponge layered with house-made caramel butterscotch sauce, crunchy praline pearls, and smooth caramel whipped cream.',
    category: 'Counter Cakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:royal-butterscotch-crunch-cake',
        alt: 'Royal Butterscotch Crunch Cake',
      },
    ],
    variants: [
      { weight: '1 Pound', price: 350, pricingUnit: 'per_pound', description: 'Per pound catalogue price' },
      { weight: '2 Pounds', price: 680, pricingUnit: 'fixed', description: 'Fixed price for 2 Pounds' },
    ],
    isAvailable: true,
    isFeatured: true,
    needsOwnerReview: false,
    reviewNote: '',
  },
  {
    name: 'Rasmalai Fusion Celebration Cake',
    slug: 'rasmalai-fusion-celebration-cake',
    description:
      'Cardamom-infused sponge soaked in saffron rabri milk, layered with real rasmalai pieces, roasted pistachios, almonds, and dried rose petals.',
    category: 'Counter Cakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:rasmalai-fusion-celebration-cake',
        alt: 'Rasmalai Fusion Celebration Cake',
      },
    ],
    variants: [
      { weight: '1 Pound', price: 480, pricingUnit: 'per_pound', description: 'Per pound catalogue price' },
      { weight: '1 kg', price: 920, pricingUnit: 'fixed', description: 'Fixed price for 1 kg' },
    ],
    isAvailable: true,
    isFeatured: true,
    needsOwnerReview: false,
    reviewNote: '',
  },

  // ================= CUSTOM CAKES =================
  {
    name: 'Signature Two-Tier Wedding & Anniversary Cake',
    slug: 'signature-two-tier-wedding-anniversary-cake',
    description:
      'Bespoke multi-tier celebration cake finished with artisanal floral piping, metallic gold leaf accents, and your choice of signature flavour.',
    category: 'Custom Cakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:signature-two-tier-wedding-anniversary-cake',
        alt: 'Signature Two-Tier Wedding & Anniversary Cake',
      },
    ],
    variants: [
      { weight: '3 Pounds (1.5 kg)', price: 1450, pricingUnit: 'fixed', description: 'Base estimate for 3 Pounds' },
      { weight: '5 Pounds (2.5 kg)', price: 2400, pricingUnit: 'fixed', description: 'Base estimate for 5 Pounds' },
    ],
    isAvailable: true,
    isFeatured: true,
    needsOwnerReview: true,
    reviewNote:
      'Flagged for owner review: Final custom fondant/floral pricing depends on customer design complexity.',
  },
  {
    name: 'Custom Theme Birthday Designer Cake',
    slug: 'custom-theme-birthday-designer-cake',
    description:
      'Handcrafted theme cake tailored for kids’ birthdays, milestone celebrations, and special occasions. Customize flavour, weight, message, and design.',
    category: 'Custom Cakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:custom-theme-birthday-designer-cake',
        alt: 'Custom Theme Birthday Designer Cake',
      },
    ],
    variants: [
      { weight: '2 Pounds (Per Pound Base)', price: 900, pricingUnit: 'per_pound', description: '₹450 per pound base estimate (minimum 2 Pounds)' },
      { weight: '3 Pounds (Per Pound Base)', price: 1350, pricingUnit: 'per_pound', description: '₹450 per pound base estimate' },
    ],
    isAvailable: true,
    isFeatured: false,
    needsOwnerReview: true,
    reviewNote:
      'Flagged for owner review: Catalogue lists base per-pound rate; custom toppers and fondant work confirmed via WhatsApp.',
  },

  // ================= PASTRIES =================
  {
    name: 'Dutch Chocolate Truffle Pastry',
    slug: 'dutch-chocolate-truffle-pastry',
    description:
      'Individual slice of decadent Dutch cocoa sponge layered with satin chocolate ganache and topped with a dark chocolate curl.',
    category: 'Pastries',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:dutch-chocolate-truffle-pastry',
        alt: 'Dutch Chocolate Truffle Pastry',
      },
    ],
    variants: [
      { weight: 'Single Slice (1 Piece)', price: 80, pricingUnit: 'per_piece', description: 'Per piece price' },
      { weight: 'Box of 4 Pastries', price: 300, pricingUnit: 'fixed', description: 'Assorted or chocolate box of 4' },
    ],
    isAvailable: true,
    isFeatured: false,
    needsOwnerReview: false,
    reviewNote: '',
  },
  {
    name: 'Pineapple Cream Slice Pastry',
    slug: 'pineapple-cream-slice-pastry',
    description:
      'Soft vanilla sponge layered with fresh whipped cream and sweet pineapple compote, topped with a glazed cherry.',
    category: 'Pastries',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:pineapple-cream-slice-pastry',
        alt: 'Pineapple Cream Slice Pastry',
      },
    ],
    variants: [
      { weight: 'Single Slice (1 Piece)', price: 60, pricingUnit: 'per_piece', description: 'Per piece catalogue price' },
    ],
    isAvailable: true,
    isFeatured: false,
    needsOwnerReview: false,
    reviewNote: '',
  },

  // ================= CUPCAKES =================
  {
    name: 'Assorted Gourmet Swirl Cupcakes',
    slug: 'assorted-gourmet-swirl-cupcakes',
    description:
      'Hand-piped cupcakes in Belgian Chocolate, Red Velvet, Vanilla Bean, and Salted Caramel flavours topped with artisanal sprinkles.',
    category: 'Cupcakes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:assorted-gourmet-swirl-cupcakes',
        alt: 'Assorted Gourmet Swirl Cupcakes',
      },
    ],
    variants: [
      { weight: 'Box of 4 Cupcakes', price: 220, pricingUnit: 'fixed', description: 'Fixed box of 4 cupcakes' },
      { weight: 'Box of 6 Cupcakes', price: 320, pricingUnit: 'fixed', description: 'Fixed box of 6 cupcakes' },
    ],
    isAvailable: true,
    isFeatured: false,
    needsOwnerReview: false,
    reviewNote: '',
  },

  // ================= COOKIES =================
  {
    name: 'Artisanal Choco-Chunk & Almond Bakery Cookies',
    slug: 'artisanal-choco-chunk-almond-bakery-cookies',
    description:
      'Crisp, buttery golden cookies loaded with dark chocolate chunks and toasted California almonds, baked fresh in small batches.',
    category: 'Cookies',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:artisanal-choco-chunk-almond-bakery-cookies',
        alt: 'Artisanal Choco-Chunk & Almond Bakery Cookies',
      },
    ],
    variants: [
      { weight: '250 g Pack', price: 160, pricingUnit: 'fixed', description: 'Fixed price for 250 g pack' },
      { weight: '500 g Gift Tin', price: 300, pricingUnit: 'fixed', description: 'Fixed price for 500 g gift tin' },
    ],
    isAvailable: true,
    isFeatured: false,
    needsOwnerReview: false,
    reviewNote: '',
  },

  // ================= DONUTS =================
  {
    name: 'Belgian Chocolate & Oreo Ring Donuts',
    slug: 'belgian-chocolate-oreo-ring-donuts',
    description:
      'Fluffy brioche-style ring donuts dipped in glossy Belgian chocolate glaze and finished with crushed Oreo cookies and white chocolate drizzle.',
    category: 'Donuts',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:belgian-chocolate-oreo-ring-donuts',
        alt: 'Belgian Chocolate & Oreo Ring Donuts',
      },
    ],
    variants: [
      { weight: 'Single Donut (1 Piece)', price: 70, pricingUnit: 'per_piece', description: 'Per piece price' },
      { weight: 'Box of 4 Donuts', price: 260, pricingUnit: 'fixed', description: 'Assorted box of 4 donuts' },
    ],
    isAvailable: true,
    isFeatured: false,
    needsOwnerReview: false,
    reviewNote: '',
  },

  // ================= DESSERTS =================
  {
    name: 'Lotus Biscoff Baked Cheesecake Jar',
    slug: 'lotus-biscoff-baked-cheesecake-jar',
    description:
      'Creamy cheesecake layered in a glass jar over spiced Lotus Biscoff biscuit crumble and topped with warm Biscoff spread.',
    category: 'Desserts',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=80',
        publicId: 'catalogue:lotus-biscoff-baked-cheesecake-jar',
        alt: 'Lotus Biscoff Baked Cheesecake Jar',
      },
    ],
    variants: [
      { weight: 'Single Dessert Jar (200 ml)', price: 150, pricingUnit: 'per_piece', description: 'Per jar price' },
      { weight: 'Duo Pack (2 Jars)', price: 280, pricingUnit: 'fixed', description: 'Pack of 2 dessert jars' },
    ],
    isAvailable: true,
    isFeatured: false,
    needsOwnerReview: false,
    reviewNote: '',
  },
];
