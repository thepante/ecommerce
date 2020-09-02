let product = {};
let commentsArray = [];

function showProductInfo() {

  function imagesHtml() {
    let imgs = "";
    for (let img in product.images) {
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

function showComments() {

  function ratingHtml(rating) {
    let html = "";
    for (let i = 0; i < 5; i++) {
      html += `<li><i class="fas fa-star ${(i < rating) ? 'blue-text' : ''}"></i></li>`;
    }
    return html;
  }

  let commentsList = document.getElementById("comments");

  // ordeno los comentarios por su fecha
  // commentsArray.sort((a, b) => a.dateTime.match(/(\d+)/g).join('') - b.dateTime.match(/(\d+)/g).join(''));

  for (let c in commentsArray) {
    let comment = commentsArray[c];

    // cambio el formato de la fecha para que se visualice como dd/mm/aaaa
    let ogDate = comment.dateTime.split(' ')[0];
    let date = ogDate.slice(8, 10) +'/'+ ogDate.slice(5, 7) +'/'+ ogDate.slice(0, 4);

    let singleComment = `
      <div class="row mb-5">
        <div class="col-sm-1 col-12 mb-3">
          <img src="${(comment.avatar) ? comment.avatar : 'img/user.png'}" class="avatar rounded-circle">
        </div>

        <div class="col-sm-10 col-12">
          <h5 class="user-name font-weight-bold">${comment.user}</h5>
          <ul class="rating">
            ${ratingHtml(comment.score)}
          </ul>
          <p class="dark-grey-text article">${comment.description}</p>

          <div class="card-data comment-date font-small grey-text">
            <span title="${comment.dateTime}">${date}</span>
          </div>
        </div>
      </div>
    `;

    commentsList.innerHTML += singleComment;
  }
}


function showWriteComment() {
  let writeCommentBox = document.getElementById('write-comment');

  function showWriteBox() {
    writeCommentBox.innerHTML = `
      <h5>Agregá el tuyo</h5>
      <div class="row">
        <div style="width: 100%;">
          <div class="panel panel-info">
            <div class="panel-body">
              <textarea class="writec-textarea" placeholder="${userData.username}, calificá este producto!"></textarea>
              <div class="send-group">
                <div class="btn-group">
                  <div id="rate-stars">
                    <label><input type="radio" name="rating" value="1" autocomplete="off"><i class="fas fa-star"></i></label>
                    <label><input type="radio" name="rating" value="2" autocomplete="off"><i class="fas fa-star"></i></label>
                    <label><input type="radio" name="rating" value="3" autocomplete="off"><i class="fas fa-star"></i></label>
                    <label><input type="radio" name="rating" value="4" autocomplete="off"><i class="fas fa-star"></i></label>
                    <label><input type="radio" name="rating" value="5" autocomplete="off"><i class="fas fa-star"></i></label>
                  </div>
                </div>
                <button class="btn btn-primary" type="button" id="publish-comment">Publicar comentario</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br>
    `;

    // cuando seleccione una estrella, pintar las que correspondan al puntaje
    document.getElementById('rate-stars').addEventListener('click', function(e) {
      let stars = document.querySelectorAll('#rate-stars i');
      let userRate = e.srcElement.value;

      if (userRate) console.log(userRate);

      // asegurar que las mayores al puntaje permatezcan grises (al cambiar de selección)
      stars.forEach((i) => i.style.color = '#8d8d8d');

      // pongo color a las que sean menos o igual al puntaje seleccionado
      for (let s in stars) {
        if (s < userRate) stars[s].style.color = '#2196f3';
      }
    });

  };

  // mostrar contenido dependiendo si inició sesión o no
  if (userData) {
    showWriteBox();
  } else {
    writeCommentBox.innerHTML = `
      <div class="alert-light">
        <a href="index.html" class="alert-link">Inicia sesión</a> para dejar el tuyo.
      </div>
    `;
  }

}

document.addEventListener("DOMContentLoaded", function(e){
  getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
    if (resultObj.status === "ok") {
      product = resultObj.data;
      showProductInfo();
    }
  });

  getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
    if (resultObj.status === "ok") {
      commentsArray = resultObj.data;
      showComments();
    }
  });

  showWriteComment();
});
