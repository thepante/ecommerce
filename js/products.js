var productsArray = [];

function showProductsList(array){
    let htmlContentToAppend = "";
    
    for (let i = 0, l = array.length; i < l; i++) {
      let product = array[i];

      htmlContentToAppend += `
      <div class="list-group-item list-group-item-action">
          <div class="row">
              <div class="col-3">
                  <img src="${product.imgSrc}" alt="${product.description}" class="img-thumbnail">
              </div>
              <div class="col">
                  <div class="d-flex w-100 justify-content-between">
                      <h4 class="mb-1"><span class="badge badge-secondary">${product.currency} ${product.cost}</span> ${product.name}</h4>
                      <small class="text-muted">${product.soldCount} vendidos</small>
                  </div>
                  <p>${product.description}</p>
              </div>
          </div>
      </div>
      `
    };
    
    // Lo agrego al finalizar el loop para no tener que hacerlo repetitivamente en cada iteración
    document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productsArray = resultObj.data;
            showProductsList(productsArray);
        }
    });
});