import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store.js';
import GAuth from 'vue3-google-oauth2';

const gAuthConfig = {
  clientId: '631540126574-g1496s63kt1vprfla0snr4bm5g3rqcbc.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account',
}

createApp(App)
  .use(router)
  .use(store)
  .use(GAuth, gAuthConfig)
  .mount('#app')
