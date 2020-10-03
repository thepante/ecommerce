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

// recibe solo un índice. ya que trabaja en base a esa fila de la tabla
function calcSubtotal(i) {
  const row = document.getElementById('item'+i);
  const price = extractPrice(row.querySelector('.unitCost'));
  const amount = Number(row.querySelector('.productCount').value);
  const subtotal = price * amount;
  row.querySelector('.subtotal').innerText = formatPrice(subtotal);
  calcProductsTotal();
}


// mostrar productos en el carrito
function showCartProducts() {
  let html = '';

  articles.forEach((product, i) => {
    let {name, count, unitCost, currency, src} = product;
    let price = processPrice(currency, unitCost); // cambia de moneda si es necesario
    let subtotal = count * price;

    html += `
      <tr id="item${i}">
        <td><img src="${src}" /></td>
        <td>${name}</td>
        <td class="price unitCost">${formatPrice(price)}</td>
        <td>
          <input type="number" min="1" class="productCount" value="${count}" onchange="calcSubtotal(${i})"></input>
        </td>
        <td class="price subtotal">${formatPrice(subtotal)}</td>
      </tr>
    `;
  });

  itemsAmount.innerText = articles.length;
  document.getElementById('cart-articles').innerHTML = html;
  calcProductsTotal();
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
    // reviso el length para ignorar casillero del descuento cuando todavía no se aplicó ningún cupón
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

// el costo de envío es un porcentaje del costo total de los productos (sin el descuento)
function calcShipping() {
  const costs = {
    standard: 1,
    express: 3,
  };

  const selected = document.querySelector('#shipping input[name="shippingMethod"]:checked').value;
  const productsPrice = extractPrice(productsTotal);
  const shippingCost = productsPrice * (costs[selected] / 100);

  shippingPrice.innerText = formatPrice(shippingCost);
  document.getElementById('show-cost').innerText = costs[selected];
  calcFinalCost();
}

// calcula y aplica descuentos si el código es válido
function calcDiscount() {
  const validCoupons = {
    DES10: 10,
    DES22: 22,
  };

  couponCode = couponInput.value.toUpperCase();

  if (couponCode in validCoupons) {
    couponInput.style.color = '#83b083';
    const discount = validCoupons[couponCode];
    const productsPrice = extractPrice(productsTotal);
    const discountAmount = productsPrice * (discount / 100);
    discounted.innerText = formatPrice(discountAmount);

  } else {
    couponInput.style.color = '#dd8585';
    discounted.innerText = '-';
  }

  calcFinalCost();
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
});
