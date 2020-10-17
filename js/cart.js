const CURRENCY_DOLLAR = 'USD';
const CURRENCY_PESO = 'UYU';
const LABEL_DOLLAR = 'dólares';
const LABEL_PESO = 'pesos uruguayos';
const DOLLAR_RATE = 40;

const itemsAmount = document.getElementById('items-amount');
const currencyLabel = document.getElementById('currency-label');
const productsTotal = document.getElementById('pricesTotal');
const shippingPrice = document.getElementById('shipping-price');
const couponInput = document.getElementById('coupon-code');
const discounted = document.getElementById('discount-amount');

const SHIPPING_METHODS = {
  standard: {
    cost: 5,
    days: [12, 15],
  },
  express: {
    cost: 7,
    days: [5, 8],
  },
  premium: {
    cost: 15,
    days: [2, 5],
  },
};

let SELECTED_SHIPPING_METHOD = null;
let SELECTED_PAYMENT_METHOD = null;
let SELECTED_CURRENCY = null;
let couponCode = null;
let articles = [];


// tomar el precio de un elemento (le quita el formato)
function extractPrice(element) {
  let price = element.innerText.match(/\b\d[\d,.]*\b/g);
  price = price.map(p => p.replaceAll('.','').replace(',', '.'));
  return Number(price);
}

// formatea el precio y agrega la moneda
function formatPrice(price) {
  if (price % 1 != 0) price = price.toFixed(2).replace('.', ',');
  price = String(price).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&.');
  return `${SELECTED_CURRENCY} ${price}`;
}

// convierte el precio de moneda (si no es la seleccionada)
// 'currency' es la moneda del 'price' que se le pasa como segundo parámetro
function processPrice(currency, price) {
  if (currency != SELECTED_CURRENCY) {
    price = (currency == CURRENCY_DOLLAR) ? price * DOLLAR_RATE : price / DOLLAR_RATE;
  }
  return price;
}

// calcula el costo total de los productos
function calcProductsTotal() {
  let total = 0;
  const subtotals = document.querySelectorAll('.subtotal');
  subtotals.forEach(e => total += extractPrice(e));

  productsTotal.innerText = formatPrice(total);
  if (couponCode) calcDiscount();
  calcShipping();
}

// recibe el id de la fila, ya que trabaja en base a ella
function calcSubtotal(id) {
  const row = document.getElementById(id);
  const price = extractPrice(row.querySelector('.unitCost'));
  const amount = Number(row.querySelector('.productCount').value);
  const subtotal = price * amount;
  row.querySelector('.subtotal').innerText = formatPrice(subtotal);
  calcProductsTotal();
}

// cambia la cantidad de un producto
function changeAmount(e, step) {
  const row = e.parentNode.parentNode;
  const input = row.querySelector('input');
  step > 0 ? input.stepUp() : input.stepDown();
  calcSubtotal(row.id);
}

// quita un producto del carrito
function removeItem(e) {
  const index = Number(e.parentNode.parentNode.id.match(/\d/)[0]);
  articles.splice(index, 1);
  showCartProducts();
}

// svgs para los botones de cantidad
const btnIcon = {
  plus: `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>`,
  minus: `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
    </svg>`,
}

// mostrar productos en el carrito
function showCartProducts() {
  const cartPage = document.getElementById('cart');
  const cartList = document.getElementById('cart-articles');

  const cartProductsHtml = articles.map((product, i) => {
    let {name, count, unitCost, currency, src} = product;
    let price = processPrice(currency, unitCost); // cambia de moneda si es necesario
    let subtotal = count * price;

    return `
      <tr id="item${i}">
        <td><img src="${src}" /></td>
        <td>${name}</td>
        <td class="price unitCost">${formatPrice(price)}</td>
        <td>
          <button onclick="changeAmount(this, -1)">${btnIcon.minus}</button>
          <input type="number" min="1" class="productCount" value="${count}" onchange="calcSubtotal('item${i}')"></input>
          <button onclick="changeAmount(this, 1)">${btnIcon.plus}</button>
        </td>
        <td class="price subtotal">${formatPrice(subtotal)}</td>
        <td><span onclick="removeItem(this)" title="Eliminar '${name}' del carrito"><i class="fas fa-times"></i></span></td>
      </tr>
    `;
  }).join('');

  const showEmptyCart = `
    <div class="empty-cart">
      <h4><strong>Tu carrito se encuentra vacío</strong></h4> <br>
      <p>No tienes productos en tu carrito. <a href="./products.html">Continúa comprando!</a>
    </div>
  `;

  // mostrar lo que corresponda
  if (articles.length > 0) {
    itemsAmount.innerText = articles.length;
    cartList.innerHTML = cartProductsHtml;
    calcProductsTotal();
  } else {
    cartPage.innerHTML = showEmptyCart;
  }
}


// cambiar y guardar la preferencia de en qué moneda mostrar los precios
function setCurrencyPreference(selected) {
  SELECTED_CURRENCY = selected;
  localStorage.setItem('currency', JSON.stringify({selected}));
}

// actualiza el texto que indica qué moneda está seleccionada
function displayCurrencyName() {
  currencyLabel.innerText = (SELECTED_CURRENCY == CURRENCY_DOLLAR) ? LABEL_DOLLAR : LABEL_PESO;
}

// transforma de moneda todos los precios visibles
function convertDisplayedPrices(prevCurrency) {
  const allDisplayedValues = document.querySelectorAll('#cart .price');

  allDisplayedValues.forEach(e => {
    // reviso el length para ignorar casillero del descuento cuando no hay cupón aplicado
    if (e.innerText.length > 1) {
      const price = processPrice(prevCurrency, extractPrice(e));
      e.innerText = formatPrice(price);
    }
  });

  // recalcular el costo de envío en base al precio en esa moneda
  calcShipping();
}

// cambia la selección de la moneda y pide convertir los precios visibles
function changeCurrency() {
  const previousCurrency = SELECTED_CURRENCY;
  const newSelectedCurrency = (SELECTED_CURRENCY == CURRENCY_DOLLAR) ? CURRENCY_PESO : CURRENCY_DOLLAR;
  setCurrencyPreference(newSelectedCurrency);
  convertDisplayedPrices(previousCurrency);
  displayCurrencyName();
}

// muestra el costo total final
function calcFinalCost() {
  const finalElement = document.getElementById('final-cost');
  const beforeShipping = couponCode ? (extractPrice(productsTotal) - extractPrice(discounted)) : extractPrice(productsTotal);
  const finalCost = beforeShipping + extractPrice(shippingPrice);
  finalElement.innerText = formatPrice(finalCost);
}

// el costo de envío es un porcentaje del costo total de los productos (sin tomar en cuenta el descuento)
function calcShipping() {
  SELECTED_SHIPPING_METHOD = document.querySelector('#shipping input[name="shippingMethod"]:checked').value;
  const productsPrice = extractPrice(productsTotal);
  const shippingCost = productsPrice * (SHIPPING_METHODS[SELECTED_SHIPPING_METHOD].cost / 100);

  document.getElementById('shipping-from').innerText = SHIPPING_METHODS[SELECTED_SHIPPING_METHOD].days[0];
  document.getElementById('shipping-until').innerText = SHIPPING_METHODS[SELECTED_SHIPPING_METHOD].days[1];
  document.getElementById('shipping-cost').innerText = SHIPPING_METHODS[SELECTED_SHIPPING_METHOD].cost;

  shippingPrice.innerText = formatPrice(shippingCost);
  calcFinalCost();
}

// calcula y aplica descuentos si el código es válido
function calcDiscount() {
  const validCoupons = {
    DES10: 10,
    DES22: 22,
  };

  const applied = couponInput.value.toUpperCase();

  if (applied in validCoupons) {
    couponCode = applied;
    couponInput.style.color = '#83b083';
    const discount = validCoupons[couponCode];
    const productsPrice = extractPrice(productsTotal);
    const discountAmount = productsPrice * (discount / 100);
    discounted.innerText = formatPrice(discountAmount);
  }
  else {
    couponCode = null;
    couponInput.style.color = '#dd8585';
    discounted.innerText = '-';
  }

  calcFinalCost();
}


// manejo de la sección de 'datos de envío'
const shippingInfo = {
  KEY: 'shipping-info',
  INFO: document.getElementById('shipping-info'),
  EDIT: document.getElementById('address-edit'),
  country: document.getElementById('address-country'),
  street: document.getElementById('address-st'),
  number: document.getElementById('address-number'),
  corner: document.getElementById('address-corner'),

  // validar y guardar los datos de dirección
  save() {
    const inputs = [this.country, this.street, this.number, this.corner];
    let isValid = inputs.every(input => input.value.trim() !== '');

    if (isValid) {
      const data = {
        country: this.country.value,
        street: this.street.value,
        number: this.number.value,
        corner: this.corner.value,
      };

      localStorage.setItem(this.KEY, JSON.stringify(data));
      this.display();
    } else {
      this.EDIT.classList.add('was-validated');
    }
    setCheckoutBtnStatus();
  },

  // cargar los datos desde localStorage
  load() {
    const {country, street, number, corner} = JSON.parse(localStorage.getItem(this.KEY));
    this.country.value = country;
    this.street.value = street;
    this.number.value = number;
    this.corner.value = corner;
  },

  // mostrar los datos de dirección
  display() {
    this.load();
    this.INFO.innerHTML = `
      <div id="edit-address" onclick="shippingInfo.toggle()" title="Editar dirección"><i class="fas fa-edit"></i></div>
      ${this.country.value}: <br>
      ${this.street.value} ${this.number.value}, ${this.corner.value}
    `;
    document.getElementById('cancel-edit-address').style.display = 'inline';
    this.INFO.style.display = 'inline';
    this.EDIT.style.display = 'none';
  },

  // cambia de vista (edición o visualización de los datos)
  toggle() {
    this.load();
    [this.EDIT, this.INFO].forEach(e => e.style.display = e.style.display === 'none' ? 'inline' : 'none');
  },
}


// validación de los métodos de envío y de pago
function areShippingAndPaymentSelected() {
  const radios = [
    document.getElementsByName('shippingMethod'),
    document.getElementsByName('paymentMethod'),
  ];
  return radios.every(group => Array.from(group).some(radio => radio.checked));
}

// validación de datos de envío
function isShippingAddressValid() {
  const storedInfo = JSON.parse(localStorage.getItem(shippingInfo.KEY));
  return storedInfo ? Object.values(storedInfo).every(value => value.trim() !== '') : false;
}

// establecer disponibilidad de continuar con el pago
function setCheckoutBtnStatus() {
  const areSaPSelected = areShippingAndPaymentSelected();
  const isAddressValid = isShippingAddressValid();
  const isDataFilled = areSaPSelected && isAddressValid;
  const checkoutButton = document.getElementById('proceedCheckout');
  const forms = [
    document.getElementById('address-edit'),
    document.getElementById('payment-method'),
  ];

  if (isDataFilled) {
    checkoutButton.classList.remove('disabled');
    checkoutButton.setAttribute('data-target', '#checkoutModal');
  } else {
    checkoutButton.classList.add('disabled');
  }

  forms.forEach(form => form.classList.add('was-validated'));
}


// establecer el formulario de pago que corresponda
function enablePaymentForm(selected) {
  SELECTED_PAYMENT_METHOD = selected;

  const paymentForms = {
    card: document.getElementById('checkout-card'),
    transfer: document.getElementById('checkout-transfer'),
  };

  for (const [method, element] of Object.entries(paymentForms)) {
    element.style.display = SELECTED_PAYMENT_METHOD === method ? 'inline' : 'none';
  };

  setCheckoutBtnStatus();
}

// habilitar el pago si están todos los datos necesarios - solo valida que no estén vacíos, nada más
function confirmPayment() {
  const paymentForm = document.getElementById(`checkout-${SELECTED_PAYMENT_METHOD}`);

  const isDataValid = {
    SaP: areShippingAndPaymentSelected(),
    address: isShippingAddressValid(),
    amounts: Array.from(document.querySelectorAll('#cart-articles input[type="number"]')).every(e => Number(e.value) > 0),
    prices: Array.from(document.getElementsByClassName('price')).every(e => e.innerText.trim() !== ''),
    payment: Array.from(paymentForm.getElementsByTagName('input')).every(e => e.value.trim() !== ''),
  };
  const isAllValid = Object.values(isDataValid).every(Boolean);

  paymentForm.classList.add('was-validated');
  if (isAllValid) showBuySuccess();
}


// confirma la compra y muestra un resumen de la misma
function showBuySuccess() {

  // datos de envío
  const {country, street, number, corner} = {
    country: shippingInfo.country.value,
    street: shippingInfo.street.value,
    number: shippingInfo.number.value,
    corner: shippingInfo.corner.value,
  };

  // datos de los productos
  const {pricesTotal, discount, shippingCost, finalTotal} = {
    pricesTotal: document.getElementById('pricesTotal').innerText,
    discount: document.getElementById('discount-amount').innerText,
    shippingCost: document.getElementById('shipping-price').innerText,
    finalTotal: document.getElementById('final-cost').innerText,
  };

  const shipping = SHIPPING_METHODS[SELECTED_SHIPPING_METHOD];
  const modalContent = document.querySelector('#checkoutModal .modal-content');

  const today = new Date();
  const day = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  const time = today.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
  const datetime = `${day} / ${time}`;

  // animación de espera
  modalContent.innerHTML = `
    <div class="processing-payment">
      <div class="sk-folding-cube">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
      <p>Procesando pago...</p>
    </div>
  `;

  // html del listado de productos
  const productsListHTML = Array.from(document.querySelectorAll('tr[id^="item"]')).map(product => {
    const {name, price, amount, subtotal} = {
      name: product.querySelector('td:nth-of-type(2)').innerText,
      price: product.querySelector('.unitCost').innerText,
      amount: product.querySelector('input').value,
      subtotal: product.querySelector('.subtotal').innerText,
    };

    return `
      <tr>
        <td>${name}<br><small class="badge badge-light text-muted">${price}</small></td>
        <td>x${amount}</td>
        <td class="price">${subtotal}</td>
      </tr>
    `;
  }).join('');

  // éxito del pago
  const successHtml = `
    <div class="modal-header">
      <h5 class="modal-title" id="checkoutModalLabel">Compra realizada con éxito</h5>
      <button type="button" class="close" data-dismiss="modal" onclick="closeConfirmation()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div id="receipt" class="modal-body receipt">
      <p class="alert-success">
        ${userData.username}, gracias por su compra! <br>
        <strong>Su pedido será enviado en ${country} a:</strong> <br>
        ${street} N°${number}, esq. ${corner} <br>
        Le llegará dentro de ${shipping.days[0]} a ${shipping.days[1]} días por envío ${SELECTED_SHIPPING_METHOD}.
      </p>
      <table class="table products-summary">
        <tr>
          <th width="60%">Producto</th>
          <th width="10%">Cantidad</th>
          <th width="30%">Subtotal</th>
        </tr>
        ${productsListHTML}
      </table>
      <table class="table costs-summary">
        <tr><th width="50%">Totales</th><th width="50%"></th></tr>
        <tr><td>Productos:</td><td class="price">${pricesTotal}</td></tr>
        <tr><td>Descuento:</td><td class="price">${discount}</td></tr>
        <tr><td>Costo de envío:</td><td class="price">${shippingCost}</td></tr>
        <tr><th>Total final:</th><th class="price">${finalTotal}</th></tr>
      </table>
      <hr>
      <div class="datetime">Fecha y hora de compra: ${datetime}</div>
    </div>
    <div class="modal-footer text-center">
      <button type="button" onclick="window.location = './categories.html'" class="btn btn-light ml-auto"><i class="fas fa-shopping-cart"></i> Continuar comprando</button>
      <button type="button" onclick="printReceipt()" class="btn btn-light mr-auto"><i class="fas fa-file-invoice"></i> Descargar recibo</button>
    </div>
  `;

  // simular espera de respuesta del backend y luego mostrar resultado
  setTimeout(() => modalContent.innerHTML = successHtml, 2200);
}


// para que el botón no quede pintado ahí xD funcionalidad del 'descargar recibo'
function printReceipt() {
  const print = window.open('', 'PRINT', 'height=750,width=900,top=100,left=150');
  print.document.write(`
    <html><head><title>Recibo eMercado</title></head><body>
    ${document.getElementById('receipt').innerHTML}
    </body></html>
  `);

  print.document.close();
  print.focus();
  print.print();
  print.close();
  return true;
}

// ciere de confirmación de compra
function closeConfirmation() {
  articles = [];
  showCartProducts();
}


document.addEventListener("DOMContentLoaded", function(e){
  // reviso si ya había preferencia de la moneda
  // si no, por defecto se mostrará en dólares
  const savedCurrencyOptions = localStorage.getItem('currency');
  SELECTED_CURRENCY = savedCurrencyOptions ? JSON.parse(savedCurrencyOptions).selected : CURRENCY_DOLLAR;
  displayCurrencyName();

  couponInput.addEventListener('keydown', function(){
    this.style.color = 'unset';
  });

  getJSONData(CART_INFO_URL).then(function(resultObj){
    if (resultObj.status === "ok") {
      articles = resultObj.data.articles;
      showCartProducts();
    }
  });

  // datos de envío: mostrar la sección que corresponda
  localStorage.getItem(shippingInfo.KEY) ? shippingInfo.display() : shippingInfo.EDIT.style.display = 'inline';

  // guardar datos de envío
  document.getElementById('save-shipping-info').addEventListener('click', () => shippingInfo.save());

  // asignar el formulario del pago seleccionado
  document.getElementById('payment-method').addEventListener('change', function() {
    const method = this.querySelector('input:checked').value;
    enablePaymentForm(method);
  });

  // establecer estado al botón de checkout
  document.getElementById('proceedCheckout').addEventListener('click', function() {
    setCheckoutBtnStatus();
  });

});
