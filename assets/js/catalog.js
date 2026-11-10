// Catálogo estático interactivo — sin backend, base de datos ni dependencias.
(() => {
  const cards = [...document.querySelectorAll('.product-card')];
  if (!cards.length) return;
  const grid = document.querySelector('.product-grid');
  const input = document.querySelector('.catalog-search');
  const sort = document.querySelector('.catalog-sort');
  const count = document.querySelector('.result-count');
  const empty = document.querySelector('.catalog-empty');
  const filters = [...document.querySelectorAll('.filter-btn')];
  const dialog = document.querySelector('.detail-dialog');
  let selected = 'all';
  const normalize = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const update = () => {
    const q = normalize(input?.value.trim());
    let total = 0;
    cards.forEach(card => {
      const text = normalize([card.dataset.name, card.dataset.category, card.dataset.brand, card.dataset.description].join(' '));
      const show = (selected === 'all' || selected === card.dataset.category) && (!q || text.includes(q));
      card.hidden = !show;
      if (show) { total++; card.style.opacity='1'; card.style.transform='none'; }
    });
    if (count) count.textContent = `${total} ${total === 1 ? 'PRODUCTO' : 'PRODUCTOS'}`;
    if (empty) empty.hidden = total > 0;
  };
  filters.forEach(btn => btn.addEventListener('click', () => {
    selected = btn.dataset.filter;
    filters.forEach(b => {b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn));});
    update();
  }));
  input?.addEventListener('input', update);
  sort?.addEventListener('change', () => {
    const mode = sort.value;
    const sorted = [...cards].sort((a,b) => mode === 'default' ? cards.indexOf(a)-cards.indexOf(b) : (a.dataset[mode] || '').localeCompare(b.dataset[mode] || '', 'es'));
    sorted.forEach(card => grid.append(card));
    update();
  });
  // ficha rápida: información general cuidadosamente diferenciada de datos verificados del producto.
  const close = () => dialog?.close();
  const show = card => {
    if (!dialog) return;
    const set = (sel, val) => {const node=dialog.querySelector(sel); if(node) node.textContent=val;};
    set('.detail-brand', `${card.dataset.brand} / ${card.dataset.category}`);
    set('#detail-title',card.dataset.name);
    set('.detail-description',card.dataset.description);
    set('.detail-features',card.dataset.features);
    set('.detail-advice',card.dataset.advice);
    const img = dialog.querySelector('.detail-photo');
    const source = card.querySelector('img');
    if (img && source) {img.src=source.currentSrc || source.src; img.alt=source.alt;}
    if (!dialog.open) dialog.showModal();
  };
  cards.forEach(card => {
    card.querySelector('.product-detail-btn')?.addEventListener('click',()=>show(card));
    const visual=card.querySelector('.product-image');
    visual?.addEventListener('click',()=>show(card));
    visual?.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();show(card);}});
  });
  dialog?.querySelector('.detail-close')?.addEventListener('click',close);
  dialog?.querySelector('.detail-return')?.addEventListener('click',close);
  dialog?.addEventListener('click',event=>{if(event.target===dialog)close();});
  filters.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.classList.contains('active'))));
  update();
})();
