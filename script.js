(function(){
  const cfg = window.NOVOSOL || {};
  const qs = (s,c=document)=>c.querySelector(s);
  const qsa = (s,c=document)=>[...c.querySelectorAll(s)];
  const waLink = (msg)=>`https://wa.me/${cfg.whatsapp || '5541999064248'}?text=${encodeURIComponent(msg || cfg.mensagemPadrao || 'Olá! Quero saber mais.')}`;

  qsa('[data-wa]').forEach(a=>{
    const produto=a.dataset.wa;
    a.href=waLink(produto ? `Olá! Vi no site da Novo Sol Colchões e quero saber mais sobre ${produto}.` : cfg.mensagemPadrao);
  });
  qsa('[data-phone]').forEach(a=>a.href=`tel:+${(cfg.whatsapp||'5541999064248').replace(/\D/g,'')}`);
  qsa('[data-email]').forEach(a=>a.href=`mailto:${cfg.email || 'novosolcolchoes@hotmail.com'}`);
  qsa('[data-instagram]').forEach(a=>a.href=cfg.instagram || '#');
  qsa('[data-facebook]').forEach(a=>a.href=cfg.facebook || '#');
  qsa('[data-catalogo]').forEach(a=>a.href=cfg.catalogoDrive || 'assets/Catalogo-Linha-Solaris.pdf');

  const menu=qs('.menu-toggle'), nav=qs('.nav');
  if(menu&&nav){
    menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);});
    qsa('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  }

  const carousel=qs('[data-hero-carousel]');
  if(carousel){
    const slides=qsa('.hero-slide',carousel), dots=qsa('.hero-dot',carousel), color=qs('[data-hero-color]',carousel);
    const prev=qs('.hero-arrow.prev',carousel), next=qs('.hero-arrow.next',carousel);
    let index=0,timer;
    const show=(i)=>{
      index=(i+slides.length)%slides.length;
      slides.forEach((s,n)=>s.classList.toggle('is-active',n===index));
      dots.forEach((d,n)=>d.classList.toggle('is-active',n===index));
      if(color) color.textContent=slides[index].dataset.color || '';
    };
    const stop=()=>{if(timer)clearInterval(timer)};
    const start=()=>{stop();timer=setInterval(()=>show(index+1),4200)};
    prev?.addEventListener('click',()=>{show(index-1);start()});
    next?.addEventListener('click',()=>{show(index+1);start()});
    dots.forEach((d,n)=>d.addEventListener('click',()=>{show(n);start()}));
    carousel.addEventListener('mouseenter',stop);carousel.addEventListener('mouseleave',start);
    show(0);start();
  }

  qsa('.faq-q').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open')));

  const reveals=qsa('.reveal');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});
    reveals.forEach(el=>io.observe(el));
  } else reveals.forEach(el=>el.classList.add('is-visible'));
})();
