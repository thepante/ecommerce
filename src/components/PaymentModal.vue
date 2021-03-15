<template>
  <div class="modal fade" id="checkoutModal" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="checkoutModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">

      <div v-if="waiting" class="modal-content">
        <div class="processing-payment">
          <div class="sk-folding-cube">
            <div class="sk-cube1 sk-cube"></div>
            <div class="sk-cube2 sk-cube"></div>
            <div class="sk-cube4 sk-cube"></div>
            <div class="sk-cube3 sk-cube"></div>
          </div>
          <p>Procesando pago...</p>
        </div>
      </div>

      <PurchaseSuccess v-else-if="purchaseSuccess" @completed="paymentCompleted" />

      <div v-else class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title" id="checkoutModalLabel">Realizar compra</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div id="checkout-transfer" class="needs-validation">

          <!-- tarjeta de crédito -->
          <div v-if="method == 'card'" class="modal-body">
            <div class="form-group">
              <label for="fullname">Nombre completo en la tarjeta</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-user"></i></span>
                </div>
                <input type="text" class="form-control" id="fullname" name="fullname" required>
              </div>

            </div>

            <div class="form-group">
              <label for="cardnumber">Número de la tarjeta</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-credit-card"></i></span>
                </div>
                <input type="number" class="form-control" id="cardnumber" name="cardnumber" required>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="expiration-m"><span class="hidden-xs">Vencimiento</span> </label>
                  <div class="input-group">
                    <input type="number" placeholder="MM" id="expiration-m" class="form-control" required>
                    <input type="number" placeholder="AA" id="expiration-y" class="form-control" required>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="cvv" data-toggle="tooltip">CVC <i class="fa fa-question-circle"></i></label>
                  <input type="text" class="form-control" id="cvv" name="cvv" required>
                </div>
              </div>
            </div>
          </div>

          <!-- tranferencia bancaria -->
          <div v-else class="modal-body">
            <label for="bank-name">Banco:</label>
            <select class="form-control" id="bank-name" required>
              <option>BROU</option>
              <option>Itaú</option>
              <option>HSBC</option>
              <option>Santander</option>
              <option>Scotiabank</option>
            </select>
            <br>
            <div class="form-group">
              <label for="bank-acc-number">Número de cuenta</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-user"></i></span>
                </div>
                <input type="number" class="form-control" id="bank-acc-number" name="bank-acc-number" required>
              </div>
            </div>
          </div>



          <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-block" @click="confirmPurchase">Confirmar compra</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import PurchaseSuccess from './PurchaseSuccess.vue';

export default {
  name: 'PaymentModal',
  components: { PurchaseSuccess },
  props: {
    method: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      purchaseSuccess: false,
      waiting: false,
    }
  },

  methods: {
    confirmPurchase() {
      this.waiting = true;

      setTimeout(() => {
        this.waiting = false;
        this.purchaseSuccess = true;
      }, 2200);
    },

    paymentCompleted() {
      this.$emit('completed');
    },
  },
}
</script>

<style lang="scss" scoped>

.modal-content {
  border-color: #ececec;
  box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2) !important;
}
.modal {
  background: rgba(255, 255, 255, 0.623) !important;
}

/* Payment process - animation from https://tobiasahlin.com/spinkit/ */
.processing-payment {
  margin: 8rem auto;
}

.processing-payment p {
  margin-top: 2rem;
  color: #424242;
}

.sk-folding-cube {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  position: relative;
  -webkit-transform: rotateZ(45deg);
  transform: rotateZ(45deg);
}

.sk-folding-cube .sk-cube {
  float: left;
  width: 50%;
  height: 50%;
  position: relative;
  -webkit-transform: scale(1.1);
  -ms-transform: scale(1.1);
  transform: scale(1.1);
}
.sk-folding-cube .sk-cube:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffdc9a;
  -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
  animation: sk-foldCubeAngle 2.4s infinite linear both;
  -webkit-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
}
.sk-folding-cube .sk-cube2 {
  -webkit-transform: scale(1.1) rotateZ(90deg);
  transform: scale(1.1) rotateZ(90deg);
}
.sk-folding-cube .sk-cube3 {
  -webkit-transform: scale(1.1) rotateZ(180deg);
  transform: scale(1.1) rotateZ(180deg);
}
.sk-folding-cube .sk-cube4 {
  -webkit-transform: scale(1.1) rotateZ(270deg);
  transform: scale(1.1) rotateZ(270deg);
}
.sk-folding-cube .sk-cube2:before {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.sk-folding-cube .sk-cube3:before {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
.sk-folding-cube .sk-cube4:before {
  -webkit-animation-delay: 0.9s;
  animation-delay: 0.9s;
}
@-webkit-keyframes sk-foldCubeAngle {
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  } 25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  } 90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}

@keyframes sk-foldCubeAngle {
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  } 25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  } 90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}

</style>
