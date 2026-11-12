/* HEADS FIT · catálogo V3 sin backend · pedido consultivo por WhatsApp */
(() => {
'use strict';
const PHONE='593983551261', KEY='heads-fit-pedido-v2';
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
const PLACEHOLDER='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750"><rect width="600" height="750" fill="#e4e7df"/><rect x="70" y="290" width="460" height="170" rx="10" fill="#d8ded1"/><text x="300" y="353" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" font-weight="700" fill="#4d584a">IMAGEN NO DISPONIBLE</text><text x="300" y="391" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#6c7566">Consultar referencia oficial</text></svg>');
function imgFail(e){const im=e.target;if(!im.matches('img[data-fallback]')||im.dataset.failed)return;im.dataset.failed='1';im.src=PLACEHOLDER;im.alt='Imagen de producto temporalmente no disponible';}
document.addEventListener('error',imgFail,true);

const brandNames=[...new Set(products.map(p=>p.marca))];
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
const chooser=makeDialog('hf-choose',
 '<div class="hf-sheet-handle" aria-hidden="true"></div>'+
 '<button class="hf-choose-close" type="button" aria-label="Cerrar selector">×</button>'+
 '<div class="hf-sheet-top"><p>HEADS FIT / TU SELECCIÓN</p><h2>ELIGE TU PRODUCTO</h2></div>'+
 '<div class="hf-sheet-product"><img class="hf-sheet-image" alt="" data-fallback="1"><div><p class="hf-sheet-brand"></p><h3 id="hf-choose-title"></h3><span>Precio y disponibilidad por confirmar</span></div></div>'+
 '<div class="hf-sheet-body">'+
 '<div class="hf-sheet-group"><div class="hf-sheet-label"><strong class="hf-sheet-color-label">COLOR</strong><span class="hf-sheet-current-color"></span></div><div class="hf-sheet-swatches" role="group" aria-label="Elegir color"></div></div>'+
 '<div class="hf-sheet-group"><div class="hf-sheet-label"><strong class="hf-sheet-size-label">TALLA</strong><span class="hf-sheet-size-hint" aria-live="polite">Elige una opción</span></div><div class="hf-sheet-sizes" role="group" aria-label="Elegir talla"></div></div>'+
 '<div class="hf-sheet-group hf-sheet-qty-group"><div class="hf-sheet-label"><strong>CANTIDAD</strong></div><div class="hf-sheet-quantity"><button type="button" data-sheet-qty="-1" aria-label="Reducir cantidad">−</button><output class="hf-sheet-qty-value">1</output><button type="button" data-sheet-qty="1" aria-label="Aumentar cantidad">+</button></div></div>'+
 '</div>'+
 '<div class="hf-sheet-sticky"><button class="hf-confirm" type="button" disabled>ELIGE UNA TALLA PARA CONTINUAR</button><p class="hf-help" role="status">Confirmaremos las opciones y el precio por WhatsApp.</p></div>');
let chosen={index:0,size:'',qty:1};
const quick=makeDialog('hf-quick','<button type="button" class="hf-quick-close" aria-label="Cerrar detalle">×</button><div class="hf-quick-layout"><div class="hf-quick-image"></div><div class="hf-quick-body"><p class="hf-small hf-quick-brand"></p><h2 class="hf-quick-title"></h2><p class="hf-quick-desc"></p><div class="hf-quick-info"><span>DETALLES</span><p class="hf-quick-features"></p></div><div class="hf-quick-info"><span>IMPORTANTE</span><p class="hf-quick-advice"></p></div><button type="button" class="hf-quick-add">AÑADIR A MI BOLSA ↗</button><p class="hf-quick-notice">Catálogo orientativo: precios y existencias se confirman por WhatsApp. Las imágenes pueden ser ilustrativas.</p><a class="hf-original-source" target="_blank" rel="noopener noreferrer" hidden>VER REFERENCIA DEL PRODUCTO ↗</a></div></div>');
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
function choose(p,variant=0){
 if(!p)return;
 active=p;close(quick);
 const variants=p.variantes?.length?p.variantes:[{nombre:'Por confirmar',hex:'#888',imagen:p.imagen}];
 const sizes=p.tallas?.length?p.tallas:['Por confirmar'];
 chosen={index:Math.max(0,Math.min(variants.length-1,variant)),size:'',qty:1};
 $('#hf-choose-title',chooser).textContent=p.nombre;
 $('.hf-sheet-brand',chooser).textContent=p.marca;
 $('.hf-sheet-color-label',chooser).textContent=p.tipo==='suplementos'?'SABOR':'COLOR';
 $('.hf-sheet-size-label',chooser).textContent=p.tipo==='ropa'?'TALLA':p.tipo==='suplementos'?'PRESENTACIÓN':'TAMAÑO / PRESENTACIÓN';
 $('.hf-sheet-sizes',chooser).innerHTML=sizes.map(v=>'<button type="button" class="hf-sheet-size" data-sheet-size="'+safe(v)+'" aria-pressed="false">'+safe(v.replace(' / consultar',''))+'</button>').join('');
 $('.hf-sheet-swatches',chooser).innerHTML=variants.map((v,i)=>'<button type="button" class="hf-sheet-swatch'+(i===chosen.index?' selected':'')+'" data-sheet-color="'+i+'" aria-pressed="'+(i===chosen.index?'true':'false')+'" aria-label="Color o sabor: '+safe(v.nombre)+'" title="'+safe(v.nombre)+'"><i style="background:'+safe(v.hex||'#999')+'"></i></button>').join('');
 $('.hf-sheet-qty-value',chooser).textContent='1';
 $('.hf-sheet-size-hint',chooser).textContent='Selecciona tu opción';
 $('.hf-help',chooser).textContent='Confirmaremos opciones, precio y disponibilidad por WhatsApp.';
 updateSheet();
 open(chooser);
}
function updateSheet(){
 if(!active)return;
 const variants=active.variantes?.length?active.variantes:[{nombre:'Por confirmar',imagen:active.imagen}];
 const v=variants[chosen.index]||variants[0];
 const photo=$('.hf-sheet-image',chooser);
 photo.src=v.imagen||active.imagen||PLACEHOLDER;
 photo.alt=active.nombre+' · '+v.nombre;
 delete photo.dataset.failed;
 $('.hf-sheet-current-color',chooser).textContent=v.nombre;
 $$('.hf-sheet-swatch',chooser).forEach((btn,i)=>{const yes=i===chosen.index;btn.classList.toggle('selected',yes);btn.setAttribute('aria-pressed',String(yes));});
 $$('.hf-sheet-size',chooser).forEach(btn=>{const yes=btn.dataset.sheetSize===chosen.size;btn.classList.toggle('selected',yes);btn.setAttribute('aria-pressed',String(yes));});
 const button=$('.hf-confirm',chooser);
 button.disabled=!chosen.size;
 button.textContent=chosen.size?'AÑADIR '+chosen.qty+' A MI BOLSA ↗':'ELIGE UNA OPCIÓN PARA CONTINUAR';
 $('.hf-sheet-size-hint',chooser).textContent=chosen.size?'Elegiste: '+chosen.size:'Selecciona tu opción';
 $('.hf-sheet-qty-value',chooser).textContent=String(chosen.qty);
}
function show(p,variantIndex=0){
 if(!p)return;active=p;
 $('.hf-quick-brand',quick).textContent=p.marca+' / '+(categoryLabels[p.categoria]||p.categoria);
 $('.hf-quick-title',quick).textContent=p.nombre;
 $('.hf-quick-desc',quick).textContent=p.descripcion||'Descubre los detalles de este producto.';
 $('.hf-quick-features',quick).textContent=[p.ajuste&&('Ajuste: '+p.ajuste),p.material&&('Material: '+p.material)].filter(Boolean).join(' · ')||'Consultar ficha original del producto.';
 $('.hf-quick-advice',quick).textContent=p.uso||'Consulta tallas, ingredientes y disponibilidad.';
 const origin=$('.hf-original-source',quick); if(origin){const official=p.fuente && /^https:\/\//.test(p.fuente);origin.hidden=!official;if(official)origin.href=p.fuente;else origin.removeAttribute('href');}
 const variantImage=p.variantes?.[variantIndex]?.imagen||p.imagen;
 $('.hf-quick-image',quick).innerHTML='<img alt="'+safe(p.nombre)+'" src="'+safe(variantImage||PLACEHOLDER)+'" data-fallback="1" loading="lazy">';
 open(quick);
}
const byId=id=>products.find(p=>p.id===id);
document.addEventListener('click',e=>{
 const t=e.target;
 const sheetColor=t.closest('[data-sheet-color]');
 if(sheetColor&&chooser.open){
   chosen.index=Number(sheetColor.dataset.sheetColor);
   updateSheet();
   return;
 }
 const sheetSize=t.closest('[data-sheet-size]');
 if(sheetSize&&chooser.open){
   chosen.size=sheetSize.dataset.sheetSize;
   updateSheet();
   return;
 }
 const sheetQty=t.closest('[data-sheet-qty]');
 if(sheetQty&&chooser.open){
   chosen.qty=Math.min(99,Math.max(1,chosen.qty+Number(sheetQty.dataset.sheetQty)));
   updateSheet();
   return;
 }
 const swatch=t.closest('[data-swatch-index]');
 if(swatch){
   const card=swatch.closest('.hf-product'),p=card&&byId(card.dataset.productId),index=Number(swatch.dataset.swatchIndex);
   if(!p||!p.variantes||!p.variantes[index])return;
   card.dataset.colorIndex=String(index);
   const caption=$('.hf-variant-name',card);if(caption)caption.textContent=p.variantes[index].nombre;
   const img=$('img.hf-product-photo',card),item=p.variantes[index];
   if(img){img.src=item.imagen||p.imagen;img.alt=p.nombre+' · '+item.nombre;delete img.dataset.failed;}
   $$('.hf-swatch',card).forEach((b,i)=>{b.classList.toggle('selected',i===index);b.setAttribute('aria-pressed',String(i===index));});
   return;
 }
 const opener=t.closest('[data-overlay-open]');
 if(opener){
   const card=opener.closest('.hf-product');
   if(card){
     if(typeof window.matchMedia==='function'&&window.matchMedia('(hover: none), (pointer: coarse), (max-width: 760px)').matches){
       choose(byId(card.dataset.productId),Number(card.dataset.colorIndex||0));
       return;
     }
     const opened=!card.classList.contains('is-open');
     $$('.hf-product.is-open').filter(x=>x!==card).forEach(x=>{x.classList.remove('is-open');$('.hf-photo-open',x)?.setAttribute('aria-expanded','false');});
     card.classList.toggle('is-open',opened);
     opener.setAttribute('aria-expanded',String(opened));
   }
   return;
 }
 const closeQuick=t.closest('[data-close-overlay]');
 if(closeQuick){const card=closeQuick.closest('.hf-product');card?.classList.remove('is-open');$('.hf-photo-open',card)?.setAttribute('aria-expanded','false');return;}
 const qChange=t.closest('[data-quick-qty]');
 if(qChange){const card=qChange.closest('.hf-product'),display=$('.hf-quick-qty-value',card);if(card&&display){const q=Math.max(1,Math.min(99,Number(card.dataset.quantity||'1')+Number(qChange.dataset.quickQty)));card.dataset.quantity=String(q);display.textContent=String(q);}return;}
 const quickSize=t.closest('[data-quick-size]');
 if(quickSize){const card=quickSize.closest('.hf-product'),p=card&&byId(card.dataset.productId);if(!p)return;const variant=p.variantes?.[Number(card.dataset.colorIndex||0)]||p.variantes?.[0];const qty=Math.max(1,Math.min(99,Number(card.dataset.quantity||'1')));add(p,quickSize.dataset.quickSize,variant?.nombre||'Por confirmar',qty);return;}
 if(t.closest('#hf-open-cart')){renderCart();open(drawer)}
 if(t.closest('.hf-close'))close(drawer);
 if(t.closest('.hf-choose-close'))close(chooser);
 if(t.closest('.hf-quick-close'))close(quick);
 const addBtn=t.closest('[data-buy]');if(addBtn){choose(byId(addBtn.dataset.buy));return;}
 const detailBtn=t.closest('[data-detail]');if(detailBtn){const card=detailBtn.closest('.hf-product');show(byId(detailBtn.dataset.detail),Number(card?.dataset.colorIndex||0));return;}
 if(t.closest('.hf-quick-add'))choose(active);
 if(t.closest('.hf-confirm')&&active&&chooser.open){
   if(!chosen.size)return;
   const variant=active.variantes?.[chosen.index]?.nombre||'Por confirmar';
   add(active,chosen.size,variant,chosen.qty);
   return;
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
 const img=safe(p.imagen||PLACEHOLDER),title=safe(p.nombre),id=safe(p.id);
 const variants=(p.variantes&&p.variantes.length?p.variantes:[{nombre:'Por confirmar',hex:'#8c8e8a',imagen:p.imagen}]);
 const swatches=variants.map((v,k)=>'<button type="button" class="hf-swatch'+(k===0?' selected':'')+'" style="--swatch:'+safe(v.hex||'#999')+'" data-swatch-index="'+k+'" aria-pressed="'+(k===0?'true':'false')+'" aria-label="Color o sabor '+safe(v.nombre)+'" title="'+safe(v.nombre)+'"><span></span></button>').join('');
 const sizes=(p.tallas&&p.tallas.length?p.tallas:['Por confirmar']).map(t=>'<button type="button" class="hf-size-button" data-quick-size="'+safe(t)+'" title="Añadir '+title+' en talla o presentación '+safe(t)+'">'+safe(t.replace(' / consultar',''))+'</button>').join('');
 const kind=p.tipo==='ropa'?'TALLA':p.tipo==='suplementos'?'PRESENTACIÓN':'TAMAÑO / PRESENTACIÓN';
 const colKind=p.tipo==='suplementos'?'SABOR':'COLOR';
 return '<article class="hf-product hf-compact" data-product-id="'+id+'" data-color-index="0" data-quantity="1" style="--stagger:'+Math.min(i%12,11)+'">'+
 '<div class="hf-product-media"><img class="hf-product-photo" src="'+img+'" alt="'+title+'" data-fallback="1" loading="lazy" decoding="async">'+
 '<span class="hf-tag">'+safe(p.etiqueta||'COLECCIÓN')+'</span>'+
 '<button type="button" class="hf-photo-open" data-overlay-open aria-expanded="false" aria-label="Elegir opciones para '+title+'"><span>PERSONALIZAR</span><b>+</b></button>'+
 '<div class="hf-quick-panel"><div class="hf-quick-panel-header"><strong>ELIGE TU OPCIÓN</strong><button type="button" data-close-overlay aria-label="Cerrar opciones">×</button></div>'+
 '<div class="hf-quick-line"><span>'+colKind+'</span><span class="hf-quick-note">Según consulta</span></div>'+
 '<div class="hf-swatches">'+swatches+'<small class="hf-variant-name">'+safe(variants[0].nombre)+'</small></div>'+
 '<div class="hf-quick-footer"><span>CANTIDAD</span><div class="hf-quantity"><button type="button" data-quick-qty="-1" aria-label="Menos unidades">−</button><output class="hf-quick-qty-value">1</output><button type="button" data-quick-qty="1" aria-label="Más unidades">+</button></div></div>'+
 '<div class="hf-quick-line"><span>'+kind+'</span><span class="hf-quick-note">Toca para añadir</span></div>'+
 '<div class="hf-size-list">'+sizes+'</div>'+
 '</div></div><div class="hf-product-bottom"><span class="hf-product-brand">'+safe(p.marca)+'</span>'+
 '<h3>'+title+'</h3><button type="button" class="hf-detail-link" data-detail="'+id+'">VER DETALLES <span aria-hidden="true">↗</span></button></div></article>';
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
 root.innerHTML=info.filter(b=>countBy(b[0])).map((b,i)=>'<a class="hf-brand-card" href="catalogo.html?marca='+encodeURIComponent(b[0])+'" style="--stagger:'+i+';--brand-bg:url(\''+safe((products.find(p=>p.marca===b[0])||{}).imagen||PLACEHOLDER)+'\')"><span class="hf-brand-index">'+String(i+1).padStart(2,'0')+' / '+safe(b[2])+'</span><div class="hf-brand-main"><h3>'+safe(b[0])+'</h3><p>'+safe(b[1])+'</p></div><div class="hf-brand-bottom"><span>'+countBy(b[0])+' ARTÍCULOS</span><b>EXPLORAR COLECCIÓN ↗</b></div></a>').join('');
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