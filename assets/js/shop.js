/* HEADS FIT · catálogo y pedidos por WhatsApp
   Sin pasarela de pagos. El comprador confirma el envío del mensaje en WhatsApp.
   Precios y disponibilidad se consultan al vendedor.
*/
(() => {
  'use strict';
  const PHONE = '593983551261';
  const STORAGE = 'heads-fit-pedido-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isClothing = () => location.pathname.split('/').pop() === 'ropa.html';
  const waLink = message => 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message);
  const contact = 'Hola, quisiera información sobre los productos de HEADS FIT.';
  const extras = [
    {name:'Camiseta Apex de entrenamiento',brand:'GYMSHARK',category:'CAMISETAS',image:'https://cdn.shopify.com/s/files/1/0156/6146/files/images-CrestT_ShirtBlackA1A3J_BBBB_0989_0461_1080x.jpg?v=1753104160',description:'Camiseta deportiva de entrenamiento. Confirma tallas y disponibilidad antes de realizar el pedido.'},
    {name:'Pantaloneta deportiva Arrival',brand:'GYMSHARK',category:'SHORTS',image:'https://cdn.shopify.com/s/files/1/0156/6146/files/images-Arrival5ShortsBlackA2A1M_BBBB_1826_A_Edit_1080x.jpg?v=1750084637',description:'Pantaloneta de entrenamiento de corte deportivo. Solicita información sobre materiales y tallas.'},
    {name:'Mallas deportivas sin costuras',brand:'GYMSHARK',category:'LEGGINGS',image:'https://cdn.shopify.com/s/files/1/0156/6146/files/images-RivalSeamlessLeggingGSBlackB6B2M_BB2J_2499_V1_1080x.jpg?v=1774905129',description:'Mallas deportivas para entrenamiento. Las características deben confirmarse con la etiqueta del modelo.'},
    {name:'Camiseta holgada deportiva',brand:'YoungLA',category:'CAMISETAS',image:'https://cdn.shopify.com/s/files/1/1775/6429/files/DSC04308.jpg?v=1774033074&width=1000',description:'Camiseta deportiva de estilo holgado. Consulta las medidas disponibles.'},
    {name:'Camiseta sin mangas de entrenamiento',brand:'YoungLA',category:'CAMISETAS',image:'https://cdn.shopify.com/s/files/1/1775/6429/files/3039_white_001_09_24_johnny_ecomm_a07bf3e9-ddc9-4aa6-a30c-6229e608f062.jpg?v=1790385752&width=1000',description:'Prenda sin mangas para entrenar. Solicita información sobre composición y tallas.'},
    {name:'Pantalón deportivo cómodo',brand:'YoungLA',category:'PANTALONES',image:'https://cdn.shopify.com/s/files/1/1775/6429/files/2179_black-wash_002_10_27_rudy_ecomm.jpg?v=1791667413&width=1000',description:'Pantalón cómodo para entrenamientos y uso cotidiano. Verifica los colores disponibles.'}
  ];

  // Se incorporan las seis fotografías de la colección recibida, sin eliminar las prendas anteriores.
  if (isClothing() && $('.product-grid')) {
    const grid = $('.product-grid');
    const offset = $$('.product-card', grid).length;
    extras.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'product-card reveal';
      for (const [key, value] of Object.entries({
        name:p.name, brand:p.brand, category:p.category, description:p.description,
        kind:'Ropa deportiva', features:'Fotografía de referencia · Tallas por confirmar',
        advice:'Pregunta por tallas, precio, colores y existencias antes de comprar.'
      })) card.dataset[key] = value;
      card.innerHTML = '<div class="product-image" role="button" tabindex="0" aria-label="Ver detalles de ' + escape(p.name) + '">'
        + '<img src="' + escape(p.image) + '" loading="lazy" alt="' + escape(p.name) + '">'
        + '<span class="product-index">HF / ' + String(offset + i + 1).padStart(2, '0') + '</span><span class="product-plus">+</span></div>'
        + '<div class="product-meta"><span>' + escape(p.brand) + '</span><span>' + escape(p.category) + '</span></div>'
        + '<h3>' + escape(p.name) + '</h3><p class="product-summary">' + escape(p.description) + '</p>'
        + '<button class="product-detail-btn" type="button">VER DETALLES <span aria-hidden="true">↗</span></button>';
      grid.append(card);
      const photo = $('img', card);
      photo.addEventListener('error', () => { photo.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=75'; }, {once:true});
    });
    const filters = $('.filter-list');
    if (filters && !$('.filter-btn[data-filter="SHORTS"]', filters)) {
      const button = document.createElement('button');
      button.className = 'filter-btn';
      button.dataset.filter = 'SHORTS';
      button.textContent = 'PANTALONETAS';
      filters.append(button);
    }
  }

  const validCart = item => item && typeof item.name === 'string' && item.name.length < 150
    && typeof item.brand === 'string' && typeof item.category === 'string'
    && typeof item.variant === 'string' && Number.isSafeInteger(item.qty) && item.qty > 0 && item.qty <= 99;
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || '[]');
    if (Array.isArray(saved)) cart = saved.filter(validCart).slice(0, 60);
  } catch (_) { cart = []; }
  const persist = () => { try { localStorage.setItem(STORAGE, JSON.stringify(cart)); } catch (_) {} };
  const quantity = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const keyOf = item => [item.name,item.brand,item.category,item.variant].join('|');
  const itemFrom = (card, variant = '') => ({
    name: String(card.dataset.name || $('h3', card)?.textContent || 'Producto').trim(),
    brand: String(card.dataset.brand || 'HEADS FIT').trim(),
    category: String(card.dataset.category || '').trim(),
    variant, qty:1
  });

  const header = $('.header-right');
  if (header) {
    const trigger = document.createElement('button');
    trigger.className = 'hf-cart-trigger';
    trigger.type = 'button';
    trigger.id = 'hf-open-cart';
    trigger.innerHTML = 'MI PEDIDO <span class="hf-count" aria-live="polite">0</span>';
    header.append(trigger);
  }
  const float = document.createElement('a');
  float.className = 'hf-whatsapp';
  float.href = waLink(contact);
  float.target = '_blank';
  float.rel = 'noopener noreferrer';
  float.setAttribute('aria-label','Consultar por WhatsApp');
  float.textContent = '✆  WHATSAPP';
  document.body.append(float);

  const drawer = document.createElement('dialog');
  drawer.className = 'hf-drawer';
  drawer.setAttribute('aria-label', 'Mi pedido');
  drawer.innerHTML = '<div class="hf-drawer-head"><div><p>HEADS FIT / TU SELECCIÓN</p><h2>MI PEDIDO</h2></div><button type="button" class="hf-close" aria-label="Cerrar">×</button></div><div class="hf-drawer-body"></div><div class="hf-drawer-foot"></div>';
  document.body.append(drawer);
  const choose = document.createElement('dialog');
  choose.className = 'hf-choose';
  choose.setAttribute('aria-labelledby', 'hf-choose-title');
  choose.innerHTML = '<button class="hf-choose-close" type="button" aria-label="Cerrar">×</button><p class="hf-small">AÑADIR A MI PEDIDO</p><h2 id="hf-choose-title"></h2><p class="hf-help">Consulta el precio y las existencias por WhatsApp.</p><div class="hf-variant-wrap"><label for="hf-size">Selecciona la talla</label><select id="hf-size"><option value="">Selecciona una talla</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>Por confirmar</option></select></div><button class="hf-confirm" type="button">AGREGAR AL PEDIDO ↗</button>';
  document.body.append(choose);
  const count = () => $$('.hf-count').forEach(node => node.textContent = quantity());
  const openDialog = dialog => { if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open',''); };
  const closeDialog = dialog => { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); };
  let activeCard = null;

  function selectItem(card) {
    activeCard = card;
    const detail = $('.detail-dialog');
    if (detail?.open) closeDialog(detail);
    $('#hf-choose-title').textContent = card.dataset.name || $('h3',card)?.textContent || 'Producto';
    const variant = $('.hf-variant-wrap');
    variant.hidden = !isClothing();
    $('#hf-size').value = '';
    openDialog(choose);
  }

  function addItem(item) {
    const existing = cart.find(row => keyOf(row) === keyOf(item));
    if (existing) existing.qty = Math.min(99, existing.qty + 1);
    else cart.push(item);
    persist(); count(); renderCart();
    closeDialog(choose);
    openDialog(drawer);
  }

  function renderCart() {
    const body = $('.hf-drawer-body',drawer);
    const foot = $('.hf-drawer-foot',drawer);
    if (!cart.length) {
      body.innerHTML = '<div class="hf-empty"><h3>Tu pedido está vacío.</h3><p>Explora la tienda y selecciona los productos que deseas consultar.</p><a href="ropa.html">VER ROPA ↗</a><a href="suplementos.html">VER SUPLEMENTOS ↗</a></div>';
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = cart.map((item,i)=>'<div class="hf-item"><div><span class="hf-small">'+escape(item.brand)+' / '+escape(item.category)+'</span><h3>'+escape(item.name)+'</h3>'+(item.variant?'<p>Talla: '+escape(item.variant)+'</p>':'')+'<small>Precio y disponibilidad por confirmar</small></div><div class="hf-item-actions"><button data-qty="-1" data-index="'+i+'" aria-label="Disminuir cantidad">−</button><strong>'+item.qty+'</strong><button data-qty="1" data-index="'+i+'" aria-label="Aumentar cantidad">+</button><button class="hf-remove" data-remove="'+i+'" aria-label="Quitar producto">QUITAR</button></div></div>').join('');
    foot.innerHTML = '<p>'+quantity()+' unidad(es) seleccionada(s). El importe final se confirma por WhatsApp.</p><button id="hf-send" class="hf-send" type="button">SOLICITAR POR WHATSAPP ↗</button><small>WhatsApp abrirá el mensaje listo para enviar. Tú confirmas el envío.</small>';
  }

  function message() {
    return ['Hola, quisiera consultar disponibilidad y precios de mi pedido en HEADS FIT:','',
      ...cart.map((item,i)=>(i+1)+'. '+item.name+' | '+item.brand+(item.variant?' | Talla: '+item.variant:'')+' | Cantidad: '+item.qty),
      '', 'Total de unidades: '+quantity(),
      'Por favor, confírmame los precios, la disponibilidad, las formas de pago y la entrega. ¡Gracias!'].join('\n');
  }
  document.addEventListener('click', event => {
    const buy = event.target.closest('.hf-buy');
    if (buy) {
      const card = buy.closest('.product-card') || $$('.product-card').find(c => c.dataset.name === $('#detail-title')?.textContent);
      if (card) selectItem(card);
    }
    if (event.target.closest('#hf-open-cart')) { renderCart(); openDialog(drawer); }
    if (event.target.closest('.hf-close')) closeDialog(drawer);
    if (event.target.closest('.hf-choose-close')) closeDialog(choose);
    if (event.target.closest('.hf-confirm') && activeCard) {
      const variant = isClothing() ? $('#hf-size').value : '';
      if (isClothing() && !variant) {
        $('#hf-size').focus();
        $('.hf-help').textContent = 'Por favor, elige una talla o selecciona «Por confirmar».';
        return;
      }
      addItem(itemFrom(activeCard,variant));
      $('.hf-help').textContent='Consulta el precio y las existencias por WhatsApp.';
    }
    const change = event.target.closest('[data-qty]');
    if (change) {
      const i = Number(change.dataset.index);
      if (cart[i]) { cart[i].qty += Number(change.dataset.qty); if(cart[i].qty<=0) cart.splice(i,1); persist(); count();renderCart(); }
    }
    const remove = event.target.closest('[data-remove]');
    if (remove) { cart.splice(Number(remove.dataset.remove),1); persist();count();renderCart(); }
    if (event.target.closest('#hf-send') && cart.length) {
      window.open(waLink(message()), '_blank', 'noopener,noreferrer');
    }
  });
  [drawer, choose].forEach(dialog => dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(dialog); }));

  $$('.product-card').forEach(card => {
    const button = document.createElement('button');
    button.className = 'hf-buy';
    button.type = 'button';
    button.textContent = 'AÑADIR AL PEDIDO  ↗';
    card.append(button);
  });
  const details = $('.detail-dialog .detail-content');
  if (details) {
    const button = document.createElement('button');
    button.className = 'hf-buy hf-buy-detail';
    button.type = 'button';
    button.textContent = 'AÑADIR AL PEDIDO  ↗';
    details.append(button);
  }

  const social = $('.footer-social .social-note');
  if (social) social.innerHTML = 'Pedidos y consultas<br><a href="'+waLink(contact)+'" target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp</a>';
  const symbols = $$('.footer-social [aria-label="WhatsApp"]');
  symbols.forEach(icon => {
    const link = document.createElement('a');
    link.className = icon.className;
    link.href = waLink(contact);
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.setAttribute('aria-label', 'Escribir por WhatsApp');
    link.innerHTML = icon.innerHTML;
    icon.replaceWith(link);
  });
  count(); renderCart();
})();