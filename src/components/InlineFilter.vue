<template>
  <span>{{ label }}</span>
  <span>
    <input v-on:keypress.enter="filter" id="rangeMin" type="number" min="0" placeholder="min." oninput="validity.valid || (value='');">
    hasta
    <input v-on:keypress.enter="filter" id="rangeMax" type="number" min="0" placeholder="máx." oninput="validity.valid || (value='');">
    -
    <button @click="filter" class="filter">filtrar</button>
    <button v-if="range.min || range.max != Infinity" @click="clear"><i class="fas fa-times-circle"></i></button>
  </span>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'InlineFilter',
  props: {
    label: {
      type: String,
    },
  },
  created() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'setRangeFilter'
        && !mutation.payload.min
        && mutation.payload.max == Infinity
        && this.inputMin
        && this.inputMax) {
        this.inputMin.value = null;
        this.inputMax.value = null;
      }
    });
  },
  setup() {
    const store = useStore();
    const range = computed(() => store.state.filter.range);
    return { store, range };
  },
  computed: {
    inputMin: () => document.getElementById('rangeMin'),
    inputMax: () => document.getElementById('rangeMax'),
  },
  methods: {
    filter() {
      const min = Number(this.inputMin.value);
      const max = Number(this.inputMax.value);

      if (!min && !max) {
        [this.inputMin, this.inputMax].forEach(input => input.style.borderBottomColor = '#dd7e7e');
        return;
      } else {
        [this.inputMin, this.inputMax].forEach(input => input.style.borderBottomColor = 'silver');
      }

      if (min && max && !(min < max)) {
        [this.inputMin, this.inputMax].forEach(input => input.value = null);
        return this.resetPriceRange();
      }

      this.store.dispatch('updateRangeFilter', { min, max });
    },

    clear() {
      this.inputMin.value = null;
      this.inputMax.value = null;

      this.store.dispatch('resetRangeFilter');
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
