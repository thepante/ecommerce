let product = {};

function showProductInfo() {

  function imagesHtml() {
    let imgs = "";
    for (let img in product.images) {
      // html += `<div class="item-gallery"> <img src="${product.images[img]}"> </div>`;
      imgs += `<div class="item-gallery" style="background-image: url(${product.images[img]});"></div>`;
    }
    return imgs;
  }

  let htmlContent = `
    <div class="row">
      <aside class="col-sm-6 border-right" style="padding-right:0;">
        <article class="gallery-wrap">
          <div class="img-big-wrap">
            <div id="preview-img" style="background-image: url(${product.images[0]});"></div>
          </div>

          <div class="img-small-wrap" id="thumbnails">
            ${imagesHtml()}
          </div>

        </article>
      </aside>
      <aside class="col-sm-6">
        <article class="card-body p-5">
          <h3 class="title mb-3">${product.name}</h3>

          <p class="price-detail-wrap">
            <span class="price h4">
              <span class="currency badge badge-light">${product.currency} ${product.cost}</span>
            </span>
          </p>
          <dl class="item-property">
            <dd>
              <p>${product.description}</p>
            </dd>
          </dl>
          <dl class="param param-feature">
            <dt>Categoría</dt>
            <dd>${product.category}</dd>
          </dl>
          <dl class="param param-feature">
            <dt>Vendidos</dt>
            <dd>${product.soldCount}</dd>
          </dl>
          <hr>
          <div style="text-align:center;">
            <a href="#" class="btn btn-primary text-uppercase add-cart">
              Agregar al carrito <i class="fas fa-shopping-cart"></i>
            </a>
          </div>
        </article>
      </aside>
    </div>
  `;

  document.getElementById("product-info").innerHTML = htmlContent;

  // si se clickea una miniatura pongo esa img como src para la principal
  document.getElementById("thumbnails").addEventListener("click", function(el) {
    let clickedSrc = el.target.style.backgroundImage;
    let previewImg = document.getElementById("preview-img");
    if (clickedSrc != "") previewImg.style.backgroundImage = clickedSrc;
  });

}

document.addEventListener("DOMContentLoaded", function(e){
  getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
    if (resultObj.status === "ok") {
      product = resultObj.data;
      showProductInfo();
    }
  });

});
