import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

import Vant from 'vant';
import 'vant/lib/index.css';
import { Toast, Dialog } from 'vant'

Vue.prototype.$toast = Toast;
Vue.prototype.$dialog = Dialog;

Vue.prototype.$axios = axios;

Vue.use(Vant);
// Vue.use(Vant).use(Tabbar).use(TabbarItem).use(List).use(PullRefresh).use(NavBar).use(Tab).use(Tabs).use(Devider)
// Vue.use(Card)

import { date } from '@/assets/js/utils.js'
Vue.prototype.$date = date

//[vue-router] Failed to resolve async component default: TypeError: onComplete is not a function 报这错才安的
require('es6-promise').polyfill();
require('es6-promise/auto');

window.addEventListener('popstate', function() {
  history.pushState(null, null, document.URL)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
