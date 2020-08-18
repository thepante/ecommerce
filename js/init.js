const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

const userData = (localStorage.getItem("Logged-User")) ? JSON.parse(localStorage.getItem("Logged-User")) : undefined;

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

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

// Muestra el nombre del usuario y la imagen de perfil
const showUserMenu = () => {
  const navBar = document.querySelector("body > nav > div");
  if (!navBar) return;

  navBar.innerHTML += `
    <a class="py-2 d-none d-md-inline-block" href="${(userData) ? "#" : "index.html"}" id="userMenu">
      <img src="${(userData) ? userData.picture : './img/user.png'}" />
      ${(userData) ? userData.username : "Login"}
    </a>
  `;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

  // Si hay botón 'Volver arriba' agregarle funcionamiento
  const goTopButton = document.getElementById('goTop');
  if (goTopButton){
    goTopButton.addEventListener('click', () => window.scroll({top:0}));
  }

  showUserMenu();

});