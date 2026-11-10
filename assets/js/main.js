document.documentElement.classList.remove('no-js');
(() => {
  const loader = document.querySelector('.site-loader');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('done'), 450);
  });

  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Filtros del catálogo: filtran los productos renderizados por PHP.
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    productCards.forEach(card => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible && window.gsap) gsap.fromTo(card, {opacity:0,y:18}, {opacity:1,y:0,duration:.45,ease:'power2.out'});
    });
  }));

  // Animaciones GSAP + ScrollTrigger con alternativa si no carga el CDN.
  const revealFallback = () => document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none';
  });
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    window.addEventListener('load', () => {
      gsap.to('.site-loader', {delay:.55, duration:.4, opacity:0, onComplete:()=>loader?.classList.add('done')});
      gsap.utils.toArray('.hero-content .reveal').forEach((el,i) => {
        gsap.fromTo(el,{y:45,opacity:0},{y:0,opacity:1,duration:1.05,delay:.25+i*.12,ease:'power4.out'});
      });
      gsap.utils.toArray('.reveal').filter(el => !el.closest('.hero-content')).forEach(el => {
        gsap.to(el,{y:0,opacity:1,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
      });
      gsap.utils.toArray('.category-card,.product-card').forEach((el,i) => {
        gsap.fromTo(el,{y:24},{y:0,duration:.65,delay:(i%3)*.07,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
      });
    });
  } else {
    window.addEventListener('load', revealFallback);
    setTimeout(revealFallback, 1200);
  }
})();
