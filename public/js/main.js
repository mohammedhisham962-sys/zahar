/* ═══════════════════════════════════════════════════════════════════
   ZAHAR HAUTE PARFUMERIE — Master Client Engine
   Warm Alabaster & Champagne Gold Edition
   ═══════════════════════════════════════════════════════════════════ */

// Current exchange rates relative to USD
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  AED: { symbol: 'AED ', rate: 3.67 }
};
let currentCurrency = 'USD';

// State for custom Discovery Wardrobe Box
let discoverySelected = []; // array of product objects (up to 3)

// State for selected card sizes { [productId]: { size: '100ml', price: 245 } }
const cardSelectedSizes = {};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCartDrawer();
  initSearchDrawer();
  initVaultFilters();
  initDiscoveryWardrobe();
  initPyramidVisualizer();
  initCurrencySelector();
  initVipNewsletter();
  initQuickView();

  // Initial cart fetch to sync drawer
  fetchCartState();
});

/* ── Header & Scroll Dynamics ──────────────────────────────────── */
function initHeader() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.querySelector('.nav-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }
}

/* ── Currency Converter ────────────────────────────────────────── */
function initCurrencySelector() {
  const select = document.getElementById('currencySelect');
  if (!select) return;

  select.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    updateAllPricesOnPage();
    showLuxToast(`Currency updated to ${currentCurrency}`);
  });
}

function formatPrice(usdAmount) {
  const config = CURRENCIES[currentCurrency] || CURRENCIES.USD;
  const converted = (parseFloat(usdAmount) * config.rate).toFixed(2);
  return `${config.symbol}${converted}`;
}

function updateAllPricesOnPage() {
  const catalog = window.ZAHAR_CATALOG || [];
  catalog.forEach(p => {
    const priceEl = document.getElementById(`cardPrice-${p.id}`);
    if (priceEl) {
      const selected = cardSelectedSizes[p.id] || { price: p.price };
      priceEl.textContent = formatPrice(selected.price);
    }
  });
  // Also refresh cart calculations
  fetchCartState();
}

/* ── Cart Slide-In Drawer & APIs ───────────────────────────────── */
function initCartDrawer() {
  const openBtn = document.getElementById('openCartBtn');
  const closeBtn = document.getElementById('closeCartBtn');
  const overlay = document.getElementById('cartOverlay');

  if (openBtn) openBtn.addEventListener('click', () => openCart());
  if (closeBtn) closeBtn.addEventListener('click', () => closeCart());
  if (overlay) overlay.addEventListener('click', () => closeCart());
}

window.openCart = function() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeCart = function() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
};

async function fetchCartState() {
  try {
    const res = await fetch('/api/cart');
    const data = await res.json();
    renderCartUI(data);
  } catch (err) {
    console.error('Failed to sync bag state', err);
  }
}

function renderCartUI(data) {
  // Update header pill and drawer header count
  const count = data.itemCount || 0;
  const pill = document.getElementById('cartPillCount');
  const drawerCount = document.getElementById('cartDrawerCount');
  if (pill) pill.textContent = count;
  if (drawerCount) drawerCount.textContent = count;

  // Milestone Free Delivery Tracker ($150 threshold)
  const subtotal = parseFloat(data.subtotal || 0);
  const threshold = 150.00;
  const fill = document.getElementById('tierBarFill');
  const remaining = document.getElementById('tierRemaining');
  const label = document.getElementById('tierLabel');

  if (fill && remaining) {
    if (subtotal >= threshold) {
      fill.style.width = '100%';
      remaining.textContent = 'FREE Courier Unlocked!';
      remaining.style.color = '#2E7D32';
      label.textContent = 'Worldwide DHL Express Courier: COMPLIMENTARY';
    } else {
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      fill.style.width = `${pct}%`;
      const diff = (threshold - subtotal).toFixed(2);
      remaining.textContent = `${formatPrice(diff)} away`;
      remaining.style.color = 'var(--gold-dark)';
      label.textContent = `Complimentary Courier Threshold: ${formatPrice(150)}`;
    }
  }

  // Render items list
  const container = document.getElementById('cartDrawerItems');
  if (!container) return;

  if (!data.cart || data.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 0; color: var(--text-dim);">
        <div style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.3;">⚜️</div>
        <p style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--text-muted); margin-bottom: 16px;">
          Your fragrance bag is empty
        </p>
        <button class="btn-secondary" style="padding: 10px 22px; font-size: 0.72rem;" onclick="closeCart(); location.href='#vault';">
          Discover The Vault
        </button>
      </div>
    `;
  } else {
    container.innerHTML = data.cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.product.image || '/images/products/sovereign-oudh.jpg'}" onerror="this.onerror=null; this.src='/images/products/sovereign-oudh.jpg';" alt="${item.product.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <h4>${item.product.name}</h4>
          <span class="cart-item-size-badge">${item.selectedSize}</span>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button type="button" onclick="changeCartItemQty('${item.cartItemId}', ${item.quantity - 1})">−</button>
              <span>${item.quantity}</span>
              <button type="button" onclick="changeCartItemQty('${item.cartItemId}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-price-col">
              ${formatPrice(item.price * item.quantity)}
            </div>
          </div>
          <span class="cart-remove-link" onclick="removeCartItem('${item.cartItemId}')">Remove from bag</span>
        </div>
      </div>
    `).join('');
  }

  // Subtotal & Total & Discount Breakdown
  const subtotalEl = document.getElementById('cartDrawerSubtotal');
  const totalEl = document.getElementById('cartDrawerTotal');
  const discountRow = document.getElementById('discountRow');
  const discountLabel = document.getElementById('discountLabel');
  const discountAmount = document.getElementById('discountAmount');

  if (subtotalEl) subtotalEl.textContent = formatPrice(data.subtotal || 0);
  if (totalEl) totalEl.textContent = formatPrice(data.total || 0);

  if (discountRow) {
    if (data.discountPercent > 0) {
      discountRow.style.display = 'flex';
      discountLabel.textContent = `VIP Promo Code (${data.discountPercent}%)`;
      discountAmount.textContent = `-${formatPrice(data.discountAmount || 0)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
}

// Add Single Product to Cart
window.addQuickToCart = async function(productId, size = null) {
  const catalog = window.ZAHAR_CATALOG || [];
  const prod = catalog.find(p => p.id === productId);
  if (!prod) return;

  const chosenSize = size || (cardSelectedSizes[productId]?.size) || prod.size;

  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, size: chosenSize, quantity: 1 })
    });
    const data = await res.json();
    if (data.success) {
      renderCartUI(data);
      openCart();
      showLuxToast(`Added ${prod.name} (${chosenSize}) to your bag ✨`);
    }
  } catch (err) {
    showLuxToast('Could not add to bag', 'error');
  }
};

window.addCardProductToCart = function(productId) {
  addQuickToCart(productId);
};

// Add Maison Offer to Cart
window.addMaisonOfferToCart = async function(offerId) {
  try {
    const res = await fetch('/api/cart/add-offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId })
    });
    const data = await res.json();
    if (data.success) {
      renderCartUI(data);
      openCart();
      showLuxToast('Curated Maison Ritual added to your bag ⚜️');
    }
  } catch (err) {
    showLuxToast('Could not add ritual offer', 'error');
  }
};

window.changeCartItemQty = async function(cartItemId, qty) {
  try {
    const res = await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItemId, quantity: qty })
    });
    const data = await res.json();
    if (data.success) renderCartUI(data);
  } catch (err) {
    showLuxToast('Failed to update quantity', 'error');
  }
};

window.removeCartItem = async function(cartItemId) {
  try {
    const res = await fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItemId })
    });
    const data = await res.json();
    if (data.success) {
      renderCartUI(data);
      showLuxToast('Item removed from bag');
    }
  } catch (err) {
    showLuxToast('Failed to remove item', 'error');
  }
};

// Copy coupon code helper
window.copyCouponCode = function(code) {
  navigator.clipboard.writeText(code);
  const input = document.getElementById('couponInput');
  if (input) input.value = code;
  showLuxToast(`Coupon ${code} copied! Press Apply in your bag.`);
};

// Promo code application
window.applyCouponCode = async function() {
  const input = document.getElementById('couponInput');
  const code = (input?.value || '').trim();

  try {
    const res = await fetch('/api/cart/coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      renderCartUI(data);
      showLuxToast(data.message);
    } else {
      showLuxToast(data.error || 'Invalid promotion code', 'error');
    }
  } catch (err) {
    showLuxToast('Failed to verify code', 'error');
  }
};

/* ── Product Card Size Pills ───────────────────────────────────── */
window.selectCardSize = function(btnEl, productId, size, price) {
  cardSelectedSizes[productId] = { size, price };

  const pillsContainer = btnEl.parentElement;
  pillsContainer.querySelectorAll('.size-pill').forEach(p => p.classList.remove('selected'));
  btnEl.classList.add('selected');

  const priceEl = document.getElementById(`cardPrice-${productId}`);
  if (priceEl) priceEl.textContent = formatPrice(price);
};

/* ── Live Search Overlay Drawer ────────────────────────────────── */
function initSearchDrawer() {
  const openBtn = document.getElementById('openSearchBtn');
  const closeBtn = document.getElementById('closeSearchBtn');
  const overlay = document.getElementById('searchDrawerOverlay');
  const input = document.getElementById('liveSearchInput');
  const tray = document.getElementById('searchResultsTray');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      overlay.classList.add('active');
      setTimeout(() => input?.focus(), 150);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  }

  let debounceTimeout = null;
  if (input && tray) {
    input.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      const query = input.value.trim();
      if (!query) {
        tray.style.display = 'none';
        tray.innerHTML = '';
        return;
      }

      debounceTimeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          renderSearchResults(data.results);
        } catch (err) {
          console.error(err);
        }
      }, 250);
    });
  }
}

function renderSearchResults(results) {
  const tray = document.getElementById('searchResultsTray');
  if (!tray) return;

  if (results.length === 0) {
    tray.style.display = 'block';
    tray.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-dim);">No fragrances found matching that note or title.</div>`;
    return;
  }

  tray.style.display = 'block';
  tray.innerHTML = results.map(r => `
    <div class="search-result-card" onclick="location.href='/product/${r.id}'" style="cursor: pointer;">
      <img src="${r.image}" alt="${r.name}">
      <div class="search-result-meta" style="flex: 1;">
        <h4>${r.name}</h4>
        <span>${r.category} • ${r.scentFamily}</span>
        <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 2px;">
          Notes: ${r.notes ? r.notes.top + ', ' + r.notes.middle : 'Rare Essence'}
        </div>
      </div>
      <div style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--gold-dark); font-weight: 700;">
        ${formatPrice(r.price)}
      </div>
    </div>
  `).join('');
}

/* ── Interactive Category Filtering in Vault ───────────────────── */
function initVaultFilters() {
  const tabs = document.querySelectorAll('.vault-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      filterVaultCards(filter);
    });
  });
}

window.filterVaultByCategory = function(category) {
  const tabs = document.querySelectorAll('.vault-tab-btn');
  tabs.forEach(tab => {
    if (tab.dataset.filter === category) tab.classList.add('active');
    else tab.classList.remove('active');
  });
  filterVaultCards(category);
  document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' });
};

function filterVaultCards(category) {
  const cards = document.querySelectorAll('#vaultProductsGrid .prod-card-ecommerce');
  cards.forEach(card => {
    const cardCat = card.dataset.category;
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 30);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 250);
    }
  });
}

/* ── Interactive Feature: Bespoke Discovery Wardrobe ($45) ─────── */
function initDiscoveryWardrobe() {
  discoverySelected = [];
  renderDiscoverySlots();
}

window.toggleDiscoveryScent = function(productId, productName) {
  const catalog = window.ZAHAR_CATALOG || [];
  const prod = catalog.find(p => p.id === productId);
  if (!prod) return;

  const existingIndex = discoverySelected.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    discoverySelected.splice(existingIndex, 1);
    document.getElementById(`selectCard-${productId}`)?.classList.remove('selected');
  } else {
    if (discoverySelected.length >= 3) {
      showLuxToast('Your 3 wardrobe slots are full. Remove one to switch.', 'error');
      return;
    }
    discoverySelected.push(prod);
    document.getElementById(`selectCard-${productId}`)?.classList.add('selected');
  }

  renderDiscoverySlots();
};

function renderDiscoverySlots() {
  for (let i = 1; i <= 3; i++) {
    const slotEl = document.getElementById(`slot${i}`);
    if (!slotEl) continue;

    const item = discoverySelected[i - 1];
    if (item) {
      slotEl.className = 'box-slot filled';
      slotEl.innerHTML = `
        <span class="slot-num">Slot 0${i}</span>
        <div class="slot-title">${item.name}</div>
        <span style="font-size: 0.68rem; color: var(--gold-dark); font-weight: 600;">${item.category}</span>
        <button type="button" class="slot-remove" onclick="removeDiscoverySlotItem(${item.id})">✕ Remove</button>
      `;
    } else {
      slotEl.className = 'box-slot empty-slot';
      slotEl.innerHTML = `
        <span class="slot-num">Slot 0${i}</span>
        <span>+ Select Scent</span>
      `;
    }
  }

  const addBtn = document.getElementById('addDiscoveryBoxBtn');
  if (addBtn) {
    if (discoverySelected.length === 3) {
      addBtn.textContent = 'Add Custom Box to Bag ($45.00) →';
      addBtn.style.opacity = '1';
    } else {
      addBtn.textContent = `Select ${3 - discoverySelected.length} More Fragrance${3 - discoverySelected.length === 1 ? '' : 's'}`;
      addBtn.style.opacity = '0.7';
    }
  }
}

window.removeDiscoverySlotItem = function(productId) {
  toggleDiscoveryScent(productId);
};

window.addCustomDiscoveryBoxToCart = async function() {
  if (discoverySelected.length !== 3) {
    showLuxToast('Please choose 3 fragrances to complete your set', 'error');
    return;
  }

  try {
    const res = await fetch('/api/cart/add-discovery-box', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: discoverySelected.map(p => p.id) })
    });
    const data = await res.json();
    if (data.success) {
      renderCartUI(data);
      openCart();
      showLuxToast('Custom Discovery Wardrobe added to your bag ⚜️');
    }
  } catch (err) {
    showLuxToast('Failed to add custom set', 'error');
  }
};

/* ── Olfactory Pyramid Visualizer ──────────────────────────────── */
const PYRAMID_DATA = {
  top: {
    title: "The Transient Halo",
    timeline: "First 0 to 20 Minutes • Volatile Molecules",
    description: "The initial spark upon skin contact. These lightweight, volatile aromatics awaken the senses and forge the first emotional imprint before making way for the heart.",
    ingredients: [
      { name: "Saffron Filaments", origin: "Kashmir, India", desc: "Warm, bittersweet, golden metallic sparkle", icon: "✨" },
      { name: "Calabrian Bergamot", origin: "Reggio Calabria, Italy", desc: "Sparkling zesty sunlight, cold-pressed peel", icon: "🍋" },
      { name: "Pink Peppercorn", origin: "Madagascar", desc: "Crisp, effervescent rose-tinted dry spice", icon: "🌸" }
    ]
  },
  heart: {
    title: "The Sovereign Identity",
    timeline: "20 Minutes to 5 Hours • Heart Sillage",
    description: "The core soul and character of the fragrance. As body heat warms the skin, these dense botanical absolutes and resins radiate outwards, leaving an undeniable signature in the air.",
    ingredients: [
      { name: "Taif Rose Absolute", origin: "Taif Highlands, Saudi Arabia", desc: "Honeyed, velvet, crystalline Arabian mountain rose", icon: "🌹" },
      { name: "Wild Assamese Agarwood", origin: "Assam Valley", desc: "Smoky, ancient, leather-tinged natural agarwood", icon: "🪔" },
      { name: "Tuscan Orris Butter", origin: "Florence, Italy", desc: "Powdery, aristocratic, precious violet root essence", icon: "⚜️" }
    ]
  },
  base: {
    title: "The Immortal Memory",
    timeline: "5 to 24+ Hours • Fixative Dry-Down",
    description: "The heavy molecular anchor. These rare woods, balsams, and animalic ambres melt into your skin's natural chemistry, creating an intimate second-skin aura that lingers for days on cashmere.",
    ingredients: [
      { name: "Mysore Sandalwood", origin: "Karnataka, India", desc: "Creamy, serene, sacred warm milky wood", icon: "🪵" },
      { name: "Golden Baltic Amber", origin: "Northern Europe", desc: "Resinous, sweet, rich balsamic warmth", icon: "🍯" },
      { name: "White Ambergris", origin: "Natural Ocean Tides", desc: "Warm oceanic salty skin radiance with infinite projection", icon: "🌊" }
    ]
  }
};

function initPyramidVisualizer() {
  switchPyramidPhase('heart');
}

window.switchPyramidPhase = function(phase) {
  const buttons = document.querySelectorAll('.pyramid-tab-btn');
  buttons.forEach(b => {
    b.classList.remove('active');
    if (b.getAttribute('onclick')?.includes(phase)) b.classList.add('active');
  });

  const card = document.getElementById('pyramidCard');
  if (!card) return;

  const data = PYRAMID_DATA[phase] || PYRAMID_DATA.heart;

  card.innerHTML = `
    <div class="pyramid-card-left">
      <span class="pyramid-timeline">${data.timeline}</span>
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <div style="margin-top: 24px;">
        <a href="#vault" class="btn-text-gold">Browse Scents Formulated in this Phase →</a>
      </div>
    </div>

    <div class="pyramid-notes-list">
      ${data.ingredients.map(ing => `
        <div class="note-ingredient-item">
          <div class="note-icon-pill">${ing.icon}</div>
          <div class="note-info">
            <strong>${ing.name}</strong>
            <span>${ing.origin} • ${ing.desc}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

/* ── Quick View Modal ──────────────────────────────────────────── */
function initQuickView() {
  const modal = document.getElementById('qvModal');
  const closeBtn = document.getElementById('closeQvBtn');

  if (closeBtn) closeBtn.addEventListener('click', () => modal?.classList.remove('active'));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

window.openQuickViewModal = function(productId) {
  const catalog = window.ZAHAR_CATALOG || [];
  const prod = catalog.find(p => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('qvModal');
  if (!modal) return;

  document.getElementById('qvModalImg').src = prod.image;
  document.getElementById('qvModalCategory').textContent = `${prod.category} • ${prod.concentration}`;
  document.getElementById('qvModalName').textContent = prod.name;
  document.getElementById('qvModalSubtitle').textContent = prod.subtitle;
  document.getElementById('qvModalPrice').textContent = formatPrice(prod.price);
  document.getElementById('qvModalDesc').textContent = prod.description;

  const notesBox = document.getElementById('qvNotesBox');
  if (notesBox && prod.notes) {
    notesBox.innerHTML = `
      <div style="margin-bottom: 4px;"><strong>Top Notes:</strong> ${prod.notes.top}</div>
      <div style="margin-bottom: 4px;"><strong>Heart Notes:</strong> ${prod.notes.middle}</div>
      <div><strong>Base Notes:</strong> ${prod.notes.base}</div>
    `;
  }

  const addBtn = document.getElementById('qvAddToCartBtn');
  if (addBtn) {
    addBtn.onclick = () => {
      addQuickToCart(prod.id);
      modal.classList.remove('active');
    };
  }

  const fullStoryLink = document.getElementById('qvFullStoryLink');
  if (fullStoryLink) fullStoryLink.href = `/product/${prod.id}`;

  modal.classList.add('active');
};

/* ── VIP Newsletter ────────────────────────────────────────────── */
function initVipNewsletter() {
  const form = document.getElementById('vipNewsletterForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('vipEmailInput');
    const email = (input?.value || '').trim();
    if (!email) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        showLuxToast('Welcome to the Circle ⚜️ Coupon ROYAL15 applied to your bag!');
        form.reset();
        fetch('/api/cart/coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: 'ROYAL15' })
        })
        .then(r => r.json())
        .then(d => { if (d.success) renderCartUI(d); });
      }
    } catch {
      showLuxToast('Failed to join newsletter', 'error');
    }
  });
}

/* ── Luxury Toast System ───────────────────────────────────────── */
window.showLuxToast = function(message, type = 'normal') {
  const wrap = document.getElementById('luxToastWrap');
  if (!wrap) return;

  const toast = document.createElement('div');
  toast.className = 'lux-toast';
  if (type === 'error') {
    toast.style.borderLeftColor = '#C0392B';
  }

  toast.innerHTML = `
    <span style="font-size: 1.1rem;">${type === 'error' ? '⚠️' : '⚜️'}</span>
    <span style="flex: 1;">${message}</span>
  `;

  wrap.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3400);
};
