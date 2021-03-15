<template>
  <div class="col-md-4">
    <input v-model="$store.state.filter.query" class="form-control form-control-sm ml-3" type="text" placeholder="Buscar..." aria-label="Buscar...">
    <i v-if="$store.state.filter.query" @click="clear" class="fas fa-times-circle" aria-hidden="true"></i>
  </div>
</template>

<script>
export default {
  name: 'TextFilter',
  props: {
    text: {
      type: String,
    }
  },
  methods: {
    clear() {
      this.$store.state.filter.query = '';
    },
  },
}
</script>

<style lang="scss" scoped>

div {
  z-index: 99;
}

@media (max-width: 767px) {
  div {
    width: 18rem !important;
    margin: 0 auto;
    margin-bottom: 1rem;
  }
}

input {
  float: left;
  width: 14rem;
  border: 0px;
  background: transparent !important;
  border-radius: 0px;
  border-bottom: 0.2rem solid silver;
  padding-right: 1.5rem;

  &:active,
  &:focus {
    box-shadow: none !important;
  }

  &:not(:placeholder-shown) {
    border-bottom-color: #814949;
  }
}

i {
  float: left;
  margin-left: -1.125rem;
  cursor: pointer;
  z-index: 999;
}

</style>
