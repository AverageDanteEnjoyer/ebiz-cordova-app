
import { createStore } from 'framework7/lite';

const store = createStore({
  state: {
    products: [
      {
        id: '1',
        title: 'Apple iPhone 8',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
      },
      {
        id: '2',
        title: 'Apple iPhone 8 Plus',
        description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
      },
      {
        id: '3',
        title: 'Apple iPhone X',
        description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
      },
    ],
    user: sessionStorage.getItem('user'),
    orders: [],
  },
  getters: {
    products({ state }) {
      return state.products;
    },
    user({ state }) {
      return state.user;
    },
    isAuthenticated({ state }) {
      return !!state.user;
    },
    orders({ state }) {
      return state.orders;
    },
  },
  actions: {
    addProduct({ state }, product) {
      state.products = [...state.products, product];
    },
    login({ state }, userData) {
      state.user = userData;
      sessionStorage.setItem('user', JSON.stringify(userData));
    },
    logout({ state }) {
      state.user = null;
      sessionStorage.removeItem('user');
    },
    addOrder({ state }, order) {
      state.orders = [...state.orders, order];
    },
  },
})
export default store;
