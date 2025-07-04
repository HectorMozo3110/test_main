document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const path = entry.target.querySelector(".brain-path");
      if (entry.isIntersecting && path) {
      
        path.style.animation = "none";
        path.offsetHeight; 
        path.style.animation = "drawBrain 4s ease-out forwards";
      }
    });
  }, {
    threshold: 0.6 
  });

  const container = document.querySelector(".brain-card-animation");
  if (container) observer.observe(container);
});
