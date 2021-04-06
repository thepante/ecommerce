<template>
  <span>{{ label }}</span>
  <span>
    <input
      v-on:keypress.enter="filter"
      id="rangeMin"
      type="number"
      min="0"
      :value="modelValue.min || ''"
      placeholder="min."
      oninput="validity.valid || (value='');"
    >
    hasta
    <input
      v-on:keypress.enter="filter"
      id="rangeMax"
      type="number"
      min="0"
      :value="modelValue.max"
      placeholder="máx."
      oninput="validity.valid || (value='');"
    >
    -
    <button @click="filter" class="filter">filtrar</button>
    <button v-if="modelValue.min || modelValue.max != Infinity" @click="clear"> <i class="fas fa-times-circle"></i> </button>
  </span>
</template>

<script>
export default {
  name: 'InlineFilter',
  props: {
    modelValue: Object,
    label: {
      type: String,
    }
  },
  emits: ['update:modelValue'],
  computed: {
    min: () => document.getElementById('rangeMin'),
    max: () => document.getElementById('rangeMax'),
  },
  methods: {
    filter() {
      const inputs = [this.min, this.max];
      const min = Number(this.min.value);
      const max = Number(this.max.value);

      if (!min && !max) {
        inputs.forEach(input => input.style.borderBottomColor = '#dd7e7e');
        return;
      } else {
        inputs.forEach(input => input.style.borderBottomColor = 'silver');
      }

      if (min && max && !(min < max)) {
        inputs.forEach(input => input.value = null);
        return this.resetPriceRange();
      }

      this.$emit('update:modelValue', {
        min: min || 0,
        max: max || Infinity,
      });
    },

    clear() {
      this.min.value = null;
      this.max.value = null;

      this.$emit('update:modelValue', {
        min: 0,
        max: Infinity,
      });
    },
  },
}
</script>

<style lang="scss" scoped>

input,
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button,
button {
  background: transparent;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: textfield !important;
  outline: none;
  border: none;
  margin: 0;
}

input {
  font-weight: 700;
  width: 3.2rem;
  text-align: center !important;
  border-bottom: 0.15rem solid silver;
}

button {
  padding: 0 5px;
  font-weight: 700;
  transition: all .2s ease-out;

  &:hover {
    color: #b49786;
  }
}

.filter {
  border: 0.1rem solid transparent;
  border-radius: 0.25rem;
  transition: all .2s ease-out;

  &:hover {
    border-color: #79363657 !important;
  }
}

</style>
