const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
const minCountInput = document.getElementById("rangeFilterCountMin");
const maxCountInput = document.getElementById("rangeFilterCountMax");
var currentCategoriesArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showCategoriesList(){

  let htmlContentToAppend = "";
  for(let i = 0; i < currentCategoriesArray.length; i++){
    let category = currentCategoriesArray[i];

    if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
        ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

      htmlContentToAppend += `
        <div class="list-card">
          <div class="row" style="display: inherit;">
            <div class="col-3">
              <img src="${category.imgSrc}" alt="${category.description}" class="product-img">
            </div>
            <div class="col info">
              <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1 pl-0">${category.name}</h4>
                <small>${category.productCount} artículos</small>
              </div>
              <p>${category.description}</p>
            </div>
            <a href="category-info.html" class="product-link"></a>
          </div>
        </div>
      `;
    };
  }

  if (htmlContentToAppend.length < 1) {
    htmlContentToAppend += `
      <div class="alert-warning alert-dismissible p-4 fade show" role="alert" style="position: relative;">
        <strong>Sin resultados</strong>
        <br>
        No se econtraron categorías que cumplan con ese criterio.
        <button type="button" class="close" onclick="clearFilter()" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;
  }

  document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}


function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

function filterCategories(e) {
  if (!(e.type === 'click' || e.key === 'Enter')) return;

  //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
  //de productos por categoría.
  minCount = minCountInput.value;
  maxCount = maxCountInput.value;

  // En caso de inputs vacíos no filtrar y señalizar
  if (minCount == '' && maxCount == '') {
    return [minCountInput, maxCountInput].forEach(e => e.style.borderBottomColor = '#dd7e7e');
  } else {
    [minCountInput, maxCountInput].forEach(e => e.style.borderBottomColor = 'silver');
  }

  const assignValue = val => val && val !== "" && Number(val) >= 0 ? Number(val) : null;
  minCount = assignValue(minCount);
  maxCount = assignValue(maxCount);

  showCategoriesList();
  clearRangeFilter.style.display = 'inline';
  clearRangeFilter.scrollIntoView();
}


function clearFilter() {
  minCountInput.value = '';
  maxCountInput.value = '';

  minCount = undefined;
  maxCount = undefined;

  clearRangeFilter.style.display = 'none';
  showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    const clearRangeFilter = document.getElementById('clearRangeFilter');

    clearRangeFilter.addEventListener("click", function(){
      minCountInput.value = '';
      maxCountInput.value = '';

      minCount = undefined;
      maxCount = undefined;

      showCategoriesList();
      clearRangeFilter.style.display = 'none';
    });

    document.getElementById('rangeFilterCount').addEventListener("click", filterCategories);
    [minCountInput, maxCountInput].forEach(input => input.addEventListener("keypress", filterCategories));
});
