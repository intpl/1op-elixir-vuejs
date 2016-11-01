import Vue from 'vue'
import App from './App'

import store from './vuex/store'

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
