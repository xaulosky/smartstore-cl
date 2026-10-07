import { products, categories, installationLabels, reviewedAt } from './data.js?v=0.2.0';
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const byId = new Map(products.map(p => [p.id, p]));
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const price = p => Number.isFinite(p.price) ? new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(p.price) : 'Precio por confirmar';
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
const rawCart = read('smartstore:cart', {});
const rawWishes = read('smartstore:wishlist', []);
const state = {
  cart:Object.fromEntries(Object.entries(rawCart && typeof rawCart==='object' && !Array.isArray(rawCart)?rawCart:{}).filter(([id,q]) => byId.has(id) && Number.isInteger(q) && q>0 && q<=99)),
  wishlist:Array.isArray(rawWishes)?[...new Set(rawWishes.filter(id => byId.has(id)))]:[],
  category:'all', search:'', brand:'all', installation:'all', favorites:false
};
let activeDialog=null, returnFocus=null;
function persist() { try { localStorage.setItem('smartstore:cart',JSON.stringify(state.cart)); localStorage.setItem('smartstore:wishlist',JSON.stringify(state.wishlist)); } catch { /* Browsing still works without persistent storage. */ } }
function toast(title, message='') {
  const el=document.createElement('div'); el.className='toast';
  el.innerHTML=`<b aria-hidden="true">✓</b><span><strong>${esc(title)}</strong>${message?`<br>${esc(message)}`:''}</span>`;
  $('#toastStack').append(el);
  while ($('#toastStack').children.length>3) $('#toastStack').firstElementChild.remove();
  setTimeout(()=>el.remove(),4000);
}
function image(p, eager=false) {
  return `<div class="product-media"><img src="${esc(p.image)}" alt="${esc(p.brand+' '+p.model)}" width="590" height="440" loading="${eager?'eager':'lazy'}" decoding="async" referrerpolicy="no-referrer"><span class="image-fallback" hidden>${esc(p.brand)}<br><strong>${esc(p.model)}</strong><small>Imagen no disponible</small></span></div>`;
}
function bindImageFallback(root=document) {
  $$('img',root).forEach(img=>{
    const fallback=()=>{img.hidden=true; const next=img.nextElementSibling; if(next?.classList.contains('image-fallback')) next.hidden=false;};
    img.addEventListener('error',fallback,{once:true});
    if(img.complete && !img.naturalWidth) fallback();
  });
}
function renderCategories() {
  const options=[{id:'all',name:'Todas las categorías'},...categories];
  $('#categoryFilter').innerHTML=options.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  $('#brandFilter').innerHTML='<option value="all">Todas las marcas</option>'+[...new Set(products.map(p=>p.brand))].map(b=>`<option>${esc(b)}</option>`).join('');
  $('#installationFilter').innerHTML='<option value="all">Cualquier instalación</option>'+Object.entries(installationLabels).map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join('');
  const card = c => `<button class="category-card" type="button" data-category="${c.id}"><span class="category-icon" aria-hidden="true">${c.icon}</span><strong>${esc(c.name)}</strong><small>${esc(c.description)}</small><span class="category-count">${products.filter(p=>p.category===c.id).length} productos →</span></button>`;
  $('#categoryGrid').innerHTML=categories.map(card).join('');
  $('#categoryMenu').innerHTML=categories.map(card).join('');
}
function filteredProducts() {
  const terms=normalize(state.search).trim().split(/\s+/).filter(Boolean);
  return products.filter(p=>
    (state.category==='all'||p.category===state.category) &&
    (state.brand==='all'||p.brand===state.brand) &&
    (state.installation==='all'||p.installation===state.installation) &&
    (!state.favorites||state.wishlist.includes(p.id)) &&
    terms.every(t=>normalize([p.name,p.model,p.brand,p.description,...p.features].join(' ')).includes(t))
  );
}
function syncFilters() {
  $('#categoryFilter').value=state.category; $('#brandFilter').value=state.brand;
  $('#installationFilter').value=state.installation; $('#searchInput').value=state.search;
  $('#onlyFavorites').checked=state.favorites;
  $('#wishlistBtn').setAttribute('aria-pressed',String(state.favorites));
}
function renderProducts() {
  const list=filteredProducts(); syncFilters();
  $('#searchStatus').textContent=`${list.length} de ${products.length} productos${state.favorites?' · Tus favoritos':''}${state.search?' · Búsqueda: '+state.search:''}`;
  $('#productGrid').innerHTML=list.length?list.map((p,i)=>`<article class="product-card" data-product-id="${p.id}">
    <button class="product-image" type="button" data-open-product="${p.id}" aria-label="Ver ${esc(p.brand+' '+p.model)}">${image(p,i<4)}<span class="badge">${esc(p.model)}</span></button>
    <button class="wish ${state.wishlist.includes(p.id)?'active':''}" type="button" data-wish="${p.id}" aria-label="${state.wishlist.includes(p.id)?'Quitar':'Guardar'} ${esc(p.model)} en favoritos" aria-pressed="${state.wishlist.includes(p.id)}">${state.wishlist.includes(p.id)?'♥':'♡'}</button>
    <div class="product-info"><span class="brand-name">${esc(p.brand)}</span><h3><button type="button" class="title-button" data-open-product="${p.id}">${esc(p.name)}</button></h3>
    <span class="installation-tag ${p.requiresHub?'needs-hub':''}">${esc(installationLabels[p.installation])}</span>
    <p class="product-description">${esc(p.description)}</p>
    <div class="feature-chips">${p.features.slice(0,2).map(f=>`<span>${esc(f)}</span>`).join('')}</div>
    <div class="price-row"><span class="pending-price">${price(p)}</span></div>
    <div class="product-actions"><button class="add-btn" type="button" data-add="${p.id}">Agregar a mi lista</button><button class="quick-btn" type="button" data-open-product="${p.id}" aria-label="Ver ficha de ${esc(p.model)}">＋</button></div>
    <div class="pending-stock">Disponibilidad por confirmar</div></div></article>`).join(''):'<div class="empty"><b>⌕</b>No hay productos con estos filtros.<br><button class="btn primary" type="button" data-reset>Limpiar filtros</button></div>';
  bindImageFallback($('#productGrid')); $('#wishlistCount').textContent=state.wishlist.length;
}
function scrollToProducts() { $('#productos').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }
function resetFilters() { Object.assign(state,{category:'all',brand:'all',installation:'all',search:'',favorites:false}); renderProducts(); }
function selectCategory(id) {
  resetFilters(); state.category=categories.some(c=>c.id===id)?id:'all';
  closeAll(); renderProducts(); scrollToProducts();
}
function addToCart(id) {
  const p=byId.get(id); if(!p) return;
  if((state.cart[id]||0)>=99) return toast('Límite de la lista','Máximo 99 unidades por referencia; no indica stock.');
  state.cart[id]=(state.cart[id]||0)+1; persist(); updateCart(); toast('Agregado a tu lista',p.brand+' '+p.model+' · Aún no es un pedido.');
}
function changeQty(id,delta) {
  if(!byId.has(id))return;
  const next=(state.cart[id]||0)+delta;
  if(next>99) return toast('Límite de la lista','Máximo 99 unidades por referencia; no indica stock.');
  if(next<=0)delete state.cart[id]; else state.cart[id]=next;
  persist(); updateCart();
}
function updateCart() {
  const items=Object.entries(state.cart).map(([id,qty])=>({p:byId.get(id),qty})).filter(x=>x.p);
  const count=items.reduce((s,x)=>s+x.qty,0); $('#cartCount').textContent=count;
  $('#cartItems').innerHTML=items.length?items.map(({p,qty})=>`<div class="cart-item">${image(p)}<div><h4>${esc(p.brand+' '+p.model)}</h4><small>Precio y stock por confirmar</small><div class="qty"><button type="button" data-qty="${p.id}" data-delta="-1" aria-label="Reducir ${esc(p.model)}">−</button><span>${qty}</span><button type="button" data-qty="${p.id}" data-delta="1" aria-label="Aumentar ${esc(p.model)}">+</button></div></div><button type="button" class="remove" data-remove="${p.id}" aria-label="Quitar ${esc(p.model)}">×</button></div>`).join(''):'<div class="empty"><b>⌑</b>Tu lista está vacía.<br><small>Explora el catálogo y guarda lo que te interesa.</small></div>';
  $('#cartFooter').innerHTML=items.length?`<p class="selection-note">${count} unidades seleccionadas. No es un pedido ni una reserva. El total se calculará cuando se confirmen precios y disponibilidad.</p><button type="button" class="checkout" id="copySelection">Copiar selección</button><p class="small-note">La lista se guarda en este navegador. No se envía automáticamente.</p><textarea id="selectionText" aria-label="Selección para copiar" readonly hidden></textarea>`:'';
  bindImageFallback($('#cartItems'));
}
async function copySelection() {
  const text='Mi selección SmartStore (precios y stock pendientes):\n'+Object.entries(state.cart).map(([id,q])=>`${q} × ${byId.get(id).brand} ${byId.get(id).model}`).join('\n')+'\nNo es un pedido confirmado.';
  try { await navigator.clipboard.writeText(text); toast('Selección copiada','Puedes pegarla en un mensaje.'); }
  catch { const field=$('#selectionText');field.hidden=false;field.value=text;field.focus();field.select();toast('Selecciona y copia el texto','Tu navegador no permitió copiar automáticamente.'); }
}
function toggleWish(id) {
  if(!byId.has(id))return;
  state.wishlist=state.wishlist.includes(id)?state.wishlist.filter(x=>x!==id):[...state.wishlist,id];
  persist();renderProducts();
  // Restore focus when rendering replaces the clicked button.
  $(`[data-wish="${id}"]`)?.focus({preventScroll:true});
  toast(state.wishlist.includes(id)?'Guardado en favoritos':'Quitado de favoritos');
}
function openProduct(id) {
  const p=byId.get(id);if(!p)return;
  const related=p.requiresHub?[byId.get('ezviz-a3')]:p.category==='interior'||p.category==='exterior'?[byId.get('sandisk-endurance-128')]:[];
  $('#modalContent').innerHTML=`<div class="quick-view"><div class="detail-image">${image(p,true)}<small>Imagen del fabricante · versión referencial</small></div><div class="quick-content"><span class="brand-name">${esc(p.brand+' · '+p.model)}</span><h2 id="productTitle">${esc(p.name)}</h2><span class="installation-tag ${p.requiresHub?'needs-hub':''}">${esc(installationLabels[p.installation])}</span><p>${esc(p.description)}</p><strong class="pending-price">${price(p)}</strong><p class="pending-stock">Disponibilidad y SKU regional por confirmar</p><ul class="feature-list">${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><div class="requirements"><h3>Antes de comprar</h3><ul>${p.requirements.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div><h3>Instalación orientativa</h3><ol class="install-steps">${p.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="small-note">Esta orientación no sustituye el manual. La dificultad indicada es una clasificación editorial, no una garantía de instalación.</p>${related.length?`<div class="related"><h3>${p.requiresHub?'Necesitas este hub':'Complemento a revisar'}</h3>${related.map(r=>`<button type="button" data-open-product="${r.id}">${esc(r.brand+' '+r.model)} →</button>`).join('')}</div>`:''}<a class="source-link" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Ver ficha oficial del fabricante ↗</a><p class="small-note">Revisado: ${reviewedAt}. Las prestaciones pueden variar por versión, región y firmware. Confirmar enchufe y alimentación del SKU suministrado. El almacenamiento en nube puede requerir suscripción; microSD y panel solar no se incluyen salvo que el pack lo indique.</p><button class="btn primary" type="button" data-add="${p.id}">Agregar a mi lista</button></div></div>`;
  bindImageFallback($('#modalContent'));openDrawer('productModal');
}
function openDrawer(id) {
  const target=document.getElementById(id);if(!target)return;
  if(!activeDialog)returnFocus=document.activeElement;
  closeAll(false);activeDialog=target;target.inert=false;target.classList.add('open');target.setAttribute('aria-hidden','false');
  $('#backdrop').classList.add('show');document.body.style.overflow='hidden';
  $$('[data-page]').forEach(el=>el.inert=true);
  target.querySelector('button,a,input')?.focus({preventScroll:true});
}
function closeAll(restore=true) {
  $$('.drawer,.modal').forEach(el=>{el.classList.remove('open');el.setAttribute('aria-hidden','true');el.inert=true;});activeDialog=null;
  if(restore){$('#backdrop').classList.remove('show');document.body.style.overflow='';$$('[data-page]').forEach(el=>el.inert=false);if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});returnFocus=null;}
}
document.addEventListener('click',e=>{
  const b=e.target.closest('button,a');if(!b)return;
  if(b.hasAttribute('data-add'))addToCart(b.dataset.add);
  else if(b.hasAttribute('data-wish'))toggleWish(b.dataset.wish);
  else if(b.hasAttribute('data-open-product'))openProduct(b.dataset.openProduct);
  else if(b.hasAttribute('data-category')){e.preventDefault();selectCategory(b.dataset.category);}
  else if(b.hasAttribute('data-close'))closeAll();
  else if(b.hasAttribute('data-qty'))changeQty(b.dataset.qty,Number(b.dataset.delta));
  else if(b.hasAttribute('data-remove')){delete state.cart[b.dataset.remove];persist();updateCart();}
  else if(b.hasAttribute('data-reset'))resetFilters();
  else if(b.id==='copySelection')copySelection();
});
$('#cartBtn').addEventListener('click',()=>openDrawer('cartDrawer'));
$('#categoriesBtn').addEventListener('click',()=>openDrawer('categoryDrawer'));
$('#backdrop').addEventListener('click',()=>closeAll());
$('#wishlistBtn').addEventListener('click',()=>{state.favorites=!state.favorites;state.category='all';state.brand='all';state.installation='all';state.search='';renderProducts();scrollToProducts();});
$('#onlyFavorites').addEventListener('change',e=>{state.favorites=e.target.checked;renderProducts();});
$('#categoryFilter').addEventListener('change',e=>{state.category=e.target.value;renderProducts();});
$('#brandFilter').addEventListener('change',e=>{state.brand=e.target.value;renderProducts();});
$('#installationFilter').addEventListener('change',e=>{state.installation=e.target.value;renderProducts();});
$('#searchForm').addEventListener('submit',e=>{e.preventDefault();state.search=$('#searchInput').value;state.category='all';state.brand='all';state.installation='all';state.favorites=false;renderProducts();scrollToProducts();});
document.addEventListener('keydown',e=>{
  if(!activeDialog)return;
  if(e.key==='Escape')closeAll();
  if(e.key==='Tab'){
    const targets=$$('button,a[href],input,select,textarea,[tabindex="0"]',activeDialog).filter(el=>!el.disabled&&!el.hidden&&el.getClientRects().length);
    const first=targets[0],last=targets.at(-1);if(!first)return;
    if(e.shiftKey&&(document.activeElement===first||!activeDialog.contains(document.activeElement))){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||!activeDialog.contains(document.activeElement))){e.preventDefault();first.focus();}
  }
});
renderCategories();renderProducts();updateCart();persist();closeAll();
$('#catalogVersion').textContent=`Catálogo 0.2 · ${products.length} productos · ${categories.length} categorías`;
