import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(VueResource)
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
  },

  INVALID_PASSWORD (_) {
    window.alert('invalid password')
  }
}

const actions = {
  REQUEST_PASSWORD_VERIFICATION ({commit}, password) {
    Vue.http.get('http://localhost:4000/ping').then((response) => {
      if (response.body === 'pong') {
        commit('APPLY_PASSWORD', password)
      } else {
        commit('INVALID_PASSWORD')
      }
    }, (response) => {
      window.alert('server error. is it running?')
    })
  },

  async APPLY_PASSWORD ({dispatch, commit}, password) {
    await dispatch('REQUEST_PASSWORD_VERIFICATION', password)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
