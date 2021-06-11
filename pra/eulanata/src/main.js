import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

import Vant from 'vant';
import 'vant/lib/index.css';
// import { Tabbar, TabbarItem, List, PullRefresh, NavBar, Tab, Tabs, Devider } from 'vant'
import { Toast, Dialog } from 'vant'

Vue.prototype.$toast = Toast;
Vue.prototype.$dialog = Dialog;

Vue.prototype.$axios = axios;
// Vue.prototype.$axios = axios.create({
//   timeout: 10000,
//   // baseURL: ''
// });

Vue.use(Vant);
// Vue.use(Vant).use(Tabbar).use(TabbarItem).use(List).use(PullRefresh).use(NavBar).use(Tab).use(Tabs).use(Devider)
// Vue.use(Card)

//[vue-router] Failed to resolve async component default: TypeError: onComplete is not a function 报这错才安的
require('es6-promise').polyfill();
require('es6-promise/auto');

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
