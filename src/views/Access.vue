<template>
  <main role="main" class="home pb-5">
    <div class="container">

      <div class="wrapper">

        <div v-if="!!params && params.msg" :key="params" id="alertMsg" class="alert alert-warning login-msg">
          {{ params.msg }}
        </div>

        <div v-if="!loginOut" id="loginForm" @keyup.enter="proceedLogin" class="form-signin">
          <h2 class="text-center p-4">Iniciar sesión</h2>
          <div class="form-label-group">
            <input v-model="username" type="text" id="username" class="form-control" placeholder="Usuario">
            <label for="inputUser">Usuario</label>
          </div>
          <div class="form-label-group">
            <input v-model="password" type="password" id="password" class="form-control" placeholder="Contraseña">
            <label for="inputPassword">Contraseña</label>
          </div>
          <button @click="proceedLogin" type="submit" class="btn btn-lg btn-primary btn-block">Entrar</button>
        </div>

        <div id="oauth" class="container">
          <!--
          <p class="mt-5 mb-3 text-muted">testeando</p>
          -->
          <button @click="oauthSignIn" :disabled="!Vue3GoogleOauth.isInit">
            Ingresar con Google
          </button>
        </div>

      </div>

    </div>
  </main>
</template>

<script>
import { inject } from "vue";
import { useRoute } from 'vue-router';

export default {
  name: 'Access',
  data() {
    return {
      username: null,
      password: null,
      params: null,
      loginOut: null,
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.from = from;
    })
  },

  setup() {
    const Vue3GoogleOauth = inject('Vue3GoogleOauth');
    return { Vue3GoogleOauth };
  },

  mounted() {
    const route = useRoute();
    this.params = route.params;
    this.query  = route.query;

    if (this.$store.state.user && !this.params.logout) this.$router.push({ name: 'Home' });

    if (this.params.logout) {
      this.loginOut = true;
      this.logout();
    }
  },

  methods: {
    validateInput: input => input && input.trim() !== '' || false,

    proceedLogin() {
      const validForm = [this.username, this.password].every(this.validateInput);

      if (validForm) {
        localStorage.setItem('Logged-User', JSON.stringify({ username: this.username }));
        this.$store.commit('initStore');
        this.$router.push({
          path: this.query.continue || this.from.path,
        });
        this.loginOut = false;
      }

    },

    async oauthSignIn() {
      try {
        const user = await this.$gAuth.signIn();
        if (!user) return null;

        const profile = user.getBasicProfile();

        const data = {
          username: profile.getName(),
          firstNames: profile.getGivenName(),
          lastNames: profile.getFamilyName(),
          email: profile.getEmail(),
          picture: profile.getImageUrl(),
          oauth: true,
        };

        localStorage.setItem('Logged-User', JSON.stringify(data));
        this.$store.commit('initStore');
        this.$router.push({
          path: this.from.path,
        });
      } catch(error) {
        console.log(error)
        return null;
      }
      /* if (!requestedLogout) this.$router.push({ path: this.from.path }); */
    },

    async logout() {
      if (this.$store.state.user.oauth) {
        await this.$gAuth.signOut();
      }
      localStorage.removeItem('Logged-User');
      this.$store.state.user = null;
      this.loginOut = false;
      console.log("Logged out")
    },

  },
}
</script>

<style lang="scss" scoped>

.login-msg {
  position: relative !important;
  top: 2rem;
  text-align: center;
  width: auto !important;
}

#oauth {
  text-align: center;
  max-width: 330px;

   button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #007bff;
    border: 1px solid #007bff;
    color: #fff;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.2s;
    transition: 0.2s all ease-out;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 4px;
    margin-right: 1em;

    &:hover {
      background-color: #fff;
      color: #007bff;
      border-color: #007bff;
    }

    &:disabled {
      background: #fff;
      border-color: #ddd;
      color: #ddd;
      cursor: not-allowed;
    }
  }
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 1.5rem;
}

.form-signin .form-control:focus {
  z-index: 2;
}

.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.wrapper {
  margin: 0 auto;
  padding: 1rem 2rem;
  background: white;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2);
}

</style>
