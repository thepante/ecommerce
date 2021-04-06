<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="checkoutModalLabel">Compra realizada con éxito</h5>
      <button type="button" class="close" data-dismiss="modal" @click="closeModal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div id="receipt" class="modal-body receipt">
      <p class="alert-success">
        {{user.username}}, gracias por su compra! <br>
        <strong>Su pedido será enviado en {{user.address.country}} a:</strong> <br>
        {{user.address.street}} N°{{user.address.number}}, esq. {{user.address.corner}} <br>
        Le llegará dentro de {{purchase.data.since}} a {{purchase.data.until}} días por envío {{purchase.data.method}}.
      </p>
      <table class="table products-summary">
        <tr>
          <th width="60%">Producto</th>
          <th width="10%">Cantidad</th>
          <th width="30%">Subtotal</th>
        </tr>

        <tr v-for="(product, index) in purchase.products" :key="index">
          <td>{{ product.name }}<br><small class="badge badge-light text-muted">{{ formattedPrice(product.unitCost) }}</small></td>
          <td>x{{ product.count }}</td>
          <td class="price">{{ formattedPrice(product.unitCost * product.count) }}</td>
        </tr>

      </table>
      <table class="table costs-summary">
        <tr><th width="50%">Totales</th><th width="50%"></th></tr>
        <tr><td>Productos:</td><td class="price">{{ formattedPrice(purchase.total.products) }}</td></tr>
        <tr><td>Descuento:</td><td class="price">{{ purchase.total.discount > 0 ? formattedPrice(purchase.total.discount) : '-' }}</td></tr>
        <tr><td>Costo de envío:</td><td class="price">{{ formattedPrice(purchase.total.shipping) }}</td></tr>
        <tr><th>Total final:</th><th class="price">{{ formattedPrice(purchase.total.final) }}</th></tr>
      </table>
      <hr>
      <div class="receipt-details">
        Fecha y hora de compra: {{datetime}}<br>
        Pago con {{purchase.data.method == 'card' ? 'tarjeta de crédito' : 'transferencia bancaria'}}:
        **** {{purchase.data.account.value.substr(0, 4)}}
      </div>
    </div>
    <div class="modal-footer text-center">
      <button type="button" @click="continueShopping" class="btn btn-light ml-auto" data-dismiss="modal"><i class="fas fa-shopping-cart"></i> Continuar comprando</button>
      <button type="button" @click="printReceipt" class="btn btn-light mr-auto"><i class="fas fa-file-invoice"></i> Descargar recibo</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'PurschaseSuccess',

  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const purchase = computed(() => store.state.purchase);
    return { store, user, purchase };
  },

  computed: {
    datetime() {
      const today = new Date();
      const day = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const time = today.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
      return `${day} / ${time}`;
    },
  },

  methods: {
    formattedPrice(price) {
      return `${this.purchase.data.currency} ${price.asPrice()}`;
    },

    printReceipt() {
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
    },

    closeModal() {
      this.$emit('completed');
    },

    continueShopping() {
      this.$router.push('categories');
    },
  },

}
</script>

<style lang="scss" scoped>

.receipt .alert-success {
  padding: .5rem 1rem;
  border-radius: .3rem;
}

.receipt table tr:first-of-type {
  border-top: 2px dashed #ececec;
}

.receipt td:not(:first-of-type) {
  vertical-align: middle;
}

.receipt hr {
  border-top: 2px dashed #ececec;
}

.receipt .receipt-details {
  text-align: center;
  color: #979797;
  font-size: .9rem;
}

.receipt .products-summary th:nth-of-type(2),
.receipt .products-summary td:nth-of-type(2) {
  text-align: center;
}

.receipt .products-summary th:last-of-type,
.receipt .products-summary td:last-of-type,
.receipt .costs-summary th:last-of-type,
.receipt .costs-summary td:last-of-type {
  text-align: right;
}

</style>
