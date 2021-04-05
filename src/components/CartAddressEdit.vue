<template>
  <div class="card-body">
    <h6 class="mb-2 mb-0">Dirección de envío:</h6>

    <div v-show="isEditing || !user.address" id="editAddress" class="needs-validation">
      <div id="cancelEdit" v-if="user.address" @click="() => isEditing = false" title="Cancelar cambios"><i class="fas fa-times-circle"></i></div>
      <label for="country">País:</label>
      <select class="form-control" ref="country" required>
        <option>Uruguay</option>
        <option>Argentina</option>
        <option>Brasil</option>
        <option>Chile</option>
        <option>Paraguay</option>
      </select>
      <br>
      <div class="row">
        <div class="col-8 form-label-group">
          <input type="text" ref="street" :value="user.address ? user.address.street : ''" placeholder="Calle" class="form-control" required>
          <label for="address-st">Calle</label>
        </div>
        <div class="col form-label-group">
          <input type="text" ref="number" :value="user.address ? user.address.number : ''" placeholder="Puerta" class="form-control" required>
          <label for="address-number">Puerta</label>
        </div>
      </div>
      <br>
      <div class="form-label-group">
        <input type="text" ref="corner" :value="user.address ? user.address.corner : ''" placeholder="Esquina" class="form-control" required>
        <label for="address-corner">Esquina</label>
      </div>
      <button @click="saveAddress" id="saveShippingBtn" type="button" class="btn btn-primary btn-block mt-4 checkout" >
        Establecer datos de envío <i class="fas fa-check"></i>
      </button>
    </div>

    <div v-if="user.address" v-show="!isEditing">
      <div id="editButton" @click="() => isEditing = true" title="Editar dirección">
        <i class="fas fa-edit"></i>
      </div>
      <div id="displayAddress">
        {{user.address.country}}: <br>
        {{user.address.street}} {{user.address.number}}, {{user.address.corner}}
      </div>
    </div>

  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'CartAddressEdit',
  data() {
    return {
      isEditing: false,
    }
  },

  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    return { store, user };
  },

  computed: {
    form: () => document.getElementById('editAddress'),

    inputs() {
      return {
        country: this.$refs.country,
        street: this.$refs.street,
        number: this.$refs.number,
        corner: this.$refs.corner,
      }
    },

  },

  methods: {

    isFormValid() {
      return Object.values(this.inputs).every(input => input.value.trim() !== '');
    },

    saveAddress() {
      if (this.isFormValid()) {
        const addressInfo = {};

        for (const [key, input] of Object.entries(this.inputs)) {
          addressInfo[key] = input.value;
        }

        this.$store.state.user.address = addressInfo;
        this.$store.commit('saveUser');
        this.isEditing = false;
      } else {
        this.form.classList.add('was-validated');
      }
    },

  },
}
</script>

<style lang="scss" scoped>

#displayAddress {
  font-family: 'Roboto', sans-serif;
  font-size: .8rem;
  font-weight: 700;
  color: #686868;
}

#editButton,
#cancelEdit {
  position: relative;
  float: right;
  top: .2rem;
  cursor: pointer;
  color: #535353;
  font-size: .8rem;
  opacity: 0.6;
  transition: all .2s ease-in-out;
}

#editButton:hover,
#cancelEdit:hover {
  opacity: 1;
}

#address-country option {
  font-family: 'Roboto', sans-serif;
}

/* Floating labels fix: cart -> datos de envío */
.form-label-group.col label,
.form-label-group.col-8 label {
  padding-left: 1.7rem;
}

</style>
