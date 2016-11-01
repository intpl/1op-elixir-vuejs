import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  password: '',
  authorized: false,
  messages: []
}

const mutations = {
  APPLY_PASSWORD (state, password) {
    state.authorized = true
    state.password = password
  }
}

export default new Vuex.Store({
  state,
  mutations
})
