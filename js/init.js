const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

const userData = (localStorage.getItem("Logged-User")) ? JSON.parse(localStorage.getItem("Logged-User")) : undefined;

// elementos y dato para los efectos relacionados al scroll
const navElement = document.querySelector('nav');
const pageHeader = document.querySelector('#header:not(.home)');
const header = document.getElementById('header');
const headerHeight = header ? (100 + header.offsetHeight / 4) : 0;

// ajusta el estilo del navbar
function updateNavStyle(){ navElement.classList.toggle('transparent', window.scrollY < 1); }
if (navElement) updateNavStyle();

// reacciona al scroll
window.addEventListener('scroll', function(){
  if (window.scrollY < 160) {
    if (navElement) updateNavStyle();
    if (pageHeader) pageHeader.style.opacity = (headerHeight - Math.abs(window.scrollY)) / 100;
  }
});

// spinner
var showSpinner = function(){ document.getElementById("spinner-wrapper").style.display = "block"; }
var hideSpinner = function(){ document.getElementById("spinner-wrapper").style.display = "none"; }

var getJSONData = function(url){
  var result = {};
  showSpinner();
  return fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    }else{
      throw Error(response.statusText);
    }
  })
  .then(function(response) {
    result.status = 'ok';
    result.data = response;
    hideSpinner();
    return result;
  })
  .catch(function(error) {
    result.status = 'error';
    result.data = error;
    hideSpinner();
    return result;
  });
}


// Muestra la barra de navegación
// Aplica en todas las páginas excepto en el index (que es el login)
const showNavBar = async () => {

  if (document.title.includes('Login')) return;

  // Declaro la sección del usuario, varía en si está logueado o no
  const userMenuHtml = (userData) ?
    `
      <a class="nav-link dropdown-toggle" href="#" id="userMenu" data-toggle="dropdown" aria-expanded="false">
        <img src="${userData.picture}" />
        ${(userData.username.length > 28)
          ? '<span title="'+userData.username+'">' + userData.username.slice(0, 25) + '...</span>'
          : userData.username
        }
      </a>
      <div class="dropdown-menu" aria-labelledby="userMenu">
      <a class="dropdown-item" href="cart.html">Ver Carrito</a>
        <a class="dropdown-item" href="my-profile.html">Ver mi perfil</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="./index.html?logout">Cerrar sesión</a>
      </div>
    `
    :
      `
      <a class="nav-link" href="index.html?from=${window.location.pathname}" id="userMenu" aria-expanded="false">
        Ingresar <i class="fas fa-sign-in-alt"></i>
      </a>
    `;

  // Estructura de la barra de navegación
  document.querySelector('body > nav').innerHTML += `
    <div class="container">
      <a class="navbar-brand" href="home.html">eMERCADO</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navBar" aria-controls="navBar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navBar">
        <ul class="navbar-nav mr-auto w-100 justify-content-center">
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            ${userMenuHtml}
          </li>
        </ul>
      </div>
    </div>
  `;

  const navLinks = {
    Inicio: "home.html",
    Categorías: "categories.html",
    Productos: "products.html",
    Vender: "sell.html",
  };

  // Agrego los links
  const navList = document.querySelector('#navBar > ul');

  for (const [page, link] of Object.entries(navLinks)) {
    const isThisPage = document.baseURI.includes('/' + link);
    const newLink = `
      <li class="nav-item ${(isThisPage) ? 'active' : ''}">
        <a class="nav-link" href="${link}">${page}</a>
      </li>
    `;
    navList.innerHTML += newLink;
  };
}

// La agrego sin importar si ya cargó todo lo demás o no
// Al llamar el init quiere decir que ya tengo el nav presente
showNavBar();

// formateo de precios
Number.asPrice = Number.prototype.asPrice = function () {
  let num = this;
  if (num % 1 != 0) num = num.toFixed(2).replace('.', ',');
  num = String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.');
  return num;
};

document.addEventListener("DOMContentLoaded", function (e) {
  // Si hay botón 'Volver arriba' agregarle funcionamiento
  const goTopButton = document.getElementById('goTop');
  if (goTopButton) goTopButton.addEventListener('click', () => window.scroll({top:0}));

});
