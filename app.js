import { products, categories } from './data.js';

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const state = {
  cart: JSON.parse(localStorage.getItem('smartstore:cart') || '{}'),
  wishlist: JSON.parse(localStorage.getItem('smartstore:wishlist') || '[]'),
  filter: 'all', search: ''
};

function persist() {
  localStorage.setItem('smartstore:cart', JSON.stringify(state.cart));
  localStorage.setItem('smartstore:wishlist', JSON.stringify(state.wishlist));
}

function toast(title, message = '') {
  const el = document.createElement('div'); el.className = 'toast';
  const safeTitle = escapeHtml(title); const safeMessage = escapeHtml(message);
  el.innerHTML = `<b>✓</b><span><strong>${safeTitle}</strong>${safeMessage ? `<br>${safeMessage}` : ''}</span>`;
  $('#toastStack').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 220); }, 2800);
}

function escapeHtml(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function renderCategories() {
  $('#categoryGrid').innerHTML = categories.map(c => `<button class="category-card" data-category="${c.id}"><span class="category-icon">${c.icon}</span><strong>${c.name}</strong><small>${c.description}</small></button>`).join('');
  $('#categoryMenu').innerHTML = categories.map(c => `<div class="category-menu-card" data-category="${c.id}"><span class="category-icon" style="margin:0">${c.icon}</span><div><strong>${c.name}</strong><small style="display:block;color:#6c727f">${c.description}</small></div></div>`).join('');
  $$('[data-category]').forEach(el => el.addEventListener('click', () => selectCategory(el.dataset.category)));
}

function filteredProducts() {
  const q = state.search.trim().toLocaleLowerCase('es');
  return products.filter(p => (state.filter === 'all' || p.category === state.filter) && (!q || `${p.name} ${p.brand} ${p.sku} ${p.features.join(' ')}`.toLocaleLowerCase('es').includes(q)));
}

function renderProducts() {
  const list = filteredProducts();
  $('#productGrid').innerHTML = list.map(p => {
    const loved = state.wishlist.includes(p.id);
    return `<article class="product-card">
      <div class="product-image" data-open-product="${p.id}"><img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
      <button class="wish ${loved ? 'active' : ''}" data-wish="${p.id}" aria-label="Favorito">${loved ? '♥' : '♡'}</button>
      <div class="product-info"><span class="brand-name">${p.brand} · ${p.sku}</span><h3 data-open-product="${p.id}">${p.name}</h3>
      <div class="rating"><b>★ ${p.rating}</b> · ${p.reviews} opiniones</div>
      <div class="price-row"><span class="price">${clp.format(p.price)}</span>${p.compareAt ? `<span class="compare">${clp.format(p.compareAt)}</span>` : ''}</div>
      <div class="product-actions"><button class="add-btn" data-add="${p.id}">Agregar al carrito</button><button class="quick-btn" data-open-product="${p.id}" title="Vista rápida">＋</button></div>
      <div class="stock">● ${p.stock > 5 ? 'En stock' : `Últimas ${p.stock} unidades`}</div></div></article>`;
  }).join('');
  if (!list.length) $('#productGrid').innerHTML = `<div class="empty" style="grid-column:1/-1"><b>⌕</b>No encontramos productos con ese criterio.</div>`;
  bindProducts();
  const status = $('#searchStatus');
  if (state.search) { status.hidden = false; status.textContent = `${list.length} resultado${list.length === 1 ? '' : 's'} para “${state.search}”`; } else status.hidden = true;
}

function bindProducts() {
  $$('[data-add]').forEach(b => b.addEventListener('click', () => addToCart(b.dataset.add)));
  $$('[data-wish]').forEach(b => b.addEventListener('click', () => toggleWish(b.dataset.wish)));
  $$('[data-open-product]').forEach(b => b.addEventListener('click', () => openProduct(b.dataset.openProduct)));
}

function addToCart(id, qty = 1) {
  state.cart[id] = Math.min((state.cart[id] || 0) + qty, products.find(p => p.id === id)?.stock || 99);
  persist(); updateCart();
  const p = products.find(p => p.id === id); toast('Agregado al carrito', p?.name || 'Producto');
}

function changeQty(id, delta) {
  state.cart[id] = (state.cart[id] || 0) + delta;
  if (state.cart[id] <= 0) delete state.cart[id];
  persist(); updateCart();
}

function removeCart(id) { delete state.cart[id]; persist(); updateCart(); }

function cartSummary() {
  return Object.entries(state.cart).reduce((acc, [id, qty]) => {
    const p = products.find(x => x.id === id); if (!p) return acc;
    acc.total += p.price * qty; acc.count += qty; return acc;
  }, { total: 0, count: 0 });
}

function updateCart() {
  const { total, count } = cartSummary(); $('#cartCount').textContent = count;
  const body = $('#cartItems'); const footer = $('#cartFooter');
  const items = Object.entries(state.cart).map(([id, qty]) => ({ p: products.find(x => x.id === id), qty })).filter(x => x.p);
  if (!items.length) { body.innerHTML = `<div class="empty"><b>⌑</b>Tu carrito está vacío.<br><small>Agrega productos para comenzar.</small></div>`; footer.innerHTML = ''; return; }
  body.innerHTML = items.map(({p,qty}) => `<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><strong>${clp.format(p.price * qty)}</strong><div class="qty"><button data-qty="${p.id}" data-delta="-1">−</button><span>${qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><button class="remove" data-remove="${p.id}">×</button></div>`).join('');
  const free = 99990; const progress = Math.min(100, total / free * 100);
  footer.innerHTML = `<div class="free-shipping">${total >= free ? '✓ Tienes despacho gratis' : `Te faltan ${clp.format(free-total)} para despacho gratis`}<div class="progress"><span style="width:${progress}%"></span></div></div><div class="subtotal-row"><span>Subtotal</span><span>${clp.format(total)}</span></div><button class="checkout" id="checkoutBtn">Ir a pagar →</button>`;
  $$('[data-qty]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.qty, Number(b.dataset.delta))));
  $$('[data-remove]').forEach(b => b.addEventListener('click', () => removeCart(b.dataset.remove)));
  $('#checkoutBtn')?.addEventListener('click', () => toast('Checkout preparado', 'En la siguiente etapa conectaremos pago, despacho y datos del cliente.'));
}

function toggleWish(id) {
  state.wishlist = state.wishlist.includes(id) ? state.wishlist.filter(x => x !== id) : [...state.wishlist, id];
  persist(); $('#wishlistCount').textContent = state.wishlist.length; renderProducts();
  toast(state.wishlist.includes(id) ? 'Guardado en favoritos' : 'Quitado de favoritos');
}

function selectCategory(id) {
  state.filter = id; state.search = ''; $('#searchInput').value = '';
  $$('.filter').forEach(b => b.classList.toggle('active', b.dataset.filter === id));
  renderProducts(); closeAll(); document.querySelector('#productos').scrollIntoView({behavior:'smooth'});
}

function openProduct(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  $('#modalContent').innerHTML = `<div class="quick-view"><img src="${p.image}" alt="${escapeHtml(p.name)}"><div class="quick-content"><span class="brand-name">${p.brand} · ${p.sku}</span><h2>${p.name}</h2><div class="rating"><b>★ ${p.rating}</b> · ${p.reviews} opiniones</div><div class="price-row"><span class="price">${clp.format(p.price)}</span>${p.compareAt ? `<span class="compare">${clp.format(p.compareAt)}</span>` : ''}</div><ul class="feature-list">${p.features.map(f => `<li>${f}</li>`).join('')}</ul><div class="stock">● ${p.stock} unidades disponibles</div><button class="btn primary" style="width:100%;margin-top:18px" id="modalAdd">Agregar al carrito</button></div></div>`;
  $('#modalAdd').addEventListener('click', () => { addToCart(id); closeAll(); openDrawer('cartDrawer'); });
  openDrawer('productModal');
}

function openDrawer(id) { closeAll(false); $`#${id}`.classList.add('open'); $`#${id}`.setAttribute('aria-hidden','false'); $('#backdrop').classList.add('show'); document.body.style.overflow='hidden'; }
function closeAll(hideBackdrop = true) { $$('.drawer,.modal').forEach(el => {el.classList.remove('open'); el.setAttribute('aria-hidden','true')}); if(hideBackdrop) $('#backdrop').classList.remove('show'); document.body.style.overflow=''; }

$('#cartBtn').addEventListener('click', () => openDrawer('cartDrawer'));
$('#categoriesBtn').addEventListener('click', () => openDrawer('categoryDrawer'));
$('#backdrop').addEventListener('click', () => closeAll());
$$('[data-close]').forEach(b => b.addEventListener('click', () => closeAll()));

$$('.filter').forEach(btn => btn.addEventListener('click', () => { state.filter = btn.dataset.filter; $$('.filter').forEach(b => b.classList.toggle('active', b === btn)); renderProducts(); }));
$('#searchForm').addEventListener('submit', e => { e.preventDefault(); state.search = $('#searchInput').value; state.filter = 'all'; $$('.filter').forEach(b => b.classList.toggle('active', b.dataset.filter==='all')); renderProducts(); document.querySelector('#productos').scrollIntoView({behavior:'smooth'}); });
$('#wishlistBtn').addEventListener('click', () => { if (!state.wishlist.length) return toast('Aún no tienes favoritos', 'Usa el corazón para guardar productos.'); state.search=''; state.filter='all'; const names=products.filter(p=>state.wishlist.includes(p.id)).map(p=>p.name); toast(`${names.length} favorito${names.length>1?'s':''}`, names.slice(0,2).join(' · ')); });
$('#accountBtn').addEventListener('click', () => toast('Mi cuenta', 'Login, pedidos y direcciones se conectarán con el backend.'));
$('#businessBtn').addEventListener('click', () => toast('Cotización empresas', 'El módulo B2B quedará conectado a formulario, WhatsApp y CRM.'));
$('#advisoryForm').addEventListener('submit', e => { e.preventDefault(); e.currentTarget.reset(); toast('Solicitud recibida', 'Demo local: después la enviaremos al CRM/WhatsApp.'); });
$('#newsletterForm').addEventListener('submit', e => { e.preventDefault(); e.currentTarget.reset(); toast('Suscripción registrada', 'Demo local: luego se conectará al proveedor de email.'); });

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
renderCategories(); renderProducts(); updateCart(); $('#wishlistCount').textContent = state.wishlist.length;
