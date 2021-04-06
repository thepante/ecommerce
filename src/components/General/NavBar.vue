<template>
  <nav :key="$route.path" class="site-header navbar navbar-expand-lg navbar-light bg-light sticky-top transparent">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        eMERCADO
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navBar"
        aria-controls="navBar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navBar">
        <ul class="navbar-nav mr-auto w-100 justify-content-center">
          <li class="nav-item" v-for="(link, index) in links" :key="index">
            <router-link :to="link.path" class="nav-link">
              {{ link.name }}
            </router-link>
          </li>
        </ul>
        <UserMenu />
      </div>
    </div>
  </nav>
</template>

<script>
import UserMenu from './UserMenu.vue';

const updateNavStyle = () => document.querySelector('nav').classList.toggle('transparent', window.scrollY < 1);
window.addEventListener('scroll', updateNavStyle);

export default {
  name: 'NavBar',
  components: { UserMenu },
  data() {
    return {
      links: [
        {
          name: 'Inicio',
          path: '/',
        },
        {
          name: 'Productos',
          path: '/categories'
        },
        {
          name: 'Vender',
          path: '/sell',
        },
        {
          name: 'Carrito',
          path: '/cart',
        },
      ]
    }
  },
};
</script>

<style lang="scss" scoped>

* {
  -webkit-transition: all 0.4s ease;
  transition: all 0.4s ease;
}

nav {
  box-shadow: 0 0 8px #0000004a;
  z-index: 1000 !important;
}

li a {
  font-weight: 600;
  font-size: 0.9rem;

  &.router-link-active {
    color: #000000e6 !important;
    border-bottom: 0.2em solid #c0c0c0;
  }

}

.transparent {
  background: transparent !important;
  box-shadow: none !important;

  .navbar-brand {
    font-weight: 700 !important;
  }
}

.navbar-light .navbar-nav .active > .nav-link {
  border-bottom: 0.2em solid silver;
}

</style>
