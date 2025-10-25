document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const prevBtn = document.querySelector('.carousel-btn--left');
  const nextBtn = document.querySelector('.carousel-btn--right');
  const dots = Array.from(document.querySelectorAll('.dot'));
  let currentIndex = 0;

  function update() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
      d.setAttribute('aria-pressed', String(i === currentIndex));
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    update();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    update();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentIndex = Number(dot.dataset.index);
      update();
    });
  });

  // soporte flechas teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // Iniciar
  update();
});