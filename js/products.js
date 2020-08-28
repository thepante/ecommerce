var productsArray = [];
let sortedArray;

let searchQuery;
let minPrice = 0;
let maxPrice = Infinity;

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
      <div class="list-group-item list-group-item-action">
          <div class="row">
              <div class="col-3">
                  <img src="${product.imgSrc}" alt="${product.name}" class="img-thumbnail">
              </div>
              <div class="col">
                  <div class="d-flex w-100 justify-content-between">
                      <h4 class="mb-1"><span class="badge badge-secondary">${product.currency} ${product.cost}</span> <strong>${product.name}</strong></h4>
                      <small class="text-muted">${product.soldCount} vendidos</small>
                  </div>
                  <p>${product.description}</p>
              </div>
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

  // clono el array original para trabajar con uno aparte y no alterar el orden inicial
  // así el usuario puede quitar la preferencia de orden y que se muestre como lo hacía originalmente
  sortedArray = productsArray.slice(0);

  if (criteria === "ASC") {
    sortedArray = sortedArray.sort((a, b) => a.cost - b.cost);
  } else if (criteria === "DESC") {
    sortedArray = sortedArray.sort((a, b) => b.cost - a.cost);
  } else if (criteria === "SOLD") {
    sortedArray = sortedArray.sort((a, b) => b.soldCount - a.soldCount);
  }

  // sortedArray.forEach(e => console.log(e.cost, e.soldCount));
  showProductsList();
}

const clearInputs = () => {
  if (searchQuery) {
    searchQuery = undefined;
    document.getElementById("searchInput").value = null;
    document.getElementById("clearSearch").style.display = "none";
  }
  if (minPrice != 0 || maxPrice != Infinity) {
    minPrice = 0;
    maxPrice = Infinity;
    document.getElementById("rangePriceMin").value = null;
    document.getElementById("rangePriceMax").value = null;
  }
  showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            showProductsList();
        }
    });

    // Filtrar resultados
    document.getElementById("rangeFilter").addEventListener("click", () => {
      let rangeMin = document.getElementById("rangePriceMin").value;
      let rangeMax = document.getElementById("rangePriceMax").value;

      // No aceptar que el min sea igual o mayor al max
      if (parseInt(rangeMin) >= parseInt(rangeMax)) {
        document.getElementById("rangePriceMin").value = null;
        document.getElementById("rangePriceMax").value = null;
        alert("El mínimo debe ser menor al máximo");
        return;
      }

      // Doble check de no aceptar valores negativos (en el HTML se invalidó esta posibilidad)
      if (((parseInt(rangeMin) || parseInt(rangeMax)) < 0)) {
        document.getElementById("rangePriceMin").value = null;
        document.getElementById("rangePriceMax").value = null;
        alert("No pueden ser negativos");
        return;
      }

      // Tomar min y max correspondientes
      minPrice = (parseInt(rangeMin)) ? parseInt(rangeMin) : 0;
      maxPrice = (parseInt(rangeMax)) ? parseInt(rangeMax) : Infinity;

      showProductsList();
    });

    // Limpiar el filtrado
    document.getElementById("clearFilter").addEventListener("click", () => {
      minPrice = 0;
      maxPrice = Infinity;

      document.getElementById("rangePriceMin").value = null;
      document.getElementById("rangePriceMax").value = null;

      showProductsList();
    });

    // Orden del listado
    document.getElementById("sortAsc").addEventListener("click", () => sortList("ASC"));
    document.getElementById("sortDesc").addEventListener("click", () => sortList("DESC"));
    document.getElementById("sortByCount").addEventListener("click", () => sortList("SOLD"));

    // Quita el orden del listado
    document.getElementById("clearSort").addEventListener("click", () => {
      document.getElementById("clearSort").style.display = "none";

      sortedArray = undefined;
      showProductsList();
    });

    // Barra de filtrado por texto (búsqueda)
    document.getElementById("searchInput").addEventListener("keyup", (e) => {
      const clearSearch = document.getElementById("clearSearch");
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
        document.getElementById("searchInput").value = null;
        showProductsList();
      });
    });
});