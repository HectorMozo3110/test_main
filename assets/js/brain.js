document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".brain-card-animation");
  if (!container) return;

  const paths = container.querySelectorAll(".brain-path");

  // Reinicio completo: oculta y vuelve a animar
  function restartBrainAnimation() {
    paths.forEach((path) => {
      path.classList.remove("drawn");

      // 🔁 Paso 1: ocultar trazo instantáneamente
      path.style.transition = "none";
      path.style.strokeDasharray = "1000";
      path.style.strokeDashoffset = "1000";
      path.style.animation = "none";

      // 🔁 Paso 2: esperar un frame y volver a animar
      requestAnimationFrame(() => {
        path.offsetHeight; // Forzar reflow
        path.style.animation = `
          drawBrain 4s ease-out forwards,
          complexPulse 6s infinite,
          colorFlow 10s infinite linear
        `;
      });
    });
  }

  // Activación por scroll (solo una vez)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        restartBrainAnimation();
      }
    });
  }, { threshold: 0.6 });

  observer.observe(container);

  // Añadir la clase "drawn" al final de la animación principal
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
  }, 15000);
});
