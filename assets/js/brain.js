document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".brain-card-animation");
  if (!container) return;

  const paths = container.querySelectorAll(".brain-path");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      paths.forEach((path) => {
        // Reinicia la animación
        path.classList.remove("drawn"); // Quita estado anterior si existe
        path.style.animation = "none";  // Detiene animaciones previas
        path.offsetHeight;              // Fuerza reflow
        path.style.animation = `
          drawBrain 4s ease-out forwards,
          complexPulse 6s infinite,
          colorFlow 10s infinite linear
        `;
      });
    });
  }, {
    threshold: 0.6,
  });

  observer.observe(container);

  // Asegura que la clase "drawn" se aplique al final de drawBrain
  paths.forEach((path) => {
    path.addEventListener("animationend", (e) => {
      if (e.animationName === "drawBrain") {
        path.classList.add("drawn");
      }
    });
  });
});
