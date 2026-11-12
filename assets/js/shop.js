/* HEADS FIT · catálogo V3 sin backend · pedido consultivo por WhatsApp */
(() => {
'use strict';
const PHONE='593983551261', KEY='heads-fit-pedido-v1';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const clean=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wa=s=>'https://wa.me/'+PHONE+'?text='+encodeURIComponent(s);
const products=(window.HEADS_PRODUCTS||[]).map(p=>({...p,nombre:String(p.nombre||''),marca:String(p.marca||''),tipo:String(p.tipo||'')}));
const page=location.pathname.split('/').pop()||'index.html';
const query=new URLSearchParams(location.search);
const catalogPages=['ropa.html','suplementos.html','accesorios.html','catalogo.html'];
const isCatalog=catalogPages.includes(page);
const catType=page==='catalogo.html'?'todos':page.replace('.html','');
const fallback={
 ropa:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=75',
 suplementos:'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=75',
 accesorios:'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=75'
};
function imgFail(e){const im=e.target;if(!im.matches('img[data-fallback]'))return;if(im.dataset.failed)return;im.dataset.failed='1';im.src=im.dataset.fallback||fallback.ropa;}
document.addEventListener('error',imgFail,true);

const brandNames=['GYMSHARK','YoungLA','NIKE','ADIDAS','UNDER ARMOUR','OPTIMUM NUTRITION','MYPROTEIN','MUSCLETECH','GHOST','HEADS FIT'];
const categoryLabels={'CAMISETAS':'Camisetas','PANTALONETAS':'Pantalonetas','PANTALONES':'Pantalones','LEGGINGS':'Mallas','HOODIES':'Sudaderas','MUJER':'Mujer','PROTEÍNA':'Proteínas','CREATINA':'Creatina','PRE-ENTRENO':'Preentrenos','VITAMINAS':'Vitaminas','HIDRATACIÓN':'Hidratación','BOLSOS':'Bolsos','FUERZA':'Fuerza','PROTECCIÓN':'Protección','SHORTS':'Pantalonetas'};
const countBy=b=>products.filter(p=>clean(p.marca)===clean(b)).length;
const normalBrand=b=>brandNames.find(x=>clean(x)===clean(b))||b;

const header=$('.site-header');
if(header){
  const navbar=$('.main-nav');
  if(navbar&&!$('a[href="catalogo.html"]',navbar)){
    const a=document.createElement('a');a.href='catalogo.html';a.textContent='CATÁLOGO';if(page==='catalogo.html')a.className='active';
    navbar.insertBefore(a,navbar.querySelector('a[href="marcas.html"]'));
  }
  const right=$('.header-right');
  if(right){
    const a=$('.contact-link',right); if(a){a.href=wa('Hola, quisiera consultar productos de HEADS FIT.');a.target='_blank';a.rel='noopener noreferrer';}
    const b=document.createElement('button');
    b.type='button';b.className='hf-cart-trigger';b.id='hf-open-cart';b.innerHTML='MI BOLSA <span class="hf-count" aria-live="polite">0</span>';
    right.append(b);
  }
}

let cart=[];
try{const stored=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(stored))cart=stored.filter(x=>x&&typeof x.name==='string'&&typeof x.brand==='string'&&typeof x.category==='string'&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<100).slice(0,90);}catch(_){}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(cart));}catch(_){}}
function units(){return cart.reduce((sum,x)=>sum+x.qty,0)}
function syncCount(){$$('.hf-count').forEach(el=>el.textContent=units())}
function makeDialog(className,markup){const d=document.createElement('dialog');d.className=className;d.innerHTML=markup;document.body.append(d);return d}
function open(d){if(d&&!d.open)d.showModal()}
function close(d){if(d?.open)d.close()}
const drawer=makeDialog('hf-drawer','<div class="hf-drawer-head"><div><p>HEADS FIT / TU SELECCIÓN</p><h2>MI BOLSA <span class="hf-count">0</span></h2></div><button class="hf-close" type="button" aria-label="Cerrar bolsa">×</button></div><div class="hf-drawer-body"></div><div class="hf-drawer-foot"></div>');
const chooser=makeDialog('hf-choose','<button class="hf-choose-close" type="button" aria-label="Cerrar">×</button><p class="hf-small">PERSONALIZA TU PEDIDO</p><h2 id="hf-choose-title"></h2><p class="hf-help">Selecciona las opciones que prefieres. Confirmaremos su disponibilidad.</p><div class="hf-options-grid"><label class="hf-option"><span id="hf-color-label">COLOR O SABOR</span><select id="hf-color"></select></label><label class="hf-option"><span id="hf-size-label">TALLA O PRESENTACIÓN</span><select id="hf-size"></select></label></div><div class="hf-choice-quantity"><label for="hf-qty">CANTIDAD</label><div class="hf-qty-control"><button type="button" data-choice-adjust="-1" aria-label="Disminuir cantidad">−</button><input id="hf-qty" type="number" min="1" max="99" value="1" inputmode="numeric"><button type="button" data-choice-adjust="1" aria-label="Aumentar cantidad">+</button></div></div><p class="hf-availability">Los colores, tallas y presentaciones son preferencias sujetas a confirmación.</p><button type="button" class="hf-confirm">AÑADIR A MI BOLSA ↗</button>');
const quick=makeDialog('hf-quick','<button type="button" class="hf-quick-close" aria-label="Cerrar detalle">×</button><div class="hf-quick-layout"><div class="hf-quick-image"></div><div class="hf-quick-body"><p class="hf-small hf-quick-brand"></p><h2 class="hf-quick-title"></h2><p class="hf-quick-desc"></p><div class="hf-quick-info"><span>DETALLES</span><p class="hf-quick-features"></p></div><div class="hf-quick-info"><span>IMPORTANTE</span><p class="hf-quick-advice"></p></div><button type="button" class="hf-quick-add">AÑADIR A MI BOLSA ↗</button><p class="hf-quick-notice">Catálogo orientativo: precios y existencias se confirman por WhatsApp. Las imágenes pueden ser ilustrativas.</p></div></div>');
let active=null;
function add(p,variant,color,quantity){
 const qty=Math.min(99,Math.max(1,Math.trunc(Number(quantity)||1)));
 const next={name:p.nombre,brand:p.marca,category:p.categoria,variant:variant||'',color:color||'',qty};
 const old=cart.find(x=>x.name===next.name&&x.brand===next.brand&&x.variant===next.variant&&(x.color||'')===next.color);
 if(old)old.qty=Math.min(99,old.qty+qty);else cart.push(next);
 persist();syncCount();renderCart();close(chooser);open(drawer);
}
function renderCart(){
 const body=$('.hf-drawer-body',drawer),foot=$('.hf-drawer-foot',drawer);
 if(!cart.length){
   body.innerHTML='<div class="hf-empty"><h3>Tu bolsa te espera.</h3><p>Descubre tus favoritos y agrégalos para consultarnos por WhatsApp.</p><a href="catalogo.html">EXPLORAR CATÁLOGO ↗</a></div>';foot.innerHTML='';return;
 }
 body.innerHTML=cart.map((x,i)=>'<div class="hf-item"><div><span class="hf-small">'+safe(x.brand)+' / '+safe(x.category)+'</span><h3>'+safe(x.name)+'</h3>'+(x.color?'<p>Color / sabor: '+safe(x.color)+'</p>':'')+(x.variant?'<p>Talla / presentación: '+safe(x.variant)+'</p>':'')+'<small>Precio y disponibilidad por confirmar</small></div><div class="hf-item-actions"><button data-qty="-1" data-index="'+i+'" aria-label="Disminuir cantidad">−</button><strong>'+x.qty+'</strong><button data-qty="1" data-index="'+i+'" aria-label="Aumentar cantidad">+</button><button class="hf-remove" data-remove="'+i+'">QUITAR</button></div></div>').join('');
 foot.innerHTML='<p>'+units()+' unidad(es) seleccionada(s). Te confirmaremos precios y disponibilidad.</p><button class="hf-send" type="button">PEDIR POR WHATSAPP ↗</button><small>Se abre WhatsApp con el mensaje preparado; confirma el envío allí.</small>';
}
function msg(){
 return ['¡Hola! Quisiera consultar mi selección de HEADS FIT:','',...cart.map((x,i)=>(i+1)+'. '+x.name+' · '+x.brand+(x.color?' · Color/sabor: '+x.color:'')+(x.variant?' · Talla/presentación: '+x.variant:'')+' · Cantidad '+x.qty),'','Total: '+units()+' unidades.','¿Podrían confirmarme precios, disponibilidad, formas de pago y entrega? ¡Gracias!'].join('\n');
}
function optionsFor(p){
 if(p.tipo==='ropa')return {colour:'COLOR',size:'TALLA',colours:p.colores?.length?p.colores:['Negro','Blanco','Gris','Azul','Verde','Por confirmar'],sizes:['XS','S','M','L','XL','XXL','Por confirmar']};
 if(p.tipo==='suplementos')return {colour:'SABOR',size:'PRESENTACIÓN',colours:['Sin sabor','Chocolate','Vainilla','Fresa','Otro / por confirmar'],sizes:['Presentación pequeña','Presentación mediana','Presentación grande','Por confirmar']};
 return {colour:'COLOR',size:'TALLA / MODELO',colours:['Negro','Blanco','Gris','Azul','Otro / por confirmar'],sizes:['Única / estándar','S','M','L','XL','Por confirmar']};
}
function choose(p){
 if(!p)return;active=p;close(quick);
 $('#hf-choose-title',chooser).textContent=p.nombre;
 const cfg=optionsFor(p);
 $('#hf-color-label',chooser).textContent=cfg.colour;
 $('#hf-size-label',chooser).textContent=cfg.size;
 const paint=(selector,label,options)=>{const node=$(selector,chooser);node.innerHTML='<option value="">'+safe('Selecciona '+label.toLowerCase())+'</option>'+options.map(x=>'<option value="'+safe(x)+'">'+safe(x)+'</option>').join('');node.value='';};
 paint('#hf-color',cfg.colour,cfg.colours);
 paint('#hf-size',cfg.size,cfg.sizes);
 $('#hf-qty',chooser).value='1';
 $('.hf-help',chooser).textContent='Elige tus opciones preferidas para consultar disponibilidad.';
 open(chooser);
}
function show(p){
 if(!p)return;active=p;
 $('.hf-quick-brand',quick).textContent=p.marca+' / '+(categoryLabels[p.categoria]||p.categoria);
 $('.hf-quick-title',quick).textContent=p.nombre;
 $('.hf-quick-desc',quick).textContent=p.descripcion||'Descubre los detalles de este producto.';
 $('.hf-quick-features',quick).textContent=p.detalles||'Detalles por confirmar.';
 $('.hf-quick-advice',quick).textContent=p.consejo||'Consulta tallas, ingredientes y disponibilidad.';
 $('.hf-quick-image',quick).innerHTML='<img alt="'+safe(p.nombre)+'" src="'+safe(p.imagen||fallback[p.tipo])+'" data-fallback="'+safe(fallback[p.tipo])+'" loading="lazy">';
 open(quick);
}
const byId=id=>products.find(p=>p.id===id);
document.addEventListener('click',e=>{
 const t=e.target;
 if(t.closest('#hf-open-cart')){renderCart();open(drawer)}
 if(t.closest('.hf-close'))close(drawer);
 if(t.closest('.hf-choose-close'))close(chooser);
 if(t.closest('.hf-quick-close'))close(quick);
 const addBtn=t.closest('[data-buy]');if(addBtn){choose(byId(addBtn.dataset.buy));return;}
 const detailBtn=t.closest('[data-detail]');if(detailBtn){show(byId(detailBtn.dataset.detail));return;}
 if(t.closest('.hf-quick-add'))choose(active);
 const adjust=t.closest('[data-choice-adjust]');
 if(adjust){const el=$('#hf-qty',chooser);el.value=String(Math.min(99,Math.max(1,(Number(el.value)||1)+Number(adjust.dataset.choiceAdjust))));}
 if(t.closest('.hf-confirm')&&active){
   const color=$('#hf-color',chooser).value,size=$('#hf-size',chooser).value;
   if(!color){$('.hf-help',chooser).textContent='Selecciona primero el color o sabor.';$('#hf-color',chooser).focus();return;}
   if(!size){$('.hf-help',chooser).textContent='Selecciona la talla o presentación.';$('#hf-size',chooser).focus();return;}
   const quantity=Math.min(99,Math.max(1,Math.trunc(Number($('#hf-qty',chooser).value)||1)));
   add(active,size,color,quantity);
 }
 const change=t.closest('[data-qty]');if(change){const i=Number(change.dataset.index);if(cart[i]){cart[i].qty=Math.max(0,Math.min(99,cart[i].qty+Number(change.dataset.qty)));if(cart[i].qty===0)cart.splice(i,1);persist();renderCart();syncCount()}}
 const remove=t.closest('[data-remove]');if(remove){cart.splice(Number(remove.dataset.remove),1);persist();renderCart();syncCount()}
 if(t.closest('.hf-send')&&cart.length){window.open(wa(msg()),'_blank','noopener,noreferrer')}
});
[drawer,chooser,quick].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)close(d)}));
const whatsapp=document.createElement('a');whatsapp.className='hf-whatsapp';whatsapp.href=wa('¡Hola! Quisiera información sobre HEADS FIT.');whatsapp.target='_blank';whatsapp.rel='noopener noreferrer';whatsapp.setAttribute('aria-label','Hablar por WhatsApp');whatsapp.innerHTML='<svg viewBox="0 0 32 32" width="29" height="29" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 2.5a13.2 13.2 0 0 0-11.3 20L2.8 29l6.7-1.8A13.3 13.3 0 1 0 16 2.5Zm0 24a10.8 10.8 0 0 1-5.5-1.5l-.4-.3-4 1.1 1.1-3.9-.3-.4a10.8 10.8 0 1 1 9.1 5Zm6-7.7c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.9c-.3-.5.3-.5.8-1.6.1-.2.1-.4 0-.6l-1-2.3c-.2-.5-.4-.4-.7-.4h-.6c-.3 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8s1.3 3.2 1.4 3.4c.2.2 2.5 3.7 5.9 5.1 2.2.9 3.1.8 4.2.7.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.5Z"/></svg>';document.body.append(whatsapp);
const social=$('.footer-social .social-note');if(social)social.innerHTML='¿NECESITAS AYUDA?<br><a href="'+wa('Hola, quisiera información sobre HEADS FIT.')+'" target="_blank" rel="noopener noreferrer">ESCRÍBENOS POR WHATSAPP ↗</a>';
$$('.footer-social [aria-label="WhatsApp"]').forEach(icon=>{const a=document.createElement('a');a.href=wa('Hola, quisiera información sobre HEADS FIT.');a.target='_blank';a.rel='noopener noreferrer';a.className=icon.className;a.setAttribute('aria-label','Contactar por WhatsApp');a.innerHTML=icon.innerHTML;icon.replaceWith(a)});
syncCount();renderCart();

function card(p,i){
 const alt=safe(p.nombre),im=safe(p.imagen||fallback[p.tipo]);
 return '<article class="hf-product" style="--stagger:'+Math.min(i%12,11)+'" data-product-id="'+safe(p.id)+'">'+
 '<button type="button" class="hf-product-photo" data-detail="'+safe(p.id)+'" aria-label="Ver detalles de '+alt+'">'+
 '<img src="'+im+'" alt="'+alt+'" data-fallback="'+safe(fallback[p.tipo])+'" loading="lazy" decoding="async"><span class="hf-photo-overlay">VER PRODUCTO ↗</span>'+
 (p.etiqueta?'<span class="hf-tag">'+safe(p.etiqueta)+'</span>':'')+'</button>'+
 '<div class="hf-product-details"><div class="hf-meta"><a href="catalogo.html?marca='+encodeURIComponent(p.marca)+'">'+safe(p.marca)+'</a><span>'+safe(categoryLabels[p.categoria]||p.categoria)+'</span></div>'+
 '<h3>'+alt+'</h3><p>'+safe(p.descripcion||'Descubre este producto deportivo.')+'</p>'+
 '<div class="hf-product-footer"><span>CONSULTAR PRECIO</span><button type="button" data-buy="'+safe(p.id)+'" aria-label="Añadir '+alt+' a la bolsa">AÑADIR <span aria-hidden="true">↗</span></button></div></div></article>';
}
function renderBrands(){
 const root=$('#hf-brand-directory');if(!root)return;
 const info=[
  ['GYMSHARK','El entrenamiento es una forma de vida.','ATLETISMO / GIMNASIO','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=85'],
  ['YoungLA','Prendas que se mueven contigo.','FUERZA / ESTILO','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85'],
  ['NIKE','Movimiento que inspira.','DEPORTE / INNOVACIÓN','https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1100&q=85'],
  ['ADIDAS','Estilo y rendimiento en cada sesión.','ENTRENAMIENTO / ESTILO','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85'],
  ['UNDER ARMOUR','Preparado para cada repetición.','RENDIMIENTO / FUERZA','https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1100&q=85'],
  ['OPTIMUM NUTRITION','Nutrición deportiva para tus objetivos.','SUPLEMENTOS / PROTEÍNA','https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1100&q=85'],
  ['MYPROTEIN','Complementos para tu rutina.','SUPLEMENTOS / NUTRICIÓN','https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1100&q=85'],
  ['MUSCLETECH','Explora la nutrición deportiva.','SUPLEMENTOS / FUERZA','https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1100&q=85'],
  ['GHOST','Tu elección, tu entrenamiento.','SUPLEMENTOS / ENERGÍA','https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1100&q=85']
 ];
 root.innerHTML=info.filter(b=>countBy(b[0])).map((b,i)=>'<a class="hf-brand-card" href="catalogo.html?marca='+encodeURIComponent(b[0])+'" style="--stagger:'+i+';--brand-bg:url(\''+b[3]+'\')"><span class="hf-brand-index">'+String(i+1).padStart(2,'0')+' / '+safe(b[2])+'</span><div class="hf-brand-main"><h3>'+safe(b[0])+'</h3><p>'+safe(b[1])+'</p></div><div class="hf-brand-bottom"><span>'+countBy(b[0])+' ARTÍCULOS</span><b>EXPLORAR COLECCIÓN ↗</b></div></a>').join('');
}

function renderCatalog(){
 if(!isCatalog)return;
 const section=$('.catalog-section'),grid=$('.product-grid');if(!section||!grid)return;
 const root=document.createElement('div');root.className='hf-catalog-shell';
 const intro=$('.catalog-intro',section);
 if(intro)intro.innerHTML='<span class="micro-label">HEADS FIT / SELECCIÓN DEPORTIVA</span><h2>ENCUENTRA TU <em>PRÓXIMO FAVORITO.</em></h2><p>Explora marcas, encuentra tu estilo y arma tu selección. Consulta precios y disponibilidad directamente por WhatsApp.</p>';
 const oldToolbar=$('.catalog-toolbar',section);if(oldToolbar)oldToolbar.remove();
 const oldTools=$('.catalog-tools',section);if(oldTools)oldTools.remove();
 const oldEmpty=$('.catalog-empty',section);if(oldEmpty)oldEmpty.remove();
 const oldDisclaimer=$('.catalog-disclaimer',section);if(oldDisclaimer)oldDisclaimer.remove();
 // Mantener una sola fuente de productos, dejando los elementos de la versión anterior fuera del DOM.
 grid.innerHTML='';grid.className='hf-product-grid';
 root.innerHTML='<div class="hf-catalog-top"><div><p class="eyebrow">SELECCIÓN HEADS FIT</p><h2 id="hf-catalog-heading">TODO PARA TU PRÓXIMO NIVEL.</h2><p class="hf-catalog-caption">Elige tu favorito y consúltanos los detalles.</p></div><div class="hf-catalog-count" aria-live="polite"></div></div>'+
 '<div class="hf-filter-panel"><label class="hf-search"><span>⌕</span><input type="search" placeholder="Buscar productos, marcas y categorías..." aria-label="Buscar productos" id="hf-search" autocomplete="off"></label>'+
 '<label class="hf-select-label">MARCA <select id="hf-brand" aria-label="Filtrar por marca"><option value="">TODAS LAS MARCAS</option></select></label>'+
 '<label class="hf-select-label">ORDENAR <select id="hf-sort" aria-label="Ordenar productos"><option value="default">DESTACADOS</option><option value="name">NOMBRE A–Z</option><option value="brand">MARCA A–Z</option></select></label></div>'+
 '<div class="hf-filters-row"><div class="hf-chips" role="group" aria-label="Filtrar categorías"></div><button class="hf-clear" type="button">LIMPIAR FILTROS ↺</button></div>'+
 '<div class="hf-selection-label" aria-live="polite"></div>'+
 '<div class="hf-no-results" hidden><h3>NO ENCONTRAMOS ESE PRODUCTO.</h3><p>Prueba otra búsqueda o explora toda la selección.</p><button class="hf-reset" type="button">VER TODOS LOS ARTÍCULOS ↗</button></div>';
 section.insertBefore(root,grid);
 const typeSet=products.filter(p=>catType==='todos'||p.tipo===catType);
 const brand=$('#hf-brand',root),sort=$('#hf-sort',root),input=$('#hf-search',root),chips=$('.hf-chips',root);
 const categories=[...new Set(typeSet.map(p=>p.categoria))].sort((a,b)=>a.localeCompare(b,'es'));
 chips.innerHTML='<button class="hf-chip active" data-cat="" aria-pressed="true">TODOS</button>'+categories.map(c=>'<button class="hf-chip" data-cat="'+safe(c)+'" aria-pressed="false">'+safe(categoryLabels[c]||c)+'</button>').join('');
 const brands=[...new Set(typeSet.map(p=>p.marca))].sort((a,b)=>a.localeCompare(b,'es'));
 brand.insertAdjacentHTML('beforeend',brands.map(b=>'<option value="'+safe(b)+'">'+safe(b)+'</option>').join(''));
 const fromQuery=normalBrand(query.get('marca')||'');
 if(brands.includes(fromQuery))brand.value=fromQuery;
 let selectedCategory='',selectedBrand=brand.value,term='',order='default';
 const heading=$('#hf-catalog-heading',root);
 if(selectedBrand){heading.textContent=selectedBrand+' · DESCUBRE SU COLECCIÓN';document.title=selectedBrand+' — HEADS FIT';}
 function apply(){
   const matched=typeSet.filter(p=>(!selectedBrand||clean(p.marca)===clean(selectedBrand))&&(!selectedCategory||p.categoria===selectedCategory)&&(!term||clean(p.nombre+' '+p.marca+' '+p.categoria+' '+p.descripcion).includes(term)));
   if(order==='name')matched.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
   else if(order==='brand')matched.sort((a,b)=>a.marca.localeCompare(b.marca,'es')||a.nombre.localeCompare(b.nombre,'es'));
   grid.innerHTML=matched.map(card).join('');
   $('.hf-catalog-count',root).textContent=matched.length+' '+(matched.length===1?'ARTÍCULO':'ARTÍCULOS');
   $('.hf-selection-label',root).textContent=(selectedBrand?selectedBrand.toUpperCase()+' · ':'')+' '+(selectedCategory?categoryLabels[selectedCategory]||selectedCategory:'TODAS LAS CATEGORÍAS');
   $('.hf-no-results',root).hidden=matched.length!==0;
   $$('.hf-chip',root).forEach(b=>{const active=b.dataset.cat===selectedCategory;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
   // La URL de marca puede copiarse y compartirse.
   if(page==='catalogo.html'){
     const u=new URL(location.href);if(selectedBrand)u.searchParams.set('marca',selectedBrand);else u.searchParams.delete('marca');
     history.replaceState(null,'',u.pathname+u.search+u.hash);
   }
 }
 function reset(){selectedCategory='';selectedBrand='';term='';order='default';brand.value='';input.value='';sort.value='default';heading.textContent='TODO PARA TU PRÓXIMO NIVEL.';document.title=page==='catalogo.html'?'Catálogo — HEADS FIT':document.title;apply();}
 input.addEventListener('input',()=>{term=clean(input.value);apply()});
 brand.addEventListener('change',()=>{selectedBrand=brand.value;heading.textContent=selectedBrand?selectedBrand+' · DESCUBRE SU COLECCIÓN':'TODO PARA TU PRÓXIMO NIVEL.';apply()});
 sort.addEventListener('change',()=>{order=sort.value;apply()});
 chips.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(b){selectedCategory=b.dataset.cat;apply()}});
 $('.hf-clear',root).addEventListener('click',reset);
 $('.hf-reset',root).addEventListener('click',reset);
 apply();
}

function homeEnhance(){
 if(page!=='index.html')return;
 const links=$('.brand-logos');if(links){
 links.innerHTML=['GYMSHARK','YoungLA','NIKE','ADIDAS','OPTIMUM NUTRITION'].map(b=>'<a href="catalogo.html?marca='+encodeURIComponent(b)+'" aria-label="Ver productos de '+safe(b)+'">'+safe(b)+' <span>↗</span></a>').join('');
 }
 const banner=$('.discovery-links');if(banner&&!$('a[href="catalogo.html"]',banner))banner.insertAdjacentHTML('afterbegin','<a href="catalogo.html">00 / VER TODO EL CATÁLOGO <span>↗</span></a>');
 const section=$('#categories');if(section){
 const ribbon=document.createElement('div');ribbon.className='hf-feature-ribbon';
 ribbon.innerHTML='<p>SELECCIÓN PARA CADA ESTILO</p><strong>ENTRENA A TU MANERA. <span>VISTE TU ACTITUD.</span></strong><a href="catalogo.html">DESCUBRE TODO EL CATÁLOGO ↗</a>';
 section.insertAdjacentElement('afterend',ribbon);
 }
 const circle=$('.circle-link');if(circle)circle.href='catalogo.html';
 const hero=$('.hero-bottom p');if(hero)hero.innerHTML='Ropa, nutrición y accesorios para tu estilo de vida.<br>Elige lo que te impulsa. Nosotros te ayudamos a encontrarlo.';
}
renderBrands();renderCatalog();homeEnhance();
})();