import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import { JSEncrypt } from 'jsencrypt'

import { roomIdFromHref,
  openSocket,
  prepareChannel } from '../helpers'

Vue.use(VueResource)
Vue.use(Vuex)

const state = {
  password: '',
  error: '',
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

  REMOVE_ERROR (state) {
    state.error = ''
  },

  DISCONNECTED (state) {
    state.error = 'something went wrong...'
    state.authorized = false
    state.password = ''
  },

  SAVE_CHANNEL (state, channel) {
    state.channel = channel
  },

  SAVE_RSA (state, rsa) {
    state.rsa = rsa
  },

  RECEIVE_MESSAGE (state, message) {
    state.messages.push(
      state.rsa.decrypt(message.body)
    )
  }}

const actions = {
  REQUEST_PASSWORD_VERIFICATION ({dispatch, commit}, data) {
    const socket = openSocket()
    socket.onClose(() => commit('DISCONNECTED'))
    socket.onOpen(() => {
      dispatch('GENERATE_RSA')

      const channel = prepareChannel(socket, data.room_id, data.password)
      channel.join().receive('ok', () => {
        commit('REMOVE_ERROR')
        commit('SAVE_CREDENTIALS', data)
        commit('SAVE_CHANNEL', channel)

        dispatch('HOOK_CHANNEL', channel)
        dispatch('SYNC_HREF_WITH_ROOM_ID')
      })
    })
  },

  GENERATE_RSA ({commit}) {
    commit('SAVE_RSA', new JSEncrypt({default_key_size: 1024}))
  },

  HOOK_CHANNEL ({commit}, channel) {
    channel.on('new_msg', payload => commit('RECEIVE_MESSAGE', payload))
  },

  SYNC_HREF_WITH_ROOM_ID ({state}) {
    if (state.room_id !== roomIdFromHref()) {
      window.location.hash = state.room_id
    }
  },

  SEND_MESSAGE ({state, commit}, message) {
    const encryptedMessage = state.rsa.encrypt(message)
    state.channel.push('new_msg', {body: encryptedMessage})
  },

  async SUBMIT_ENTRANCE_REQUEST ({dispatch}, form) {
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
