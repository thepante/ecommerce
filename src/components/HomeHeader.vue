<template>
  <div id="header" class="home container py-5">
    <div class="m-5">
      <div class="row">
        <h3>Tu ecommerce favorito</h3>
      </div>
      <div class="row">
        <p>Esta web es una herramienta generada para fines estrictamente educativos.<br>
          No realiza compras o ventas reales a terceros. Tampoco administra datos personales o de clientes. <br>
          Todo lo expresado en este dominio no tiene validez comercial.
        </p>
      </div>
      <div class="row logo-jap">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeHeader',
  data() {
    return {
      initOffset: 5,
    }
  },
  computed: {
    header: () => document.getElementById('header'),
    japLogo: () => document.querySelector('.logo-jap'),
  },
  methods: {
    handleScroll() {
      if (window.scrollY < 350) {
        const scrolled = window.scrollY / 3;
        this.header.style.setProperty('--illu-offset', `-${this.initOffset + scrolled / 16}em`);
        this.japLogo.style.opacity = (100 - Math.abs(scrolled)) / 100;
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

<style lang="scss" scoped>

</style>
