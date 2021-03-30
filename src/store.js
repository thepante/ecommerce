import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      title: 'eMercado',
      subtitle: 'Todo lo que busques está aquí',
      count: 0,
      SHIPPING_METHODS: {
        standard: { cost: 5, days: [12, 15] },
        express: { cost: 7, days: [5, 8] },
        premium: { cost: 15, days: [2, 5] },
      },
    }
  },

  mutations: {

    initStore(state) {
      const userData = localStorage.getItem('Logged-User') ? JSON.parse(localStorage.getItem('Logged-User')) : null;
      userData && (state.user = userData);

      // console.log(state.user)
    },

    saveUser(state) {
      localStorage.setItem('Logged-User', JSON.stringify(state.user));
    },

    logout(state) {
      localStorage.removeItem('Logged-User');
      state.user = null;
    },

  },

});

export default store;
