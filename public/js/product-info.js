let product = {};
let commentsArray = [];

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
      <aside class="col-md-6 border-right mr-3 mr-md-0 pr-0">
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

      <aside class="col-md-6">
        <article class="card-body p-3 p-sm-5 p-md-3 p-lg-5">
          <h3 class="title mb-3">${product.name}</h3>
          <p class="price-detail-wrap">
            <span class="price h4">
              <span class="currency badge badge-light">${product.currency} ${product.cost.asPrice()}</span>
            </span>
          </p>
          <dl class="item-property">
            <dd>
              <p>${product.description.replace(/\\n/g, '<br>')}</p>
            </dd>
          </dl>
          <div class="row">
            <dl class="col col-md-12 mb-1 param param-feature">
              <dt>Categoría</dt>
              <dd>${product.category.name}</dd>
            </dl>
            <dl class="col mb-0 param param-feature">
              <dt>Vendidos</dt>
              <dd>${product.soldCount}</dd>
            </dl>
          </div>
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

function deleteComment(id, i) {
  fetch('/api/comment', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, product: product._id }),
  }).then(res => {
    if (res.ok) {
      commentsArray.splice(i, 1);
      showComments();
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

  for (let i in commentsArray) {
    let comment = commentsArray[i];

    // cambio el formato de la fecha para que se visualice como dd/mm/aaaa
    let ogDate = comment.dateTime.split(' ')[0];
    let date = ogDate.slice(8, 10) +'/'+ ogDate.slice(5, 7) +'/'+ ogDate.slice(0, 4);

    let singleComment = `
      <div class="row mb-5">
        <div class="col-sm-10">
          <img src="${(comment.avatar) ? comment.avatar : 'img/user.png'}" class="avatar rounded-circle">
          <h5 class="user-name font-weight-bold">${comment.user}</h5>
          <ul class="rating">
            ${getScoreHtml(comment.score)}
          </ul>
        </div>
        <div class="col-sm-10 comment-content">
          <p class="dark-grey-text article">${comment.description}</p>
          <div class="card-data comment-date font-small grey-text">
            <span title="${comment.dateTime}">${date}</span>
            ${userData && userData.email === 'panterua@hotmail.com'
        ? `<span class="delete-comment" onclick="deleteComment('${comment._id}', ${i})" style="display:none;">eliminar</span>`
        : ''}
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
        <a href="index.html?from=product-info.html&focus=write-comment&msg=Inicia sesión y califica el producto!" class="alert-link">Inicia sesión</a> para dejar el tuyo.
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
              <div id="rate-stars" class="btn-group d-flex flex-row">
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
    `;

    const rateStars = document.getElementById('rate-stars');
    const stars = document.querySelectorAll('#rate-stars i');
    const cleanColor = (e) => e.style.color = '#8d8d8d';
    let userRate = null;

    // colorear estrellas al pasar el mouse - "previsualizar" elección
    rateStars.addEventListener('mouseover', function(e) {
      let over = e.target.previousSibling.value;
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
      if (e.target.type != 'radio') return;
      const selected = e.target.value;

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
        productId: product._id,
      }

      // si tiene imagen de perfil, se la agrego
      if (userData) userComment.avatar = userData.picture;

      // si está lo necesario, lo agrego al array
      if (userComment.score && userComment.description) {

        fetch('/api/comment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userComment),
        }).then(res => res.ok ? res.json() : null)
          .then(res => {
            userComment._id = res;
            commentsArray.push(userComment);
            showComments();
          })
          .catch(err => console.log('response error:', err));
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

  product.related.forEach(product => {
    htmlRelProducts += `
    <div class="card m-2">
      <div class="no-gutters">
        <a href="./product-info.html" class="stretched-link"></a>
        <img class="rel-thumbnail" src="./${product.imgSrc}" />
        <div class="description">${product.briefDesc}</div>
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

function scrollIfRequested() {
  const URLparams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(URLparams);

  if (params.focus) {
    const element = document.getElementById(params.focus);
    const offsetPosition = element.getBoundingClientRect().top - 100;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}

document.addEventListener("DOMContentLoaded", function(e){
  getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
    if (resultObj.status === "ok") {
      product = resultObj.data;
      showProductInfo();
      slideshow.init();
      showRelatedProducts();
    }
  })
  .then(function(){
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
      if (resultObj.status === "ok") {
        commentsArray = resultObj.data;
        showComments();
        scrollIfRequested();
      }
    })
  });

  showWriteComment();
});
