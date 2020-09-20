const nav = document.querySelector('nav');
const header = document.getElementById('header');
const japLogo = document.querySelector('.logo-jap');
const illuInit = 5;

// ajustar el estilo del navbar
function updateNavStyle(){
  nav.classList.toggle('transparent', window.scrollY < 1);
}
updateNavStyle(); // para asegurarse cuando se hace reload (ya que no depende del evento scroll)

// reacciona al scroll
window.addEventListener('scroll', function(){
  updateNavStyle();

  // movimiento de la ilustración y opacidad de logos ceibal-jap
  const scrolled = parseInt(window.scrollY) / 3;
  const actualY = `-${illuInit + scrolled / 16}em`;
  header.style.setProperty('--illu-offset', actualY);
  japLogo.style.opacity = (100 - Math.abs(scrolled)) / 100;
})
