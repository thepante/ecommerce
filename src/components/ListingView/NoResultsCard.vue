<template>
  <div class="alert-warning alert-dismissible p-4 fade show col" role="alert" style="position: relative;">
    <strong>Sin resultados</strong> <br>
    <span v-html="message"></span>
    <button type="button" class="close" @click="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NoResultsCard',
  props: {
    message: {
      type: String,
    }
  },
  methods: {
    close() {
      this.$emit('closed', true);
    },
  },
}
</script>

