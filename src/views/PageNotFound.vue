<template>
  <div class="container">
    <div class="wrapper p-3 p-sm-5">
      <h3>404 - No encontrado</h3>
      <p>El recurso al que has intentado acceder no existe.</p>
      <hr>
      <router-link to="/" tag="button" class="btn btn-block btn-secondary">Ir al inicio</router-link>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>

h3 {
  font-weight: 600;
}

hr {
  margin-bottom: 2.25rem;
}

.container {
  max-width: 900px;
}

.btn {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.wrapper {
  text-align: center;
  border-radius: .3rem;
  box-shadow: 0 3px 7px rgba(154,160,185,.05), 0 10px 40px rgba(166,173,201,.1);
}

@media (min-width: 768px) {
  .wrapper {
    margin: 1rem 3rem;
  }
}

</style>
