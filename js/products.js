const rangeMin = document.getElementById("rangePriceMin");
const rangeMax = document.getElementById("rangePriceMax");
const clearSearch = document.getElementById("clearSearch");
const searchInput = document.getElementById("searchInput");
const clearFilter = document.getElementById("clearFilter");

let productsArray = [];
let sortedArray;

let searchQuery;
let minPrice = 0;
let maxPrice = Infinity;

String.highlight = String.prototype.highlight = function(query) {
  let result = '';
  let scan = true;
  let from = 0;
  let i = 0;

  while (scan) {
    let rest = this.substr(from);
    i = rest.toLowerCase().indexOf(query.toLowerCase());

    if (i == -1) {
      result += rest;
      scan = false;
    } else {
      result += rest.substr(0, i) + `<span class="highlight">${rest.substr(i, query.length)}</span>`;
      from += i + query.length;
    }
  }
  return result;
};

function renderText(content) { return (searchQuery) ? content.highlight(searchQuery) : content;}

function showProductsList(){
  let array = (sortedArray) ? sortedArray : productsArray;
  let htmlContentToAppend = "";

  for (let i = 0, l = array.length; i < l; i++) {
    let product = array[i];

    if ((product.cost >= minPrice) && (product.cost <= maxPrice)) {

      // Si el usuario está filtrando con texto, reviso que el producto coincida con la búsqueda
      if (searchQuery) {
        let nameAndDesc = product.name + ' ' + product.description;
        let indexOfTerm = nameAndDesc.toLowerCase().indexOf(searchQuery);
        if (indexOfTerm == -1) continue;
      }

      htmlContentToAppend += `
        <div class="product-card">
          <div class="row" style="display: inherit;">
            <div class="col-3">
              <img src="${product.imgSrc}" alt="${product.name}" class="product-img">
            </div>
            <div class="col info">
              <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1 pl-0"><strong>${renderText(product.name)}</strong></h4>
                <small>${product.soldCount} vendidos</small>
              </div>
              <p><span class="badge badge-secondary">${product.currency} ${product.cost.asPrice()}</span></p>
              <p>${renderText(product.description)}</p>
            </div>
            <a href="product-info.html" class="product-link"></a>
          </div>
        </div>
      `;
    }
  };

  // Si no hay resultados, muestro un aviso de que no se encontraron productos
  if (htmlContentToAppend.length < 1) {
    htmlContentToAppend += `
      <div class="alert alert-warning alert-dismissible fade show" role="alert" style="position: relative; top: 30px;">
        <strong>Sin resultados</strong>
        <br>
        No se econtraron productos que cumplan con ese criterio.
        <button type="button" class="close" onclick="clearInputs()" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;
  }

  document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
}

const sortList = (criteria) => {
  document.getElementById("clearSort").style.display = "inline-block";
  sortedArray = productsArray.slice(0);

  if (criteria === "sortAsc") {
    sortedArray = sortedArray.sort((a, b) => a.cost - b.cost);
  } else if (criteria === "sortDesc") {
    sortedArray = sortedArray.sort((a, b) => b.cost - a.cost);
  } else if (criteria === "sortByCount") {
    sortedArray = sortedArray.sort((a, b) => b.soldCount - a.soldCount);
  }

  showProductsList();
}

function clearInputs() {
  if (searchQuery) {
    searchQuery = undefined;
    searchInput.value = null;
    clearSearch.style.display = "none";
  }
  if (minPrice != 0 || maxPrice != Infinity) {
    minPrice = 0;
    maxPrice = Infinity;
    rangeMin.value = null;
    rangeMax.value = null;
  }

  clearFilter.style.display = "none";
  showProductsList();
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
      if (resultObj.status === "ok") {
        productsArray = resultObj.data;
        showProductsList();
      }
    });

    // Filtrar resultado por precios
    document.getElementById("rangeFilter").addEventListener("click", () => {

      // En caso de inputs vacíos no filtrar y señalizar
      if (rangeMin.value == '' && rangeMax.value == '') {
        return [rangeMin, rangeMax].forEach(e => e.style.borderBottomColor = '#dd7e7e');
      } else {
        [rangeMin, rangeMax].forEach(e => e.style.borderBottomColor = 'silver');
      }

      if (parseInt(rangeMin.value) >= parseInt(rangeMax.value)) {
        return alert("El mínimo debe ser menor al máximo");
      }

      // Doble check de no aceptar valores negativos (en el HTML se invalidó esta posibilidad)
      if (((parseInt(rangeMin.value) || parseInt(rangeMax.value)) < 0)) {
        rangeMin.value = null;
        rangeMax.value = null;
        alert("No pueden ser negativos");
        return;
      }

      minPrice = (parseInt(rangeMin.value)) ? parseInt(rangeMin.value) : 0;
      maxPrice = (parseInt(rangeMax.value)) ? parseInt(rangeMax.value) : Infinity;

      clearFilter.style.display = "inline";
      showProductsList();

      clearFilter.scrollIntoView();
    });

    // Limpiar el filtrado
    clearFilter.addEventListener("click", () => {
      minPrice = 0;
      maxPrice = Infinity;

      rangeMin.value = null;
      rangeMax.value = null;

      clearFilter.style.display = "none";
      showProductsList();
    });

    // Opciones de ordenar el listado
    const sortButtons = ['sortAsc', 'sortDesc', 'sortByCount'];
    sortButtons.forEach(e => document.getElementById(e).addEventListener('click', () => sortList(e)));

    // Quita el orden del listado
    document.getElementById("clearSort").addEventListener("click", function() {
      this.style.display = "none";
      sortedArray = undefined;
      showProductsList();
    });

    // Barra de filtrado por texto (búsqueda)
    searchInput.addEventListener("keyup", function(e) {
      const query = e.target.value.toLowerCase().replace(/\s+/g,' ').trim();

      if (query.length > 0)  {
        searchQuery = query;
        clearSearch.style.display = "inline-block";
      } else {
        searchQuery = undefined;
        clearSearch.style.display = "none";
      }

      showProductsList();

      clearSearch.addEventListener("click", () => {
        searchQuery = undefined;
        clearSearch.style.display = "none";
        this.value = null;
        showProductsList();
      });
    });
});
