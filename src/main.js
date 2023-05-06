import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/Jessica.scss' // Jessica css
import App from './App.vue'

import store from './store'
import router from './router'

import './assets/icons' // icon
import './authToken'

Vue.config.productionTip = false


Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
