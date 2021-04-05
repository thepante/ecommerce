<template>
  <main v-if="$store.state.user" role="main" class="pb-5">

    <PageHeader title="Carrito de compras">
      <p>Mostrando precios en {{ SELECTED_CURRENCY_LABEL }} - <button class="inline-filter" @click="changeCurrency">cambiar</button></p>
    </PageHeader>

    <div v-if="!loading" id="cart" class="cart-section container pt-4 pb-4 p-sm-5">

      <div v-if="!articles.length" class="empty-cart">
        <h4><strong>Tu carrito se encuentra vacío</strong></h4> <br>
        <p>No tienes productos en tu carrito. <router-link to="categories">Continúa comprando!</router-link></p>
      </div>

      <div v-else class="row">

        <div id="cart-list" class="col col-lg-8">
          <h5 class="mb-4">Productos en tu carro <span id="items-amount" class="badge badge-light">{{ articles.length }}</span></h5>
          <table class="table">
            <thead>
              <tr>
                <th width="35%" scope="col" colspan="2">Producto</th>
                <th width="20%" scope="col">Precio</th>
                <th width="20%" scope="col">Cantidad</th>
                <th width="23%" scope="col">Subtotal</th>
                <th width="2%" scope="col"></th>
              </tr>
            </thead>
            <tbody id="cart-articles">

              <CartProduct
                v-for="(product, index) in articles"
                :key="index"
                id="item${i}"
                :name="product.name"
                :currency="product.currency"
                :unitCost="product.unitCost"
                :image="product.src"
                v-model="product.count"
              />

            </tbody>
          </table>
        </div>

        <div id="checkout-section" class="col p-0">
          <div class="card">

            <!-- sección de envío -->
            <div class="row">
              <!-- dirección -->
              <div class="col">
                <CartAddressEdit />
              </div>

              <!-- tipo de envío -->
              <div class="col-xs-12 col-sm-7 col-lg-12">
                <div id="shipping" class="card-body pl-sm-0 py-xl-0 px-lg-3">
                  <h6 class="mb-3">Tipo de envío:</h6>
                  <div class="mb-0">
                    <div class="btn-group btn-group-toggle btn-block filters" @change="selectShippingMethod" data-toggle="buttons">
                      <label
                        class="btn btn-light"
                        :class="SELECTED.SHIPPING_METHOD == 'standard' && 'active'"
                      >
                        <input type="radio" name="shippingMethod" autocomplete="off" value="standard"><i class="fas fa-truck mr-2"></i>Standard
                      </label>
                      <label
                        class="btn btn-light"
                        :class="SELECTED.SHIPPING_METHOD == 'express' && 'active'"
                      >
                        <input type="radio" name="shippingMethod" autocomplete="off" value="express"><i class="fas fa-shipping-fast mr-2"></i>Express
                      </label>
                      <label
                        class="btn btn-light"
                        :class="SELECTED.SHIPPING_METHOD == 'premium' && 'active'"
                      >
                        <input type="radio" name="shippingMethod" autocomplete="off" value="premium"><i class="fas fa-gem mr-2"></i>Premium
                      </label>
                    </div>
                  </div>
                  <p style="margin-top: 1rem;">
                    <small>
                      <strong>Tiempo de entrega entre {{ SELECTED_SHIPPING_METHOD.days[0] }} a {{ SELECTED_SHIPPING_METHOD.days[1] }} días.</strong> <br>
                      El costo de envío es del {{ SELECTED_SHIPPING_METHOD.cost }}% sobre el valor de los productos, sin tomar en cuenta los descuentos.
                    </small>
                  </p>
                </div>
              </div>
            </div>

            <div id="coupon" class="card-body">
              <h6 class="mb-3">Tenés un cupón de descuento? <span title="Válidos: DES10, DES22"><i class="fas fa-info-circle"></i></span></h6>
              <div class="input-group">
                <input v-model="inputCouponCode" type="text" class="form-control" placeholder="Ingresalo acá" />
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button" @click="applyCoupon">Aplicar</button>
                </div>
              </div>
            </div>

            <hr class="ml-5 mr-5 mt-0 mb-0">

            <div id="checkout" class="card-body">
              <div class="prices-list">
                <div>
                  <div title="Costo de los productos">Productos:</div>
                  <div class="price">{{ SELECTED.CURRENCY }} {{ PRODUCTS_TOTAL.asPrice() }}</div>
                </div>
                <div>
                  <div title="Descuento sobre los productos">Descuento:</div>
                  <div class="price">{{ SELECTED.COUPON_CODE && `${SELECTED.CURRENCY} ${DISCOUNT_AMOUNT.asPrice()}` || '-' }}</div>
                </div>
                <div>
                  <div>Costo de envío:</div>
                  <div class="price">{{ SELECTED.CURRENCY }} {{ SHIPPING_COST.asPrice() }}</div>
                </div>
                <div>
                  <div>Total final:</div>
                  <div class="price">{{ SELECTED.CURRENCY }} {{ FINAL_COST.asPrice() }}</div>
                </div>
              </div>

              <hr class="ml-1 mr-1 mt-0 mb-0">

              <div class="mb-0 mt-3">
                <div id="payment-method" class="needs-validation" @change="selectPaymentMethod">
                  <h6>Método de pago:</h6>
                  <small>
                    <div class="custom-control custom-radio">
                      <input type="radio" class="custom-control-input" autocomplete="off" value="card" id="opt-card" name="paymentMethod" required>
                      <label class="custom-control-label" for="opt-card">Tarjeta de crédito</label>
                    </div>
                    <div class="custom-control custom-radio mb-2">
                      <input type="radio" class="custom-control-input" autocomplete="off" value="transfer" id="opt-transfer" name="paymentMethod" required>
                      <label class="custom-control-label" for="opt-transfer">Transferencia bancaria</label>
                      <div class="invalid-feedback"><strong>Debe seleccionar un método de pago</strong></div>
                    </div>
                  </small>
                </div>
              </div>
              <!--
                :data-target="paymentMethod && '#checkoutModal'"
              -->
              <button
                type="button"
                data-toggle="modal"
                id="proceedCheckout"
                class="btn btn-primary btn-block mt-4 checkout"
                :class="(!paymentMethod || !shippingInfo) && 'disabled'"
                @click="proceedCheckout"
              >
                Continuar con el pago
                <i class="far fa-credit-card"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <PaymentModal :method="paymentMethod" @completed="paymentCompleted" />

    <SpinnerLoading v-if="loading" />
  </main>
</template>

<script>
import axios from 'axios';

import { computed } from 'vue';
import { useStore } from 'vuex';

import PageHeader from '../components/PageHeader.vue';
import CartProduct from '../components/CartProduct.vue';
import CartAddressEdit from '../components/CartAddressEdit.vue';
import PaymentModal from '../components/PaymentModal.vue';
import SpinnerLoading from '../components/SpinnerLoading.vue';

export default {
  name: 'Cart',
  title: 'Tu Carrito',
  components: {
    PageHeader,
    PaymentModal,
    SpinnerLoading,
    CartProduct,
    CartAddressEdit,
  },
  data() {
    return {
      loading: true,
      articles: null,

      CURRENCY_DOLLAR: 'USD',
      CURRENCY_PESO: 'UYU',
      LABEL_DOLLAR: 'dólares',
      LABEL_PESO: 'pesos uruguayos',
      DOLLAR_RATE: 40,

      SELECTED: {
        SHIPPING_METHOD: 'standard',
        PAYMENT_METHOD: null,
        CURRENCY: null,
        COUPON_CODE: null,
      },
      discountedAmount: null,
      inputCouponCode: null,
      paymentMethod: null,
      shippingInfo: null,
    }
  },

  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const SHIPPING_METHODS = computed(() => store.state.SHIPPING_METHODS);
    const purchase = computed(() => store.state.purchase);
    return { store, user, SHIPPING_METHODS, purchase };
  },


  mounted() {
    if (!this.$store.state.user) this.loginRedir();

    const savedCurrencyPreference = localStorage.getItem('currency');
    this.SELECTED.CURRENCY = savedCurrencyPreference ? JSON.parse(savedCurrencyPreference).selected : this.CURRENCY_DOLLAR;

    axios.get('/api/cart').then(response => {
      this.articles = response.data[0].articles;
      this.loading = false;
      this.convertPrices();
    });
  },

  computed: {
    couponInput: () => document.querySelector('#coupon input'),
    modalContent: () => document.querySelector('#checkoutModal .modal-content'),

    SELECTED_CURRENCY_LABEL() {
      return (this.SELECTED.CURRENCY == this.CURRENCY_DOLLAR) ? this.LABEL_DOLLAR : this.LABEL_PESO;
    },

    SELECTED_SHIPPING_METHOD() {
      return this.SHIPPING_METHODS[this.SELECTED.SHIPPING_METHOD];
    },

    PRODUCTS_TOTAL()  {
      const calcTotal = (sum, product) => sum += product.unitCost * product.count;
      return this.articles.reduce(calcTotal, 0);
    },

    DISCOUNT_AMOUNT() {
      return this.discountedAmount || 0;
    },

    SHIPPING_COST() {
      return this.PRODUCTS_TOTAL * (this.SELECTED_SHIPPING_METHOD.cost) / 100;
    },

    FINAL_COST() {
      return (this.PRODUCTS_TOTAL + this.SHIPPING_COST) - this.DISCOUNT_AMOUNT;
    },

    PAYMENT_FORMS() {
      return {
        card: document.getElementById('checkout-card'),
        transfer: document.getElementById('checkout-transfer'),
      }
    },

  },

  methods: {

    convertPrices() {
      this.articles.map(product => {
        if (product.currency != this.SELECTED.CURRENCY) {
          product.unitCost = product.currency == this.CURRENCY_DOLLAR
            ? product.unitCost * this.DOLLAR_RATE
            : product.unitCost / this.DOLLAR_RATE;
          product.currency = this.SELECTED.CURRENCY;
        }
        return product;
      });
    },

    changeCurrency() {
      const newSelectedCurrency = this.SELECTED.CURRENCY == this.CURRENCY_DOLLAR
        ? this.CURRENCY_PESO
        : this.CURRENCY_DOLLAR;
      this.SELECTED.CURRENCY = newSelectedCurrency;
      localStorage.setItem('currency', JSON.stringify({ selected: newSelectedCurrency }));
      this.convertPrices();
      this.applyCoupon();
    },

    changeAmount(index, step) {
      this.articles[index].count += step;
    },

    removeItem(index) {
      this.articles.splice(index, 1);
    },

    selectShippingMethod(el) {
      this.SELECTED.SHIPPING_METHOD = el.srcElement.value;
    },

    selectPaymentMethod(el) {
      this.shippingInfo = true;
      this.paymentMethod = el.srcElement.value;
      this.proceedCheckout();
    },

    proceedCheckout() {

      const areSaPSelected = this.SELECTED.SHIPPING_METHOD && this.paymentMethod;
      const isAddressFilled = this.user.address != undefined;
      const isDataFilled = areSaPSelected && isAddressFilled;
      const checkoutButton = document.getElementById('proceedCheckout');
      const saveAddressBtn = document.getElementById('saveShippingBtn')

      const forms = [
        document.getElementById('address-edit'),
        document.getElementById('payment-method'),
      ];

      function enableBtn() {
        checkoutButton.classList.add('btn-primary');
        checkoutButton.classList.remove('btn-danger');
        checkoutButton.classList.remove('disabled');
        checkoutButton.setAttribute('data-target', '#checkoutModal');
      }

      function disableBtn() {
        if (!isAddressFilled) {
          saveAddressBtn.classList.add('btn-danger');
          saveAddressBtn.classList.remove('btn-primary');
          document.getElementById('checkout-section').scrollIntoView();
        } else {
          console.log("else disableBtn → IF isAddressFilled")
        }
        checkoutButton.classList.remove('btn-primary');
        checkoutButton.classList.add('btn-danger');
        checkoutButton.classList.add('disabled');
      }

      isDataFilled ? enableBtn() : disableBtn();
      forms.forEach(form => form && form.classList.add('was-validated'))

      const transactionDetails = {
        data: {
          method: this.SELECTED.SHIPPING_METHOD,
          since: this.SELECTED_SHIPPING_METHOD.days[0],
          until: this.SELECTED_SHIPPING_METHOD.days[1],
          account: document.getElementById(this.paymentMethod == 'card' ? 'cardnumber' : 'bank-acc-number'),
          currency: this.SELECTED.CURRENCY,
        },
        products: this.articles,
        total: {
          products: this.PRODUCTS_TOTAL,
          discount: this.DISCOUNT_AMOUNT,
          shipping: this.SHIPPING_COST,
          final: this.FINAL_COST,
        },
      };

      this.store.state.purchase = transactionDetails;
    },

    paymentCompleted() {
      this.articles = [];
    },

    applyCoupon() {
      if (!this.inputCouponCode) return;

      const validCoupons = {
        DES10: 10,
        DES22: 22,
      };

      const applied = this.inputCouponCode.toUpperCase();

      if (applied in validCoupons) {
        this.SELECTED.COUPON_CODE = applied;
        this.couponInput.style.color = '#83b083';
        this.discountedAmount = this.PRODUCTS_TOTAL * (validCoupons[applied] / 100);
      }
      else {
        this.SELECTED.COUPON_CODE = null;
        this.couponInput.style.color = '#dd8585';
        this.discountedAmount = null;
      }
    },

    loginRedir() {
      this.$router.push({
        name: 'Login',
        params: {
          msg: 'Debes estar logueado para acceder a tu carrito de compras',
          from: 'Cart',
        }
      });
    },

  },
}
</script>

<style lang="scss" scoped>

.inline-filter,
.inline-filter::-webkit-inner-spin-button,
.inline-filter::-webkit-outer-spin-button {
  background: transparent;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: textfield !important;
  outline: none;
  border: none;
  margin: 0;
}


/* Cart section */
.cart-section {
  background: #fff;
  border-radius: 0.3rem;
  box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2);
}

#cart table * {
  vertical-align: middle;
}

#cart-list thead th {
  color: #727272;
  text-align: center;
}

#checkout-section {
  transition: all .2s ease-in-out;
}

#checkout-section:hover > .card {
  box-shadow: 0 3px 7px rgba(154,160,185,.05), 0 10px 40px rgba(166,173,201,.1);
}

#shipping p:last-child {
  color: #555555;
  line-height: 1rem;
}

#coupon h6 span {
  font-size: 0.8rem;
  color: #7a7a7a;
}

#coupon input:not(:placeholder-shown) {
  text-transform: uppercase;
  font-weight: 700;
}

#checkout .prices-list > div {
  display: -ms-flexbox !important;
  display: flex !important;
  -ms-flex-pack: justify !important;
  justify-content: space-between !important;
  padding: .75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
  font-size: 0.9rem;
}

#checkout .prices-list > div:last-child {
  font-weight: 700;
  font-size: 1rem;
}

#checkout #payment-method {
  padding: 0rem .75rem;
}

#cart .custom-control-label {
  font-family: 'Roboto', sans-serif;
  padding-top: .150rem !important;
  border-bottom: .2rem solid transparent;
  transition: all .2s ease-in-out;
}

#cart .custom-control-label:hover {
  cursor: pointer;
  border-bottom-color: #ffdc9a;
}

#cart .custom-radio .custom-control-label::before {
  border-radius: 50%;
}

#cart .custom-control-input.is-valid ~ .custom-control-label, .was-validated .custom-control-input:valid ~ .custom-control-label {
  color: #262626; /* #212529 */
}

#cart .custom-control-input.is-valid ~ .custom-control-label::before, .was-validated .custom-control-input:valid ~ .custom-control-label::before {
  border-color: #adb5bd;
}

#cart .custom-control-input.is-valid:checked ~ .custom-control-label::before, .was-validated .custom-control-input:valid:checked ~ .custom-control-label::before {
	border-color: #ffdc9ae7;/* #007bff;*/
	background-color: #d4b06b; /*#007bff;*/
}

#cart .custom-control-input.is-valid:focus ~ .custom-control-label::before, .was-validated .custom-control-input:valid:focus ~ .custom-control-label::before {
  box-shadow: 0 0 .21rem rgba(185, 136, 73, 0.59); /*0 0 0 .2rem rgba(40, 125, 167, 0.25);*/
}

#cart .price,
#cart .productCount {
  font-family: 'Roboto', sans-serif;
}

.checkout {
  font-weight: 700;
  text-transform: uppercase;
  font-size: .8rem;
  padding: 0.55rem 1.6rem;
}

.checkout i {
  margin-left: .5rem;
}

.empty-cart {
  text-align: center;
}

.empty-cart a {
  text-decoration: none;
  color: #998469;
}

.filters .btn {
	font-size: 0.8rem;
	font-weight: 700;
	cursor: pointer;
}

.btn-group.filters {
	box-shadow: .1rem .2rem .5rem #c0c0c07d;
}

</style>

