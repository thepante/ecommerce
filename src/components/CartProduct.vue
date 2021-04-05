<template>
  <tr>
    <td><img :src="require(`@/${image}`)" /></td>
    <td>{{ name }}</td>
    <td class="price unitCost">{{ currency }} {{ unitCost.asPrice() }}</td>
    <td>
      <button @click="changeAmount(-1)">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-dash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
        </svg>
      </button>
      <input
        ref="amount"
        type="number"
        min="1"
        class="productCount"
        :value="modelValue"
        @input="onChanged"
        oninput="validity.valid || (value='');"
      />
      <button @click="changeAmount(1)">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </button>
    </td>
    <td class="price"> {{ currency }} <span subtotal>{{ subtotal }}</span></td>
    <td><span @click="removeItem(index)" :title="`Eliminar '${name}' del carrito`"><i class="fas fa-times"></i></span></td>
  </tr>
</template>

<script>
export default {
  name: 'CartProduct',
  props: {
    modelValue: Number,
    name: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    unitCost: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],

  computed: {
    input() {
      return this.$refs.amount;
    },

    subtotal() {
      return (this.unitCost * Number(this.modelValue)).asPrice();
    },
  },

  methods: {
    onChanged() {
      this.$emit('update:modelValue', (this.input.value > 0) ? this.input.value : 1);
    },

    changeAmount(step) {
      const newValue = Number(this.input.value) + step;
      if (newValue > 0) {
        this.$emit('update:modelValue', newValue);
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.price,
.productCount {
  font-family: 'Roboto', sans-serif;
}

table * {
  vertical-align: middle;
}

thead th,
tbody input,
tbody td:last-child,
tbody td:nth-child(3),
tbody td:nth-child(4),
tbody td:nth-child(5) {
  text-align: center;
}

tfoot th:first-child {
  text-align: right;
}

tfoot th:last-child {
  text-align: center;
}

tfoot td,
tbody td:nth-child(2),
tbody td:nth-child(5) {
  font-weight: 700;
}

td:last-of-type {
  position: relative;
}
td:last-of-type span {
  line-height: 4rem;
  font-size: 1rem;
  cursor: pointer;
  opacity: .5;
  transition: all .3s ease-in-out;
  z-index: 999;
}

tr:hover td:last-of-type span {
  opacity: 1;
}

tr td:last-of-type span i {
  width: 24px;
  height: 24px;
}

img {
  height: 3rem;
  width: 3.75rem;
}

input {
  width: 2rem;
}

input,
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  background: #f3f3f3;
  border-radius: .2rem;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: textfield !important;
  outline: none;
  border: none;
  margin: 0;
}

button {
  background: transparent;
  appearance: none;
  border: none;
  padding: .2rem !important;
  color: #525252;
}

i.fa-times {
  transition: all .2s ease-in-out;
}

i.fa-times:hover {
  color: #a83a3a !important;
}

tbody tr {
  transition: all .2s ease-in-out;
}

tr td {
  transition: all .2s ease-in-out;
}

tr td img {
  mix-blend-mode: multiply;
}

tbody:hover tr {
  opacity: 0.7;
}

tbody tr:hover {
  opacity: 1;
  background: #fafafa8a;
  box-shadow: 0 4px 10px -1px rgba(154,160,185,.1);
}

tbody tr:hover + tr td {
  border-top-color: transparent !important;
}

</style>
