<template>
  <ul class="navbar-nav">
    <li class="nav-item dropdown">
      <a
        v-if="user"
        class="nav-link dropdown-toggle"
        id="userMenu"
        data-toggle="dropdown"
        aria-expanded="false"
      >
        <img :src="user.picture || require('@/assets/user.png')" />
        {{ user.username }}
      </a>
      <div v-if="user" class="dropdown-menu dropdown-menu-right" aria-labelledby="userMenu">
        <router-link to="/history" class="dropdown-item disabled">Historial de compras</router-link>
        <router-link to="/profile" class="dropdown-item">Ver mi perfil</router-link>
        <div class="dropdown-divider"></div>
        <span @click="logout" class="dropdown-item">Cerrar sesión</span>
      </div>

      <router-link v-else class="nav-link" to="/login" aria-expanded="false">
        Ingresar <i class="fas fa-sign-in-alt"></i>
      </router-link>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'UserMenu',
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const filter = computed(() => store.state.filter);

    return { store, user, filter };
  },
  methods: {
    test() {
      this.store.dispatch('updateRangeFilter', { min: 20, max: 13000 })
    },

    logout() {
      /* this.store.commit('logout'); */
      /* this.$router.push({ name: 'Home', params: { userid: 123 }}); */
      this.$router.push({ name: 'Login', params: { logout: "oauth" }});
    },
  }
}
</script>

<style lang="scss" scoped>

li > a {
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-right: 5px;
  margin-top: -1px;
}

i.fas {
  position: absolute;
  top: 0.8rem;
  margin-left: 0.35rem;
}

.dropdown-item {
  cursor: pointer;

  &.active, &:active {
    background-color: #e3ddd1;
  }
}


.dropdown-menu {
  box-shadow: 0 0 16px #0000001a;

  a, span {
    font-size: 0.9rem;
  }

  .disabled {
    color: silver;
  }
}

</style>
