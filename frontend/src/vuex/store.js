import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import { roomIdFromHref, syncHrefWithRoomId } from '../helpers'
import sha512 from 'js-sha512'
import { Socket } from '../phoenix.js'

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
  },

  SAVE_CHANNEL (state, channel) {
    state.channel = channel
  },

  RECEIVE_MESSAGE (state, message) {
    state.messages.push(message.body)
  }
}

const actions = {
  REQUEST_PASSWORD_VERIFICATION ({dispatch, commit}, data) {
    const socket = new Socket('ws://localhost:4000/socket')
    socket.connect()

    const channel = socket.channel(
      'room:' + data.room_id,
      {params: {sha512: sha512(data.password)}}
    )

    // TODO: what if password is wrong or the server isn't running? :)
    syncHrefWithRoomId(data.room_id)

    commit('SAVE_CREDENTIALS', data)
    commit('SAVE_CHANNEL', channel)
    dispatch('HOOK_CHANNEL', channel)
  },

  HOOK_CHANNEL ({commit}, channel) {
    channel.on('new_msg', payload => commit('RECEIVE_MESSAGE', payload))
    channel.join()
  },

  SEND_MESSAGE ({state, commit}, message) {
    state.channel.push('new_msg', {body: message})
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
