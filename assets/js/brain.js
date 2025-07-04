document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".brain-card-animation");
  if (!container) return;

  const paths = container.querySelectorAll(".brain-path");

  // Función para reiniciar animaciones en todos los trazos
  function restartBrainAnimation() {
    paths.forEach((path) => {
      path.classList.remove("drawn");
      path.style.animation = "none";
      path.offsetHeight; // Forzar reflow
      path.style.animation = `
        drawBrain 4s ease-out forwards,
        complexPulse 6s infinite,
        colorFlow 10s infinite linear
      `;
    });
  }

  // Observador de intersección para disparar la primera vez
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        restartBrainAnimation();
      }
    });
  }, {
    threshold: 0.6,
  });

  observer.observe(container);

  // Marcar los paths como "dibujados" al terminar drawBrain
  paths.forEach((path) => {
    path.addEventListener("animationend", (e) => {
      if (e.animationName === "drawBrain") {
        path.classList.add("drawn");
      }
    });
  });

  // ⚡ Reconstrucción automática cada 15 segundos
  setInterval(() => {
    restartBrainAnimation();
  }, 15000); // 15000 ms = 15 segundos
});
