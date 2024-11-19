
import { createStore } from 'framework7/lite';

const store = createStore({
  state: {
    user: sessionStorage.getItem('user'),
  },
  getters: {
    user({ state }) {
      return state.user;
    },
    isAuthenticated({ state }) {
      return !!state.user;
    },
  },
  actions: {
    login({ state }, userData) {
      state.user = userData;
      sessionStorage.setItem('user', JSON.stringify(userData));
    },
    logout({ state }) {
      state.user = null;
      sessionStorage.removeItem('user');
    },
  },
})

export default store;
