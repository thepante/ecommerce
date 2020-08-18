var productsArray = [];
let sortedArray;

let minPrice = 0;
let maxPrice = Infinity;

function showProductsList(array){
    let htmlContentToAppend = "";
    
    for (let i = 0, l = array.length; i < l; i++) {
      let product = array[i];

      if ((product.cost >= minPrice) && (product.cost <= maxPrice)) {
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

    // Lo agrego al finalizar el loop para no tener que hacerlo repetitivamente en cada iteración
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

  // console.log("SORT", criteria);
  // sortedArray.forEach(e => console.log(e.cost, e.soldCount));
  showProductsList(sortedArray);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            showProductsList(productsArray);
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

      // Tomar min
      minPrice = (parseInt(rangeMin)) ? parseInt(rangeMin) : 0;

      // Tomar max
      maxPrice = (parseInt(rangeMax)) ? parseInt(rangeMax) : Infinity;

      showProductsList((sortedArray) ? sortedArray : productsArray);
    });

    // Limpiar el filtrado
    document.getElementById("clearFilter").addEventListener("click", () => {
      minPrice = 0;
      maxPrice = Infinity;

      document.getElementById("rangePriceMin").value = null;
      document.getElementById("rangePriceMax").value = null;

      showProductsList((sortedArray) ? sortedArray : productsArray);
    });

    // Orden del listado
    document.getElementById("sortAsc").addEventListener("click", () => sortList("ASC"));
    document.getElementById("sortDesc").addEventListener("click", () => sortList("DESC"));
    document.getElementById("sortByCount").addEventListener("click", () => sortList("SOLD"));

    // Quita el orden del listado
    document.getElementById("clearSort").addEventListener("click", () => {
      document.getElementById("clearSort").style.display = "none";

      showProductsList(productsArray);
      sortedArray = undefined;
    });
});