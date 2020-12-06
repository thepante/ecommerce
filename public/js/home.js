const japLogo = document.querySelector('.logo-jap');
const illuInit = 5;

// reacciona al scroll
window.addEventListener('scroll', function(){
  updateNavStyle();

  // movimiento de la ilustración y opacidad de logos ceibal-jap
  const scrolled = window.scrollY / 3;
  if (scrolled < 160) {
    const actualY = `-${illuInit + scrolled / 16}em`;
    header.style.setProperty('--illu-offset', actualY);
    japLogo.style.opacity = (100 - Math.abs(scrolled)) / 100;
  }
})
