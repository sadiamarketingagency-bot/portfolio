// ===== AHMAD MOBILE ACCESSORIES - OFFICIAL E-COMMERCE SCRIPT =====

// 10 OFFICIAL PRODUCTS AS SPECIFIED
const PRODUCTS = [
  { id: 1, name: '20W Fast Charger', price: 399, oldPrice: 599, category: 'charging', emoji: '⚡', badge: 'bestseller', rating: 4.9, reviews: 142, description: 'Super-fast 20W Type-C Power Delivery (PD) fast charging adapter. Charges compatible smartphones from 0 to 50% in just 30 minutes with multi-layer surge protection.' },
  { id: 2, name: 'Durable Data Cable', price: 149, oldPrice: 249, category: 'charging', emoji: '🔌', badge: 'hot', rating: 4.8, reviews: 98, description: 'Heavy-duty braided data cable with reinforced aluminum alloy joints. Delivers 3A fast charging and 480Mbps ultra-stable high-speed data synchronization.' },
  { id: 3, name: 'Wired Earphones', price: 149, oldPrice: 299, category: 'audio', emoji: '🎧', badge: 'new', rating: 4.7, reviews: 85, description: 'High-definition stereo wired earphones with deep acoustic bass, in-line noise-canceling microphone, and comfortable ergonomic silicone in-ear design.' },
  { id: 4, name: 'Adjustable Phone Stand', price: 199, oldPrice: 349, category: 'accessories', emoji: '📱', badge: '', rating: 4.6, reviews: 62, description: 'Multi-angle foldable metal desk phone stand with anti-slip rubber pads. Ideal for hands-free video calls, Netflix streaming, office work, and mobile gaming.' },
  { id: 5, name: '10000mAh Power Bank', price: 499, oldPrice: 799, category: 'charging', emoji: '🔋', badge: 'bestseller', rating: 4.9, reviews: 230, description: 'High-capacity 10000mAh portable power bank with dual USB fast-charge outputs, LED battery status indicator, and ultra-compact travel pocket design.' },
  { id: 6, name: 'Car Mobile Holder', price: 249, oldPrice: 399, category: 'accessories', emoji: '🚗', badge: '', rating: 4.7, reviews: 74, description: '360° rotating dashboard and AC vent magnetic car phone holder. Powerful grip keeps your phone steady even on bumpy roads during GPS navigation.' },
  { id: 7, name: 'Tempered Glass', price: 149, oldPrice: 199, category: 'protection', emoji: '🛡️', badge: 'hot', rating: 4.8, reviews: 180, description: '9H diamond hardness edge-to-edge screen protector. Features oleophobic anti-fingerprint coating and 99.9% crystal-clear HD optical transparency.' },
  { id: 8, name: 'Stylish Back Cover', price: 199, oldPrice: 299, category: 'protection', emoji: '💎', badge: 'new', rating: 4.6, reviews: 110, description: 'Sleek shockproof protective back case with anti-scratch matte finish and raised camera bezel protection for ultimate everyday durability.' },
  { id: 9, name: 'Pop Socket', price: 99, oldPrice: 149, category: 'accessories', emoji: '🎯', badge: '', rating: 4.5, reviews: 52, description: 'Expandable pop grip and collapsible stand for smartphones. Provides secure single-handed texting, steady selfies, and convenient media viewing.' },
  { id: 10, name: 'OTG Adapter', price: 149, oldPrice: 199, category: 'accessories', emoji: '🔗', badge: '', rating: 4.7, reviews: 44, description: 'High-speed USB Type-C & Micro USB OTG converter. Connect USB flash drives, mice, keyboards, and card readers directly to your smartphone instantly.' }
];

// STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('ama_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('ama_wishlist') || '[]');
let currentFilter = 'all';
let currentSort = 'default';
let testimonialIndex = 0;
let autoSlideInterval = null;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initHeader();
  initAnnBar();
  initHamburger();
  renderProducts();
  initFilters();
  initSort();
  initCart();
  initWishlist();
  initSearch();
  initAuthModal();
  initCheckout();
  initNewsletter();
  initContactForm();
  initTestimonials();
  initScrollReveal();
  initCounter();
  initBackToTop();
  initCategories();
  initHeroParticles();
  updateBadges();
});

// PRELOADER
function initLoader() {
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  const text = document.getElementById('loaderText');
  let pct = 0;
  const msgs = ['Loading Store...', 'Preparing Top Accessories Under ₹500...', 'Almost Ready!', 'Welcome to Ahmad Mobile Accessories!'];
  const iv = setInterval(() => {
    pct += Math.random() * 25 + 10;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    if (progress) progress.style.width = pct + '%';
    if (text) text.textContent = msgs[Math.min(Math.floor(pct / 30), msgs.length - 1)];
    if (pct >= 100) {
      setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 350);
    }
  }, 180);
}

// CUSTOM CURSOR
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  document.addEventListener('mousemove', e => {
    requestAnimationFrame(() => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
    });
  });
}

// STICKY HEADER
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ANNOUNCEMENT BAR CLOSE
function initAnnBar() {
  const btn = document.getElementById('annClose');
  const bar = document.getElementById('announcementBar');
  if (btn && bar) {
    btn.addEventListener('click', () => {
      bar.style.display = 'none';
    });
  }
}

// MOBILE MENU
function initHamburger() {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  if (!ham || !menu) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('active');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('active');
      menu.classList.remove('open');
    });
  });
}
// RENDER PRODUCTS
function renderProducts(filter, sort) {
  filter = filter || currentFilter;
  sort = sort || currentSort;
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productCount');
  if (!grid) return;

  let list = filter === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === filter);
  if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
  else if (sort === 'name-az') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'name-za') list.sort((a, b) => b.name.localeCompare(a.name));

  if (countEl) countEl.textContent = list.length;
  grid.innerHTML = list.map(p => productCard(p)).join('');

  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
  grid.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleWishlist(parseInt(btn.dataset.id)));
  });
  grid.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => openQuickView(parseInt(btn.dataset.id)));
  });
  updateWishlistUI();
}

function productCard(p) {
  const inWL = wishlist.some(w => w.id === p.id);
  const inCart = cart.some(c => c.id === p.id);
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '☆' : '');
  const badgeHTML = p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'bestseller' ? 'Best Seller' : p.badge === 'hot' ? '🔥 Hot Deal' : '✨ New'}</span>` : '';

  return `
  <div class="product-card" data-category="${p.category}" data-id="${p.id}">
    <div class="product-img">
      ${badgeHTML}
      <div class="product-actions">
        <button class="product-action-btn wishlist-btn ${inWL ? 'wishlisted' : ''}" data-id="${p.id}" title="${inWL ? 'Remove from Wishlist' : 'Add to Wishlist'}" aria-label="Toggle Wishlist">
          ${inWL ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-visual-emoji">${p.emoji}</div>
      <div class="product-overlay">
        <button class="quick-view-btn" data-id="${p.id}">⚡ Quick View</button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${p.category.toUpperCase()}</div>
      <h3 class="product-name">${p.name}</h3>
      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span class="rating-count">(${p.reviews} reviews)</span>
      </div>
      <div class="product-price-row">
        <div>
          <span class="product-price">₹${p.price}</span>
          ${p.oldPrice ? `<span class="product-old-price">₹${p.oldPrice}</span>` : ''}
        </div>
        <button class="add-to-cart-btn ${inCart ? 'added' : ''}" data-id="${p.id}" title="Add to Cart" aria-label="Add ${p.name} to Cart">
          ${inCart ? '✓' : '+'}
        </button>
      </div>
    </div>
  </div>`;
}

// FILTER CONTROLS
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderProducts();
    });
  });
}

// SORT CONTROLS
function initSort() {
  const sel = document.getElementById('sortSelect');
  if (sel) {
    sel.addEventListener('change', () => {
      currentSort = sel.value;
      renderProducts();
    });
  }
}

// CART SYSTEM
function initCart() {
  const toggle = document.getElementById('cartToggle');
  const close = document.getElementById('cartClose');
  const overlay = document.getElementById('cartOverlay');
  const contBtn = document.getElementById('continueShoppingBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const shopCartBtn = document.getElementById('shopNowCartBtn');

  if (toggle) toggle.addEventListener('click', openCart);
  if (close) close.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);
  if (contBtn) contBtn.addEventListener('click', closeCart);
  if (shopCartBtn) shopCartBtn.addEventListener('click', closeCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => { closeCart(); openCheckout(); });
  renderCart();
}

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
  updateBadges();
  showToast(`Added ${product.name} to Cart! ${product.emoji}`, 'success');

  const btn = document.querySelector(`.add-to-cart-btn[data-id="${id}"]`);
  if (btn) {
    btn.classList.add('added');
    btn.textContent = '✓';
    setTimeout(() => {
      btn.textContent = '+';
      btn.classList.remove('added');
    }, 1200);
  }
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  updateBadges();
  showToast('Item removed from cart', '');
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCart(); updateBadges(); }
}

function saveCart() {
  localStorage.setItem('ama_cart', JSON.stringify(cart));
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  const grandEl = document.getElementById('cartGrandTotal');
  const countHdr = document.getElementById('cartCountHeader');

  if (!itemsEl) return;
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  if (countHdr) countHdr.textContent = totalItems;

  itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = '';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = '';

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  if (totalEl) totalEl.textContent = '₹' + total;
  if (grandEl) grandEl.textContent = '₹' + total;

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price * item.qty} <small style="color:var(--text-muted);font-size:11px;">(₹${item.price} each)</small></div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">-</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
          <button class="remove-item-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>`;
    itemsEl.appendChild(el);
  });

  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), parseInt(btn.dataset.delta)));
  });
  itemsEl.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });
}

// WISHLIST SYSTEM
function initWishlist() {
  const toggle = document.getElementById('wishlistToggle');
  const close = document.getElementById('wishlistClose');
  const overlay = document.getElementById('wishlistOverlay');
  if (toggle) toggle.addEventListener('click', openWishlist);
  if (close) close.addEventListener('click', closeWishlist);
  if (overlay) overlay.addEventListener('click', closeWishlist);
  renderWishlist();
}

function openWishlist() {
  document.getElementById('wishlistDrawer')?.classList.add('open');
  document.getElementById('wishlistOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWishlist() {
  document.getElementById('wishlistDrawer')?.classList.remove('open');
  document.getElementById('wishlistOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleWishlist(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`Removed ${product.name} from Wishlist`, '');
  } else {
    wishlist.push(product);
    showToast(`Saved ${product.name} to Wishlist! ❤️`, 'success');
  }
  localStorage.setItem('ama_wishlist', JSON.stringify(wishlist));
  renderWishlist();
  updateBadges();
  updateWishlistUI();
}

function updateWishlistUI() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    const inWL = wishlist.some(w => w.id === id);
    btn.classList.toggle('wishlisted', inWL);
    btn.textContent = inWL ? '❤️' : '🤍';
  });
}

function renderWishlist() {
  const el = document.getElementById('wishlistItems');
  const empty = document.getElementById('wishlistEmpty');
  if (!el) return;
  el.querySelectorAll('.cart-item').forEach(e => e.remove());
  if (wishlist.length === 0) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  wishlist.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="cart-item-controls">
          <button class="qty-btn atc-from-wl" data-id="${item.id}" style="width:auto;padding:0 12px;">+ Add to Cart</button>
          <button class="remove-item-btn rwl" data-id="${item.id}">Remove</button>
        </div>
      </div>`;
    el.appendChild(div);
  });

  el.querySelectorAll('.atc-from-wl').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(parseInt(btn.dataset.id));
      closeWishlist();
      openCart();
    });
  });
  el.querySelectorAll('.rwl').forEach(btn => {
    btn.addEventListener('click', () => toggleWishlist(parseInt(btn.dataset.id)));
  });
}

function updateBadges() {
  const cartBadge = document.getElementById('cartBadge');
  const wlBadge = document.getElementById('wishlistBadge');
  if (cartBadge) cartBadge.textContent = cart.reduce((s, c) => s + c.qty, 0);
  if (wlBadge) wlBadge.textContent = wishlist.length;
}
// LIVE SEARCH
function initSearch() {
  const input = document.getElementById('searchInput');
  const dropdown = document.getElementById('searchDropdown');
  const btn = document.getElementById('searchBtn');
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      dropdown.classList.remove('active');
      dropdown.innerHTML = '';
      return;
    }
    const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    if (results.length === 0) {
      dropdown.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px;">No accessories found matching your search</div>';
    } else {
      dropdown.innerHTML = results.slice(0, 6).map(p => `
        <div class="search-result-item" data-id="${p.id}">
          <span class="sri-icon">${p.emoji}</span>
          <div class="sri-info">
            <div class="sri-name">${p.name}</div>
            <div class="sri-price">₹${p.price}</div>
          </div>
        </div>`).join('');

      dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          openQuickView(parseInt(item.dataset.id));
          dropdown.classList.remove('active');
          input.value = '';
        });
      });
    }
    dropdown.classList.add('active');
  });

  if (btn) {
    btn.addEventListener('click', () => {
      if (input.value.trim()) input.dispatchEvent(new Event('input'));
    });
  }

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

// QUICK VIEW MODAL
function openQuickView(id) {
  const p = PRODUCTS.find(prod => prod.id === id);
  if (!p) return;
  const content = document.getElementById('quickViewContent');
  if (!content) return;
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '☆' : '');

  content.innerHTML = `
    <div class="quick-view-product">
      <div class="quick-view-icon"><span>${p.emoji}</span></div>
      <div class="quick-view-info">
        <div class="quick-view-cat">${p.category.toUpperCase()} ACCESSORY</div>
        <h3 class="quick-view-name">${p.name}</h3>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <span style="color:var(--accent);font-size:16px;">${stars}</span>
          <span style="color:var(--text-muted);font-size:13px;">${p.rating} (${p.reviews} verified reviews)</span>
        </div>
        <div class="quick-view-price">₹${p.price} <span style="font-size:16px;color:var(--text-dark);text-decoration:line-through;font-weight:400;">₹${p.oldPrice}</span></div>
        <div class="quick-view-desc">${p.description}</div>
        <div class="quick-view-btns">
          <button class="btn-primary btn-glow btn-full qv-add-cart" data-id="${p.id}">
            <span>🛒 Add to Cart (₹${p.price})</span>
          </button>
          <button class="btn-outline btn-full qv-add-wl" data-id="${p.id}">
            <span>${wishlist.some(w => w.id === p.id) ? '❤️ Remove from Wishlist' : '🤍 Save to Wishlist'}</span>
          </button>
        </div>
      </div>
    </div>`;

  content.querySelector('.qv-add-cart').addEventListener('click', () => {
    addToCart(p.id);
    closeQuickView();
    openCart();
  });

  content.querySelector('.qv-add-wl').addEventListener('click', () => {
    toggleWishlist(p.id);
    closeQuickView();
  });

  document.getElementById('quickViewModal')?.classList.add('open');
  document.getElementById('quickViewOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('quickViewModal')?.classList.remove('open');
  document.getElementById('quickViewOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('quickViewClose')?.addEventListener('click', closeQuickView);
  document.getElementById('quickViewOverlay')?.addEventListener('click', closeQuickView);
});

// AUTH MODAL (LOGIN / SIGN UP)
function initAuthModal() {
  const toggle = document.getElementById('authToggle');
  const modal = document.getElementById('authModal');
  const overlay = document.getElementById('authOverlay');
  const close = document.getElementById('authClose');
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (toggle) {
    toggle.addEventListener('click', () => {
      modal?.classList.add('open');
      overlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeAuth() {
    modal?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (close) close.addEventListener('click', closeAuth);
  if (overlay) overlay.addEventListener('click', closeAuth);

  if (tabLogin && tabSignup && loginForm && signupForm) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      loginForm.style.display = 'flex';
      signupForm.style.display = 'none';
    });

    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      signupForm.style.display = 'flex';
      loginForm.style.display = 'none';
    });

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Logged in successfully! Welcome back!', 'success');
      closeAuth();
      loginForm.reset();
    });

    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Account created successfully! Welcome to AMA!', 'success');
      closeAuth();
      signupForm.reset();
    });
  }
}

// CHECKOUT SYSTEM
function initCheckout() {
  document.getElementById('checkoutClose')?.addEventListener('click', closeCheckout);
  document.getElementById('checkoutOverlay')?.addEventListener('click', closeCheckout);
  document.getElementById('checkoutForm')?.addEventListener('submit', placeOrder);
  document.getElementById('successClose')?.addEventListener('click', closeSuccess);
  document.getElementById('successOverlay')?.addEventListener('click', closeSuccess);
}

function openCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty! Add items first.', 'error');
    return;
  }
  const summary = document.getElementById('orderSummaryMini');
  if (summary) {
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
    summary.innerHTML = `<h4>Order Summary</h4>` +
      cart.map(c => `<div class="osm-item"><span>${c.name} (x${c.qty})</span><span>₹${c.price * c.qty}</span></div>`).join('') +
      `<div class="osm-total"><span>Total Amount</span><span>₹${total}</span></div>`;
  }
  document.getElementById('checkoutModal')?.classList.add('open');
  document.getElementById('checkoutOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutModal')?.classList.remove('open');
  document.getElementById('checkoutOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

function placeOrder(e) {
  e.preventDefault();
  const btn = document.getElementById('placeOrderBtn');
  if (btn) { btn.innerHTML = '<span>Processing Order... ⏳</span>'; btn.disabled = true; }

  setTimeout(() => {
    closeCheckout();
    cart = [];
    saveCart();
    renderCart();
    updateBadges();
    renderProducts();

    document.getElementById('successModal')?.classList.add('open');
    document.getElementById('successOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (btn) { btn.innerHTML = '<span>✅ Confirm & Place Order (Cash on Delivery)</span>'; btn.disabled = false; }
    document.getElementById('checkoutForm')?.reset();
  }, 1200);
}

function closeSuccess() {
  document.getElementById('successModal')?.classList.remove('open');
  document.getElementById('successOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// NEWSLETTER SUBSCRIPTION
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('newsletterSubmitBtn');
    if (btn) { btn.textContent = 'Subscribing...'; btn.disabled = true; }
    setTimeout(() => {
      showToast('Subscribed! Check your inbox for exclusive deals!', 'success');
      form.reset();
      if (btn) { btn.textContent = 'Subscribe'; btn.disabled = false; }
    }, 900);
  });
}

// CONTACT FORM
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('contactSubmitBtn');
    if (btn) { btn.innerHTML = '<span>Sending Message... ⏳</span>'; btn.disabled = true; }
    setTimeout(() => {
      showToast('Thank you! Your message has been sent to our team.', 'success');
      form.reset();
      if (btn) { btn.innerHTML = '<span>Send Message 📩</span>'; btn.disabled = false; }
    }, 1000);
  });
}

// TESTIMONIAL SLIDER
function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsEl = document.getElementById('sliderDots');
  const track = document.getElementById('testimonialTrack');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (!track || !cards.length) return;

  const perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const max = Math.max(0, cards.length - perView);

  if (dotsEl) {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= max; i++) {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Review slide ' + (i + 1));
      d.addEventListener('click', () => goToSlide(i));
      dotsEl.appendChild(d);
    }
  }

  if (prev) prev.addEventListener('click', () => goToSlide(testimonialIndex - 1));
  if (next) next.addEventListener('click', () => goToSlide(testimonialIndex + 1));

  autoSlideInterval = setInterval(() => goToSlide(testimonialIndex + 1), 4500);
  track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  track.addEventListener('mouseleave', () => { autoSlideInterval = setInterval(() => goToSlide(testimonialIndex + 1), 4500); });
}

function goToSlide(idx) {
  const cards = document.querySelectorAll('.testimonial-card');
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.dot');
  if (!cards.length || !track) return;

  const perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const maxIdx = Math.max(0, cards.length - perView);

  if (idx > maxIdx) idx = 0;
  if (idx < 0) idx = maxIdx;
  testimonialIndex = idx;

  const cardW = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${idx * cardW}px)`;

  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

// TOAST NOTIFICATION
function showToast(msg, type) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || '');
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// SCROLL REVEAL ANIMATIONS
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// NUMBER COUNTER ANIMATION
function initCounter() {
  const counters = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / 40;
        const iv = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(iv);
        }, 30);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// BACK TO TOP
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// CATEGORY CLICK FILTER
function initCategories() {
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      currentFilter = cat;
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === cat));
      renderProducts();
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// HERO PARTICLES
function initHeroParticles() {
  const particles = document.createElement('div');
  particles.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
  for (let i = 0; i < 24; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 4 + 2;
    dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(245,197,24,${Math.random() * 0.35 + 0.15});left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:float ${Math.random() * 4 + 3}s ease-in-out ${Math.random() * 2}s infinite;`;
    particles.appendChild(dot);
  }
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.appendChild(particles);
}

// ACTIVE NAVIGATION LINK HIGHLIGHT ON SCROLL
window.addEventListener('scroll', () => {
  const sections = ['home', 'products', 'categories', 'offers', 'support', 'contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 150) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    const href = l.getAttribute('href');
    l.classList.toggle('active', href === '#' + current);
  });
});
