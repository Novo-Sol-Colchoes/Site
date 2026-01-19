(function () {
  const els = document.querySelectorAll(".reveal");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target); // anima uma vez e pronto
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px", // aparece um pouco antes de entrar totalmente
    }
  );

  els.forEach((el) => io.observe(el));
})();

// MVV Slider (texto) - auto + setas + dots
(function () {
  const track = document.querySelector(".mvv-track");
  const slides = Array.from(document.querySelectorAll(".mvv-slide"));
  const prev = document.querySelector(".mvv-btn.prev");
  const next = document.querySelector(".mvv-btn.next");
  const dots = Array.from(document.querySelectorAll(".mvv .dot"));

  if (!track || slides.length === 0) return;

  let index = 0;
  const total = slides.length;
  const intervalMs = 4500;
  let timer = null;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i) {
    index = (i + total) % total;
    update();
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(() => goTo(index + 1), intervalMs);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  prev.addEventListener("click", () => { goTo(index - 1); startAuto(); });
  next.addEventListener("click", () => { goTo(index + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { goTo(i); startAuto(); });
  });

  const box = document.querySelector(".mvv");
  box.addEventListener("mouseenter", stopAuto);
  box.addEventListener("mouseleave", startAuto);

  update();
  startAuto();
})();