import Vue from 'vue'
import App from './App.vue'
import {router}  from './routes/index.js'
import axios from 'axios'
import VueCookies from "vue-cookies";


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// 로그인 정보를 쿠키
Vue.use(VueCookies);
//쿠키의 만료일은 1일이다. 1d = 1일 로그아웃시에는 즉시 삭제
Vue.$cookies.config("1d");


Vue.config.productionTip = false
Vue.prototype.$http = axios;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')