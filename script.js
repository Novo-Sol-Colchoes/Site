/* =============================================================================
   script.js (GLOBAL) — NOVO SOL COLCHÕES
   -----------------------------------------------------------------------------
   Este arquivo controla:
   1) Reveal ao rolar (IntersectionObserver)
      - Elementos com class="reveal" entram com animação
      - O CSS faz o efeito (opacity/translate), o JS só adiciona "is-visible"

   2) MVV Slider (Missão / Visão / Valores)
      - Troca automática (autoplay)
      - Setas (anterior/próximo)
      - Dots (bolinhas)
      - Pausa ao passar o mouse (desktop)

   Importante:
   - Este JS é "vanilla" (sem biblioteca externa)
   - Não precisa alterar para funcionar no GitHub Pages
   ============================================================================ */


/* =============================================================================
   1) SCROLL REVEAL — animação ao descer a página
   -----------------------------------------------------------------------------
   Como funciona:
   - Pega todos os elementos com .reveal
   - Observa quando entram na tela (IntersectionObserver)
   - Quando entra, adiciona .is-visible e para de observar (anima só 1x)

   Ajustes que você pode fazer com segurança:
   - threshold: quanta parte precisa aparecer para disparar
   - rootMargin: adianta/atrasa o disparo antes de aparecer totalmente
   ============================================================================ */
(function () {
  /* Seleciona todos os elementos que devem “entrar” ao rolar */
  const els = document.querySelectorAll(".reveal");

  /* Cria o observer que detecta quando o elemento entra na área visível */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        /* isIntersecting = está aparecendo na tela */
        if (entry.isIntersecting) {
          /* Adiciona a classe que “liga” a animação (via CSS) */
          entry.target.classList.add("is-visible");

          /* Para de observar este elemento após animar (anima uma vez) */
          io.unobserve(entry.target);
        }
      });
    },
    {
      /* threshold 0.12 = dispara quando ~12% do elemento aparece */
      threshold: 0.12,

      /* rootMargin:
         "0px 0px -10% 0px" reduz o “fundo” da área observada,
         fazendo a animação acontecer um pouco antes de o elemento estar 100% visível */
      rootMargin: "0px 0px -10% 0px",
    }
  );

  /* Aplica a observação para cada elemento .reveal */
  els.forEach((el) => io.observe(el));
})();


/* =============================================================================
   2) MVV SLIDER (texto) — auto + setas + dots
   -----------------------------------------------------------------------------
   HTML esperado (classes):
   - .mvv          = container geral do MVV
   - .mvv-track    = faixa que desliza (display:flex no CSS)
   - .mvv-slide    = cada slide (min-width:100%)
   - .mvv-btn.prev = seta anterior
   - .mvv-btn.next = seta próxima
   - .mvv .dot     = bolinhas (3, uma por slide)

   Comportamentos:
   - Autoplay a cada 4500ms (intervalMs)
   - Ao clicar em seta/dot, reinicia o autoplay (boa UX)
   - Pausa no hover do mouse (mouseenter) e volta no mouseleave

   Ajustes que você pode fazer com segurança:
   - intervalMs: tempo de troca automática (ex: 6000 = 6s)
   ============================================================================ */
(function () {
  /* Pega os elementos principais do MVV */
  const track = document.querySelector(".mvv-track");
  const slides = Array.from(document.querySelectorAll(".mvv-slide"));
  const prev = document.querySelector(".mvv-btn.prev");
  const next = document.querySelector(".mvv-btn.next");
  const dots = Array.from(document.querySelectorAll(".mvv .dot"));

  /* Segurança:
     Se não existir MVV na página (ex: contato.html / produtos.html),
     o script simplesmente sai sem erro. */
  if (!track || slides.length === 0) return;

  /* Estado do slider */
  let index = 0;                /* slide atual (0, 1, 2...) */
  const total = slides.length;  /* quantidade de slides */
  const intervalMs = 4500;      /* tempo do autoplay (ms) */
  let timer = null;             /* guarda o setInterval para poder parar */

  /* Atualiza a posição do track e as bolinhas (dots) */
  function update() {
    /* Move o track horizontalmente:
       - index * 100% desloca 1 tela por slide
       - exemplo: index=1 => -100% (vai para o segundo slide) */
    track.style.transform = `translateX(-${index * 100}%)`;

    /* Atualiza a classe ativa das bolinhas */
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  /* Vai para um slide específico (com “loop”)
     - (i + total) % total garante que nunca fique negativo
     - Ex: ir para -1 vira o último slide */
  function goTo(i) {
    index = (i + total) % total;
    update();
  }

  /* Inicia o autoplay (troca automática) */
  function startAuto() {
    stopAuto(); /* evita múltiplos timers ao mesmo tempo */
    timer = setInterval(() => goTo(index + 1), intervalMs);
  }

  /* Para o autoplay */
  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  /* Eventos das setas:
     - muda slide
     - reinicia autoplay (boa UX: usuário interage e a rotação continua) */
  prev.addEventListener("click", () => { goTo(index - 1); startAuto(); });
  next.addEventListener("click", () => { goTo(index + 1); startAuto(); });

  /* Eventos das bolinhas (dots) */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { goTo(i); startAuto(); });
  });

  /* Pausa ao passar o mouse no MVV (desktop)
     Obs: em mobile não existe hover real, então não atrapalha. */
  const box = document.querySelector(".mvv");
  box.addEventListener("mouseenter", stopAuto);
  box.addEventListener("mouseleave", startAuto);

  /* Inicialização:
     - garante que começa no slide 0 com dot correto
     - inicia autoplay */
  update();
  startAuto();
})();