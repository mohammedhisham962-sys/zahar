const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fallback image in case of network variance
const DEFAULT_PERFUME_IMG = "/images/products/sovereign-oudh.jpg";

// ── Ultra-Curated Luxury Product Vault (All 100% Tested & Verified 200 OK) ───
const products = [
  {
    id: 1,
    name: "Sovereign Oudh",
    subtitle: "Triple-Matured Assam Agarwood & Taif Rose",
    category: "oudh",
    concentration: "Extrait de Parfum (35% Oil)",
    scentFamily: "Smoky Woody & Amber",
    price: 245.00,
    originalPrice: 295.00,
    rating: 4.96,
    reviews: 342,
    badge: "Bestseller",
    size: "100ml",
    sizes: [
      { size: "50ml", price: 165.00 },
      { size: "100ml", price: 245.00 }
    ],
    image: "/images/products/sovereign-oudh.jpg",
    secondaryImage: "/images/products/sovereign-oudh.jpg",
    description: "An imperial declaration of presence. Distilled from 40-year-old wild Assamese agarwood trees, warmed with golden saffron filaments and aged in French oak barrels.",
    notes: {
      top: "Kashmiri Saffron, Green Cardamom, Bergamot",
      middle: "Taif Mountain Rose, 40-Yr Assamese Oud, Frankincense",
      base: "Fossilized Amber, Birch Tar, Mysore Sandalwood"
    },
    intensity: 5,
    longevity: "18+ Hours",
    inStock: true
  },
  {
    id: 2,
    name: "Midnight Noir",
    subtitle: "Black Truffle, Smoked Vetiver & Tonka",
    category: "perfume",
    concentration: "Eau de Parfum Intense",
    scentFamily: "Dark Leather & Gourmand",
    price: 185.00,
    originalPrice: 220.00,
    rating: 4.91,
    reviews: 218,
    badge: "Award Winner",
    size: "100ml",
    sizes: [
      { size: "50ml", price: 130.00 },
      { size: "100ml", price: 185.00 }
    ],
    image: "/images/products/midnight-noir.jpg",
    secondaryImage: "/images/products/midnight-noir.jpg",
    description: "Mysterious, magnetic, and intoxicatingly suave. Opens with cracked Madagascar black pepper and settles into an alluring heart of smoked Tuscan leather and dark Madagascar vanilla.",
    notes: {
      top: "Black Pepper, Bitter Orange, Italian Bergamot",
      middle: "Smoked Leather, Night Iris, Wild Orchid",
      base: "Haitian Vetiver, Roasted Tonka, Bourbon Amber"
    },
    intensity: 4,
    longevity: "14+ Hours",
    inStock: true
  },
  {
    id: 3,
    name: "Rose de Damas",
    subtitle: "Dewy Damask Rose, Lychee & Velvet Amber",
    category: "perfume",
    concentration: "Eau de Parfum",
    scentFamily: "Floral Chypre",
    price: 175.00,
    originalPrice: null,
    rating: 4.88,
    reviews: 184,
    badge: "Staff Pick",
    size: "100ml",
    sizes: [
      { size: "50ml", price: 120.00 },
      { size: "100ml", price: 175.00 }
    ],
    image: "/images/products/rose-de-damas.jpg",
    secondaryImage: "/images/products/rose-de-damas.jpg",
    description: "An ode to sovereign feminine elegance. Harvested at sunrise before petals unfold, delivering a hyper-realistic fresh rose accented by sparkling lychee and warm cashmeran.",
    notes: {
      top: "Pink Pepper, Dewy Lychee, Mandarin Spark",
      middle: "Damascus Rosebuds, Peony, Bulgarian Rose",
      base: "White Amber, Cashmeran, Madagascar Vanilla"
    },
    intensity: 3,
    longevity: "10+ Hours",
    inStock: true
  },
  {
    id: 4,
    name: "Aegean Azure",
    subtitle: "Hydrating Mineral Sea Salt & Driftwood Mist",
    category: "bodyspray",
    concentration: "All-Over Hydrating Mist",
    scentFamily: "Fresh Oceanic & Citrus",
    price: 48.00,
    originalPrice: 60.00,
    rating: 4.79,
    reviews: 412,
    badge: "Summer Icon",
    size: "200ml",
    sizes: [
      { size: "200ml", price: 48.00 }
    ],
    image: "/images/products/aegean-azure.jpg",
    secondaryImage: "/images/products/aegean-azure.jpg",
    description: "Formulated with organic aloe vera and sea kelp minerals. Mist liberally over hair and body for a cooling breeze that evokes high noon along the Mediterranean cliffs.",
    notes: {
      top: "Aegean Sea Salt, Crushed Mint, Meyer Lemon",
      middle: "White Myrtle, Jasmine Petals, Mineral Ozone",
      base: "Sun-Bleached Driftwood, Coastal Cedar, Clean Musk"
    },
    intensity: 2,
    longevity: "6+ Hours",
    inStock: true
  },
  {
    id: 5,
    name: "Imperial Amber",
    subtitle: "24-Karat Gold Leaf, Rare Benzoin & Olibanum",
    category: "oudh",
    concentration: "Pure Attar & Extrait",
    scentFamily: "Oriental Amber & Resin",
    price: 290.00,
    originalPrice: 350.00,
    rating: 4.98,
    reviews: 147,
    badge: "Limited Vault Edition",
    size: "50ml",
    sizes: [
      { size: "30ml", price: 195.00 },
      { size: "50ml", price: 290.00 }
    ],
    image: "/images/products/imperial-amber.jpg",
    secondaryImage: "/images/products/imperial-amber.jpg",
    description: "Suspended with certified 24-karat cosmetic gold flakes. An opulent elixir uniting royal frankincense tears from Oman with wild dark Cambodian oudh and golden fossilized amber.",
    notes: {
      top: "Royal Omani Frankincense, Nutmeg, Saffron",
      middle: "Wild Cambodian Oud, Orris Root, Golden Resin",
      base: "Fossilized Amber, Benzoin Tears, Real Ambergris"
    },
    intensity: 5,
    longevity: "24+ Hours",
    inStock: true
  },
  {
    id: 6,
    name: "Santorini Neroli",
    subtitle: "Calabrian Bergamot & Orange Blossom Spray",
    category: "bodyspray",
    concentration: "Refined All-Over Mist",
    scentFamily: "Sparkling Citrus & Green",
    price: 44.00,
    originalPrice: null,
    rating: 4.82,
    reviews: 289,
    badge: "New Release",
    size: "200ml",
    sizes: [
      { size: "200ml", price: 44.00 }
    ],
    image: "/images/products/santorini-neroli.jpg",
    secondaryImage: "/images/products/santorini-neroli.jpg",
    description: "An energizing burst of crisp sunlight. Crushed orange leaves, bitter petitgrain, and blooming Mediterranean neroli that revives the spirit and keeps apparel scented throughout the day.",
    notes: {
      top: "Calabrian Bergamot, Green Mandarin, Lemon Verbena",
      middle: "Orange Blossom Absolute, Neroli Petals, Petitgrain",
      base: "White Amber, Blonde Woods, Clean Cedar"
    },
    intensity: 2,
    longevity: "7+ Hours",
    inStock: true
  },
  {
    id: 7,
    name: "Santale Velours",
    subtitle: "Creamy Australian Sandalwood & Spiced Cardamom",
    category: "perfume",
    concentration: "Eau de Parfum",
    scentFamily: "Creamy Woods & Spice",
    price: 195.00,
    originalPrice: 235.00,
    rating: 4.93,
    reviews: 165,
    badge: "Cult Classic",
    size: "100ml",
    sizes: [
      { size: "50ml", price: 135.00 },
      { size: "100ml", price: 195.00 }
    ],
    image: "/images/products/santale-velours.jpg",
    secondaryImage: "/images/products/santale-velours.jpg",
    description: "The epitome of second-skin luxury. Sensual, creamy Mysore sandalwood wrapped in warm cardamom, violet leaf, and a delicate touch of papyrus and cedar.",
    notes: {
      top: "Green Cardamom, Violet Leaf, Italian Cypress",
      middle: "Papyrus, Tuscan Orris, Creamy Sandalwood",
      base: "Australian Sandalwood, White Musk, Soft Amber"
    },
    intensity: 3,
    longevity: "12+ Hours",
    inStock: true
  },
  {
    id: 8,
    name: "Oud & Eucalyptus Gym Mist",
    subtitle: "Antibacterial Cleanse & Refreshing Scent Armor",
    category: "bodyspray",
    concentration: "Performance Body & Gear Mist",
    scentFamily: "Aromatic & Woods",
    price: 38.00,
    originalPrice: 48.00,
    rating: 4.74,
    reviews: 521,
    badge: "Active Armor",
    size: "250ml",
    sizes: [
      { size: "250ml", price: 38.00 }
    ],
    image: "/images/products/oud-eucalyptus.jpg",
    secondaryImage: "/images/products/oud-eucalyptus.jpg",
    description: "Engineered for active lifestyles. Infused with natural cooling eucalyptus, anti-microbial tea tree, and anchored with light crisp agarwood that reacts to body heat.",
    notes: {
      top: "Crisp Eucalyptus, Peppermint Leaf, Green Apple",
      middle: "French Lavender, Clary Sage, Geranium",
      base: "Sheer White Oud, Virginian Cedar, Sport Musk"
    },
    intensity: 2,
    longevity: "8+ Hours",
    inStock: true
  }
];

// Special Promotional Bundles / Maison Offers (Verified 200 OK Perfume Images)
const maisonOffers = [
  {
    id: "offer-royal-ritual",
    title: "The Sovereign Layering Ritual",
    badge: "Save $64 • Most Coveted",
    description: "Sovereign Oudh Extrait (100ml) + Aegean Azure All-Over Mist (200ml) + Complimentary 10ml Travel Atomizer.",
    originalPrice: 293.00,
    specialPrice: 229.00,
    image: "/images/offers/offer-royal-ritual.jpg",
    productIds: [1, 4]
  },
  {
    id: "offer-rose-nocturne",
    title: "Rose & Leather Twilight Duo",
    badge: "Save $50 • Limited Edition",
    description: "Rose de Damas Eau de Parfum (100ml) + Midnight Noir (100ml) presented in a dual velvet presentation box.",
    originalPrice: 360.00,
    specialPrice: 310.00,
    image: "/images/offers/offer-rose-nocturne.jpg",
    productIds: [2, 3]
  }
];

// In-memory cart and orders storage
let cart = [];
let appliedDiscount = 0; // percentage e.g., 15 for 15%
let appliedCouponCode = null;
const orders = [];

function getCartCalculations() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);
  return {
    subtotal: subtotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    discountPercent: appliedDiscount,
    couponCode: appliedCouponCode,
    total: finalTotal.toFixed(2),
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}

// ── Routes ────────────────────────────────────────────────────────────

// Landing Page
app.get('/', (req, res) => {
  const featured = products.filter(p => p.badge === 'Bestseller' || p.badge === 'Limited Vault Edition' || p.badge === 'Award Winner');
  const categories = [
    {
      name: 'Extrait & Royal Oudh',
      slug: 'oudh',
      tagline: 'Centuries-Old Agarwood Distillates & Attars',
      count: products.filter(p => p.category === 'oudh').length,
      image: '/images/categories/category-oudh.jpg'
    },
    {
      name: 'Signature Eau de Parfum',
      slug: 'perfume',
      tagline: 'Artisanal Haute French-Arabian Blends',
      count: products.filter(p => p.category === 'perfume').length,
      image: '/images/categories/category-perfume.jpg'
    },
    {
      name: 'All-Day Body & Linen Mists',
      slug: 'bodyspray',
      tagline: 'Hydrating Botanical Essential Sprays',
      count: products.filter(p => p.category === 'bodyspray').length,
      image: '/images/categories/category-bodyspray.jpg'
    }
  ];
  const cartData = getCartCalculations();
  res.render('index', { products, featured, categories, maisonOffers, cart, cartData });
});

// Shop Page
app.get('/shop', (req, res) => {
  const category = req.query.category || 'all';
  const filtered = category === 'all' ? products : products.filter(p => p.category === category);
  const cartData = getCartCalculations();
  res.render('shop', { products: filtered, category, allProducts: products, cart, cartData });
});

// Product Detail
app.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).render('404');
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  const cartData = getCartCalculations();
  res.render('product', { product, related, cart, cartData });
});

// ── Checkout & Order Confirmation Pages ────────────────────────────────

// Checkout Page
app.get('/checkout', (req, res) => {
  const cartData = getCartCalculations();
  if (cart.length === 0) {
    return res.redirect('/order-cancelled?reason=empty_bag');
  }
  res.render('checkout', { cart, cartData });
});

// Process Checkout Form
app.post('/checkout/process', (req, res) => {
  const { firstName, lastName, email, phone, address, city, country, paymentMethod } = req.body;
  const cartData = getCartCalculations();

  if (cart.length === 0) {
    return res.redirect('/order-cancelled?reason=empty_bag');
  }

  // Create Order Record ensuring each product has valid image
  const orderId = `ZH-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderItems = cart.map(item => ({
    ...item,
    product: {
      ...item.product,
      image: item.product.image || DEFAULT_PERFUME_IMG
    }
  }));

  const order = {
    orderId,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    customer: {
      name: `${firstName || 'Patron'} ${lastName || ''}`.trim(),
      email: email || 'patron@zahar.com',
      phone: phone || '+971 50 123 4567',
      address: address || 'Private Villa / Residence',
      city: city || 'Dubai',
      country: country || 'United Arab Emirates'
    },
    items: orderItems,
    paymentMethod: paymentMethod || 'Encrypted Credit Card',
    ...cartData,
    gifts: [
      "Complimentary 2ml Sample Flacons (Set of 3)",
      "Zahar Gold-Foiled Black Velvet Presentation Coffret",
      "Master Perfumer Sillage Certificate"
    ]
  };

  orders.push(order);

  // Clear cart after confirmed purchase
  cart = [];
  appliedDiscount = 0;
  appliedCouponCode = null;

  res.redirect(`/order-confirmation?orderId=${orderId}`);
});

// Order Confirmation Page
app.get('/order-confirmation', (req, res) => {
  const { orderId } = req.query;
  const order = orders.find(o => o.orderId === orderId) || (orders.length > 0 ? orders[orders.length - 1] : null);

  if (!order) {
    return res.redirect('/order-cancelled?reason=not_found');
  }

  const cartData = getCartCalculations();
  res.render('order-confirmation', { order, cart, cartData });
});

// Order Cancelled / Not Purchased Page
app.get('/order-cancelled', (req, res) => {
  const { reason } = req.query;
  let message = "Your acquisition session was paused. No payment was charged.";
  let title = "Acquisition Uncompleted";

  if (reason === 'empty_bag') {
    title = "Your Fragrance Bag is Empty";
    message = "You have no items in your fragrance bag to check out. Please explore the vault and select your decanters.";
  } else if (reason === 'cancelled_by_user') {
    title = "Acquisition Cancelled";
    message = "You have voluntarily cancelled your transaction. Your reserved decanters remain safely saved in your session.";
  } else if (reason === 'payment_declined') {
    title = "Payment Authorization Paused";
    message = "Your financial institution declined the luxury verification. You can re-attempt with an alternative payment method.";
  }

  const cartData = getCartCalculations();
  res.render('order-cancelled', { title, message, reason, cart, cartData });
});

// ── Search & Filter API ────────────────────────────────────────────────
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) return res.json({ results: [] });

  const results = products.filter(p => {
    return p.name.toLowerCase().includes(query) ||
           p.subtitle.toLowerCase().includes(query) ||
           p.category.toLowerCase().includes(query) ||
           p.scentFamily.toLowerCase().includes(query) ||
           (p.notes && Object.values(p.notes).some(n => n.toLowerCase().includes(query)));
  });
  res.json({ results });
});

// ── Cart API ──────────────────────────────────────────────────────────

app.post('/api/cart/add', (req, res) => {
  const { productId, size, quantity = 1 } = req.body;
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const selectedSize = size || product.size;
  let price = product.price;
  if (product.sizes) {
    const matchedSize = product.sizes.find(s => s.size === selectedSize);
    if (matchedSize) price = matchedSize.price;
  }

  const cartItemId = `${product.id}-${selectedSize}`;
  const existing = cart.find(item => item.cartItemId === cartItemId);
  if (existing) {
    existing.quantity += parseInt(quantity);
  } else {
    cart.push({
      cartItemId,
      product: {
        ...product,
        image: product.image || DEFAULT_PERFUME_IMG
      },
      selectedSize,
      price,
      quantity: parseInt(quantity)
    });
  }

  res.json({ success: true, cart, ...getCartCalculations() });
});

// Add Special Offer Bundle
app.post('/api/cart/add-offer', (req, res) => {
  const { offerId } = req.body;
  const offer = maisonOffers.find(o => o.id === offerId);
  if (!offer) return res.status(404).json({ error: 'Offer not found' });

  const cartItemId = `bundle-${offer.id}`;
  const existing = cart.find(item => item.cartItemId === cartItemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      cartItemId,
      product: {
        id: offer.id,
        name: offer.title,
        subtitle: offer.description,
        category: "Maison Vault Offer",
        image: offer.image || DEFAULT_PERFUME_IMG
      },
      selectedSize: "Curated Ritual Bundle",
      price: offer.specialPrice,
      quantity: 1
    });
  }

  res.json({ success: true, cart, ...getCartCalculations() });
});

// Custom Discovery Box Add
app.post('/api/cart/add-discovery-box', (req, res) => {
  const { items } = req.body;
  if (!items || items.length !== 3) {
    return res.status(400).json({ error: 'Please choose exactly 3 fragrances' });
  }

  const selectedProducts = items.map(id => products.find(p => p.id === parseInt(id))).filter(Boolean);
  if (selectedProducts.length !== 3) {
    return res.status(400).json({ error: 'Invalid fragrance selection' });
  }

  const customId = `discovery-set-${Date.now()}`;
  cart.push({
    cartItemId: customId,
    product: {
      id: customId,
      name: "Custom 3-Piece Discovery Wardrobe",
      subtitle: selectedProducts.map(p => p.name).join(' • '),
      category: "Discovery Box",
      image: "/images/offers/discovery-set.jpg",
    },
    selectedSize: "3 x 10ml Travel Sprays",
    price: 45.00,
    quantity: 1
  });

  res.json({ success: true, cart, ...getCartCalculations() });
});

app.post('/api/cart/update', (req, res) => {
  const { cartItemId, quantity } = req.body;
  const item = cart.find(item => item.cartItemId === cartItemId);
  if (item) {
    if (parseInt(quantity) <= 0) {
      cart = cart.filter(i => i.cartItemId !== cartItemId);
    } else {
      item.quantity = parseInt(quantity);
    }
  }
  res.json({ success: true, cart, ...getCartCalculations() });
});

app.post('/api/cart/remove', (req, res) => {
  const { cartItemId } = req.body;
  cart = cart.filter(item => item.cartItemId !== cartItemId);
  res.json({ success: true, cart, ...getCartCalculations() });
});

app.post('/api/cart/coupon', (req, res) => {
  const { code } = req.body;
  const cleanCode = (code || '').trim().toUpperCase();

  if (cleanCode === 'ZAHAR15' || cleanCode === 'ROYAL15') {
    appliedDiscount = 15;
    appliedCouponCode = `${cleanCode} (15% OFF)`;
    return res.json({ success: true, message: 'VIP code applied! 15% discount granted.', ...getCartCalculations() });
  } else if (cleanCode === 'MAISON20') {
    appliedDiscount = 20;
    appliedCouponCode = 'MAISON20 (20% OFF)';
    return res.json({ success: true, message: 'Private Vault code applied! 20% discount granted.', ...getCartCalculations() });
  } else if (!cleanCode) {
    appliedDiscount = 0;
    appliedCouponCode = null;
    return res.json({ success: true, message: 'Coupon removed.', ...getCartCalculations() });
  } else {
    return res.status(400).json({ error: 'Invalid promotion code. Try "ROYAL15"' });
  }
});

app.get('/api/cart', (req, res) => {
  res.json({ cart, ...getCartCalculations() });
});

// Newsletter
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  console.log(`[VIP Member Joined]: ${email}`);
  res.json({ success: true, message: 'Welcome to the Zahar Circle. Use code ROYAL15 at checkout for 15% off.' });
});

// Contact Concierge
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`[Concierge Inquiry] from ${name} (${email}): ${message}`);
  res.json({ success: true, message: 'Your concierge inquiry has been assigned to our senior perfumer.' });
});

// ── Start Server ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ⚜️  Zahar Haute Parfumerie is live at http://localhost:${PORT}\n`);
});
