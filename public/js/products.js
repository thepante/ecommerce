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

const renderText = text => searchQuery ? text.highlight(searchQuery) : text;

function showProductsList(){
  const array = sortedArray || productsArray;

  let htmlContentToAppend = array.map(product => {
    if ((product.cost >= minPrice) && (product.cost <= maxPrice)) {

      // si el usuario está filtrando con texto, reviso que el producto coincida con la búsqueda
      if (searchQuery) {
        const productInformation = product.name + product.briefDesc;
        const indexOfQueryString = productInformation.toLowerCase().indexOf(searchQuery);
        if (indexOfQueryString == -1) return '';
      }

      return `
        <div class="col-lg-6">
          <div class="list-card">
            <div class="row" style="display: inherit;">
              <div class="col-3">
                <img src="${product.images[0]}" alt="${product.name}" class="product-img">
              </div>
              <div class="col info">
                <div class="d-flex w-100 justify-content-between">
                  <h4 class="mb-2 pl-0">${renderText(product.name)}</h4>
                  <small>${product.soldCount} vendidos</small>
                </div>
                <p><span class="badge badge-secondary">${product.currency} ${product.cost.asPrice()}</span></p>
                <p class="list-desc">${renderText(product.briefDesc)}</p>
              </div>
              <a href="product-info.html" class="product-link"></a>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  // Si no hay resultados, muestro un aviso de que no se encontraron productos
  if (!htmlContentToAppend) {
    htmlContentToAppend = `
      <div class="alert-warning alert-dismissible p-4 fade show col" role="alert" style="position: relative;">
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
    searchQuery = null;
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

function filterProducts(e) {
  if (!(e.type === 'click' || e.key === 'Enter')) return;

  // En caso de inputs vacíos no filtrar y señalizar
  if (rangeMin.value == '' && rangeMax.value == '') {
    return [rangeMin, rangeMax].forEach(e => e.style.borderBottomColor = '#dd7e7e');
  } else {
    [rangeMin, rangeMax].forEach(e => e.style.borderBottomColor = 'silver');
  }

  minPrice = Number(rangeMin.value) || 0;
  maxPrice = Number(rangeMax.value) || Infinity;

  if (minPrice && maxPrice && !(minPrice < maxPrice)) {
    return alert("El mínimo debe ser menor al máximo");
  }

  showProductsList();
  clearFilter.style.display = "inline";
  clearFilter.scrollIntoView();
}

// Al cargar el dom
document.addEventListener("DOMContentLoaded", function(e){

  // Cargar los productos
  getJSONData(PRODUCTS_URL).then(function(resultObj){
    if (resultObj.status === "ok") {
      productsArray = resultObj.data;
      showProductsList();
    }
  });

  // Filtrar resultado por precios
  document.getElementById("rangeFilter").addEventListener("click", filterProducts);
  [rangeMin, rangeMax].forEach(input => input.addEventListener("keypress", filterProducts));

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
    sortedArray = null;
    showProductsList();
  });

  // Barra de filtrado por texto (búsqueda)
  searchInput.addEventListener("keyup", function(e) {
    const query = e.target.value.toLowerCase().replace(/\s+/g,' ').trim();

    if (query.length > 0)  {
      searchQuery = query;
      clearSearch.style.display = "inline-block";
    } else {
      searchQuery = null;
      clearSearch.style.display = "none";
    }

    showProductsList();

    clearSearch.addEventListener("click", () => {
      searchQuery = null;
      clearSearch.style.display = "none";
      this.value = null;
      showProductsList();
    });
  });
});
