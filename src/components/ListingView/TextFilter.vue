<template>
  <div class="col-md-4">
    <input
      type="text"
      @input="onChanged"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="placeholder"
      class="form-control form-control-sm ml-3"
    >
    <i v-if="modelValue" @click="clear" class="fas fa-times-circle" aria-hidden="true"></i>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: 'Buscar...',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    function onChanged(e) {
      emit('update:modelValue', e.currentTarget.value);
    }

    function clear() {
      emit('update:modelValue', '');
    }

    return { onChanged, clear };
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
