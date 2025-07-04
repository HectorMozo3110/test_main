document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".brain-card-animation");
  if (!container) return;

  const paths = container.querySelectorAll(".brain-path");

  // Verifica si el cerebro necesita reinicio (en caso de fallo CSS)
  function restartBrainAnimation(force = false) {
    paths.forEach((path) => {
      const computedOffset = parseFloat(getComputedStyle(path).strokeDashoffset);
      
      // Solo reiniciar si:
      // - el stroke no está en 0
      // - o se forza manualmente
      if (force || computedOffset > 10) {
        path.classList.remove("drawn");
        path.style.transition = "none";
        path.style.strokeDasharray = "1000";
        path.style.strokeDashoffset = "1000";
        path.style.animation = "none";

        requestAnimationFrame(() => {
          path.offsetHeight; // reflow
          path.style.animation = `
            infiniteDraw 14s linear infinite,
            complexPulse 6s infinite,
            colorFlow 10s infinite linear
          `;
        });
      }
    });
  }

  // 🧠 Observador por si entra a pantalla (útil en modo mobile o tabs)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        restartBrainAnimation();
      }
    });
  }, { threshold: 0.6 });

  observer.observe(container);

  // 💤 Si el usuario vuelve a la pestaña
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      restartBrainAnimation();
    }
  });

  // 🕒 Refuerzo cada 30s solo si algo se desincroniza
  setInterval(() => {
    restartBrainAnimation();
  }, 30000); // cada 30 segundos, solo si lo necesita
});
