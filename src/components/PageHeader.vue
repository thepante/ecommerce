<template>
  <div id="header" class="container">
    <div class="row">
      <h3>{{ title }}</h3>
    </div>
    <div class="information">
      <p class="row justify-content-center">
        <slot>
        </slot>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true,
    }
  },
  computed: {
    header: () => document.getElementById('header'),
  },
  methods: {
    handleScroll() {
      if (window.scrollY < 160) {
        this.header.style.opacity = ((100 + this.header.offsetHeight / 4) - Math.abs(window.scrollY)) / 100;
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style lang="scss">

</style>
