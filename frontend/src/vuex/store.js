import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import { roomIdFromHref, roomIdToHref } from '../helpers'

Vue.use(VueResource)
Vue.use(Vuex)

const state = {
  password: '',
  authorized: false,
  room_id: roomIdFromHref(),
  messages: []
}

const mutations = {
  SAVE_CREDENTIALS (state, data) {
    state.authorized = true
    state.room_id = data.room_id
    state.password = data.password
  },

  INVALID_PASSWORD (_) {
    window.alert('invalid password')
  }
}

const actions = {
  REQUEST_PASSWORD_VERIFICATION ({commit}, data) {
    Vue.http.get('http://localhost:4000/ping').then((response) => {
      if (response.body === 'pong') {
        roomIdToHref(data.room_id)
        commit('SAVE_CREDENTIALS', data)
      } else {
        commit('INVALID_PASSWORD')
      }
    }, (response) => {
      window.alert('server error. is it running?')
    })
  },

  async SUBMIT_ENTRANCE_REQUEST ({dispatch, _commit}, form) {
    await dispatch('REQUEST_PASSWORD_VERIFICATION', {
      room_id: (form.roomIdField || {}).value || roomIdFromHref(),
      password: form.passwordField.value
    })
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
