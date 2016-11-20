import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import { JSEncrypt } from 'jsencrypt'
import { Presence } from '../phoenix'

import { AES, enc as CryptoEnc } from 'crypto-js'

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
  messages: [],
  users: [],
  presence: {}
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
    state.messages.push({
      user_id: message.body[0],
      body: state.rsa.decrypt(message.body[1]),
      date: new Date()
    })

    // aAaAA this shouldn't be in a commit! SORRY! :<<<
    document.body.scrollTop = document.body.scrollHeight - 200
  },

  UPDATE_PRESENCE (state, presence) {
    state.presence = presence
  },

  UPDATE_USERS (state, users) {
    state.users = users.map((el) => {
      return {
        user_id: el.user_id,
        rsa_pub: AES.decrypt(
          el.rsa_pub, state.password
        ).toString(CryptoEnc.Utf8)
      }
    })
  }
}

const actions = {
  REQUEST_ENTRANCE ({dispatch, commit}, data) {
    const socket = openSocket()
    socket.onClose(() => commit('DISCONNECTED'))
    socket.onOpen(() => {
      const rsa = new JSEncrypt({default_key_size: 1024})
      commit('SAVE_RSA', rsa)

      const encryptedRsaPub = AES.encrypt(rsa.getPublicKey(), data.password).toString()

      const channel = prepareChannel({
        socket,
        encryptedRsaPub: encryptedRsaPub,
        roomId: data.room_id,
        password: data.password
      })

      channel.join().receive('ok', () => {
        commit('REMOVE_ERROR')
        commit('SAVE_CREDENTIALS', data)
        commit('SAVE_CHANNEL', channel)

        dispatch('HOOK_CHANNEL', channel)
        dispatch('SYNC_HREF_WITH_ROOM_ID')
      })
    })
  },

  HOOK_CHANNEL ({state, dispatch, commit}, channel) {
    channel.on('new_msg', payload => commit('RECEIVE_MESSAGE', payload))

    channel.on('presence_state', initial => {
      dispatch('UPDATE_PRESENCE', Presence.syncState(state.presence, initial))
    })

    channel.on('presence_diff', diff => {
      dispatch('UPDATE_PRESENCE', Presence.syncDiff(state.presence, diff))
    })
  },

  UPDATE_PRESENCE ({commit}, presence) {
    commit('UPDATE_PRESENCE', presence)
    if ((presence[''] || {}).metas) {
      commit('UPDATE_USERS', presence[''].metas)
    }
  },

  SYNC_HREF_WITH_ROOM_ID ({state}) {
    if (state.room_id !== roomIdFromHref()) {
      window.location.hash = state.room_id
    }
  },

  SEND_MESSAGE ({state, commit}, message) {
    const encMessage = state.users.map((user) => {
      let encrypt = new JSEncrypt()
      encrypt.setPublicKey(user.rsa_pub)

      return [
        user.user_id,
        encrypt.encrypt(message)
      ]
    })

    state.channel.push('new_msg', {body: encMessage})
  },

  async SUBMIT_ENTRANCE_REQUEST ({dispatch}, form) {
    await dispatch('REQUEST_ENTRANCE', {
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
