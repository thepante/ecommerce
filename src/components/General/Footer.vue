<template>
  <footer class="text-muted">
    <div class="container">
      <p class="float-right" style="margin-top:15px;">
        <a class="btn-up" title="Volver arriba" @click="scrollTop">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" width="22" height="22" xml:space="preserve">
            <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
            l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
            C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"/>
          </svg>
        </a>
      </p>
      <p class="font-weight-bold">Sitio ficticio de comercio electrónico desarrollado con Vue</p>
      <p>Continuación del proyecto de DW, Jóvenes a Programar 2020</p>
      <p><a target="_blank" href="https://thepante.github.io/ecommerce/Letra.pdf">Letra del obligatorio</a> | <a target="_blank" href="https://github.com/thepante/ecommerce">Repositorio</a></p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    scrollTop() {
      window.scroll({ top: 0, behavior: 'smooth' });
    },
  }
};
</script>

<style lang="scss" scoped>

footer {
  padding-top: 3rem;
  padding-bottom: 3rem;
  font-size: 0.9rem;

  p {
    margin-bottom: 0.25rem;
  }

  a {
    color: #5f9590;
    cursor: pointer;
  }
}

.btn-up {
  opacity: 0.5;
  transition: opacity 0.5s;

  &:hover {
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.5s;
  }
}

</style>
