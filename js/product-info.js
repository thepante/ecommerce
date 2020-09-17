let product = {};
let commentsArray = [];
let relatedProducts = [];

// función que hace de carousel - quería probar hacerlo por mi cuenta
const slideshow = {
  // definir los indices de las imgs: actual, anterior y siguiente
  setIndex: function() {
    for (let i = 0; i < this.imgs.length; i++) {
      if (this.imgs[i].style.backgroundImage === this.displayedImg.style.backgroundImage) {
        this.actual = i;
        this.prev = i > 0 ? i - 1 : this.imgs.length-1;
        this.next = this.imgs[i+1] ? i + 1 : 0;
      }
    }
  },

  // muestra la img y asigna el selected a la correspondiente
  changeImage: function(i) {
    this.displayedImg.style.backgroundImage = this.imgs[i].style.backgroundImage;
    this.imgs[this.actual].classList.remove('selected');
    this.imgs[i].classList.add('selected');
  },

  // pasar a la anterior
  showPrev: function() {
    this.setIndex();
    this.changeImage(this.prev);
  },

  // pasar a la siguiente
  showNext: function() {
    this.setIndex();
    this.changeImage(this.next);
  },

  // hace next automaticamente cada 5 segundos
  // se detiene cuando mouseover en la foto grande y lo reinicia cuando mouseout (ver línea 68)
  startLoop: async function () {
    this.loop = setTimeout(function(){
      slideshow.showNext();
      slideshow.startLoop();
    }, 5000);
  },

  // declara la img principal y el array de imgs, e inicia el cambio de img automático
  init: function() {
    this.displayedImg = document.getElementById('preview-img');
    this.imgs = document.getElementsByClassName('item-gallery');
    this.startLoop();
  }
}

function showProductInfo() {

  function getThumbnailsHtml() {
    let imgs = "";
    for (let img in product.images) {
      imgs += `<div class="item-gallery ${(img == 0) ? 'selected' : ''}" style="background-image: url(${product.images[img]});"></div>`;
    }
    return imgs;
  }

  let htmlContent = `
    <div class="row">
      <aside class="col-sm-6 border-right" style="padding-right:0;">
        <article class="gallery-wrap">
          <div class="img-big-wrap" onmouseover="clearTimeout(slideshow.loop);" onmouseout="slideshow.startLoop()">
            <div id="preview-img" style="background-image: url(${product.images[0]});">
              <div id="controls">
                <i class="fas fa-chevron-left" onclick="slideshow.showPrev()"></i>
                <i class="fas fa-chevron-right" onclick="slideshow.showNext()"></i>
              </div>
            </div>
          </div>
          <div class="img-small-wrap" id="thumbnails">
            ${getThumbnailsHtml()}
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
  const thumbnails = document.getElementById("thumbnails");
  thumbnails.addEventListener("click", function(el) {
    let clickedSrc = el.target.style.backgroundImage;
    let previewImg = document.getElementById("preview-img");

    if (clickedSrc != "") {
      previewImg.style.backgroundImage = clickedSrc;
      thumbnails.querySelectorAll('div').forEach(function(i){
        (i.style.backgroundImage == previewImg.style.backgroundImage)
          ? i.classList.add('selected')
          : i.classList.remove('selected');
      });
      clearTimeout(slideshow.loop);
      slideshow.startLoop();
    }
  });

}

function showComments() {

  function getScoreHtml(rated) {
    let html = "";
    for (let i = 0; i < 5; i++) {
      html += `<li><i class="fas fa-star ${(i < rated) ? 'blue-text' : ''}"></i></li>`;
    }
    return html;
  }

  let commentsDiv = document.getElementById("comments");
  let commentsList = '';

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
            ${getScoreHtml(comment.score)}
          </ul>
          <p class="dark-grey-text article">${comment.description}</p>

          <div class="card-data comment-date font-small grey-text">
            <span title="${comment.dateTime}">${date}</span>
          </div>
        </div>
      </div>
    `;

    commentsList += singleComment;
  }

  commentsDiv.innerHTML = commentsList;
}


function showWriteComment() {
  let writeCommentBox = document.getElementById('write-comment');

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

  function showWriteBox() {
    writeCommentBox.innerHTML = `
      <h5>Agregá el tuyo</h5>
      <div class="row">
        <div style="width: 100%;">
          <textarea class="writec-textarea" placeholder="${userData.username}, calificá este producto!" required></textarea>
          <div class="send-group">
            <div class="btn-group">
              <div id="rate-stars" class="btn-group">
                <div id="rate-required">Requerido <span class="fas fa-arrow-right"></span></div>
                <label><input type="radio" name="rating" value="1" autocomplete="off" required><i class="fas fa-star"></i></label>
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
      <br>
    `;

    const rateStars = document.getElementById('rate-stars');
    const stars = document.querySelectorAll('#rate-stars i');
    const cleanColor = (e) => e.style.color = '#8d8d8d';
    let userRate = null;

    // colorear estrellas al pasar el mouse - "previsualizar" elección
    rateStars.addEventListener('mouseover', function(e) {
      let over = e.srcElement.previousSibling.value;
      if (!over) return; // <- asegura que continúe solo si es en base al elemento de una estrella

      // asegurar que permatezcan grises las mayores a la estrella actual
      stars.forEach((s, i) => { if (i > userRate-1) cleanColor(s) });

      // pongo color a las necesarias mientras sean mayor al puntaje seleccionado
      for (let s in stars) {
        if (s > userRate-1 && s < over) stars[s].style.color = '#8baec9';
      }
    });

    // limpiar coloreo del mouseover
    rateStars.addEventListener('mouseout', function(e) {
      stars.forEach((s, i) => { if (i > userRate-1) cleanColor(s) });
    });

    // cuando seleccione una estrella, pintar las que correspondan al puntaje
    rateStars.addEventListener('click', function(e) {
      if (e.srcElement.type != 'radio') return;
      const selected = e.srcElement.value;

      // asegurar que las mayores al puntaje permatezcan grises (al cambiar de elección)
      stars.forEach(cleanColor);

      // si es la misma entonces deseleccionar y cortar acá
      if (userRate && userRate == selected) return userRate = null;

      userRate = selected;
      document.getElementById('rate-required').style.opacity = 0;

      // pongo color a las que sean menos o igual al puntaje seleccionado
      for (let s in stars) {
        if (s < userRate) stars[s].style.color = '#2196f3';
      }
    });

    // al clickear el botón de enviar comentario
    document.getElementById('publish-comment').addEventListener('click', function(e){
      let textarea = document.querySelector('#write-comment textarea');

      const userComment = {
        score: userRate,
        description: textarea.value,
        user: userData.username,
        dateTime: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      }

      // si tiene imagen de perfil, se la agrego
      if (userData) userComment.avatar = userData.picture;

      // si está lo necesario, lo agrego al array
      if (userComment.score && userComment.description) {
        commentsArray.push(userComment);
        showComments();
      }
      // si no, muestro advertencias
      else {
        if (!userComment.description) {
          textarea.classList.add('textarea-alert');
          textarea.addEventListener('keyup', () => textarea.classList.remove('textarea-alert'))
        }
        if (!userComment.score) {
          document.getElementById('rate-required').style.opacity = 1;
        }
      }
    });
  };

}

function showRelatedProducts() {
  const relProductsDiv = document.getElementById('related-products');
  let htmlRelProducts = '';

  relatedProducts.forEach(product => {
    htmlRelProducts += `
    <div class="card m-2">
      <div class="no-gutters">
        <a href="./product-info.html" class="stretched-link"></a>
        <img class="rel-thumbnail" src="./${product.imgSrc}" />
        <div class="description">${product.description}</div>
        <div class="info">
          <h5>${product.name}</h5>
          <p class="badge badge-light">${product.currency} ${product.cost}</p>
          <p class="card-text"><small class="text-muted">${product.soldCount} vendidos</small></p>
        </div>
      </div>
    </div>
    `;
  });

  relProductsDiv.innerHTML = htmlRelProducts;
}

document.addEventListener("DOMContentLoaded", function(e){
  getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
    if (resultObj.status === "ok") {
      product = resultObj.data;
      showProductInfo();
      slideshow.init();
    }
  }).then(function(){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
      if (resultObj.status === "ok") {
        product.relatedProducts.forEach(e => relatedProducts.push(resultObj.data[e]));
        showRelatedProducts();
      }
    });
  });

  getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
    if (resultObj.status === "ok") {
      commentsArray = resultObj.data;
      showComments();
    }
  });

  showWriteComment();
});
