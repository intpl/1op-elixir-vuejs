<template>
  <div>
    <div class="row chat">
      <div v-if="messages.length > 0" class="column column-70">
        <transition-group name="list">
          <div v-for="message in messages"
            :key="message"
            :style="parseColor(message.user_color)"
             class="message">

            <div class="time_block">
							{{ parseTime(message.date) }}
            </div>

            <em>{{ message.body }}</em>
          </div>
        </transition>
      </div>
      <div v-else>
        <br>
        <br>
        <br>
        Write something! Don't be shy!
        <br>
        <div v-if="users.length == 1">
          ... and invite somebody, maybe? :)
        </div>
        <div v-else>
          <b>Oh! Somebody is here!</b> Write something!
        </div>
      </div >
    </div>

    <div class="container footer">
      <div class="row">
        <div class="user_count">
          users online: <b>{{ users.length }}</b>
        </div>

        <input
          maxlength="240"
          autofocus
          placeholder="(240 characters. Enter sends)"
          type="text"
          v-model="newMessage"
          v-on:keyup.13="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'chat',
  data () { return { newMessage: '' } },
  computed: mapState({
    messages: 'messages',
    users: 'users'
  }),

  methods: {
    ...mapActions(['SEND_MESSAGE']),

    parseColor (color) {
      const bigint = parseInt(color, 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255

      return {
        'border-color': ('#' + color),
        'background-color': `rgba(${r}, ${g}, ${b}, 0.1)`
      }
    },

    parseTime (date) {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2)
    },

    sendMessage () {
      this.SEND_MESSAGE(this.newMessage)
      this.newMessage = ''
    }
  }
}
</script>

<style scoped>
.input {
  clear: both;
  position: relative;
  z-index: 10;
  height: 3em;
  margin-top: -3em;
}

html, body {
  height: 100%
}

.chat {
  padding-bottom: 200px;
}

.footer{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
}

.list-enter-active, .list-leave-active {
  transition: all 0.4s;
}
.list-enter, .list-leave-active {
  opacity: 0;
  transform: translateY(30px);
}

.message {
  color: #333;
	margin: 10px;
  padding: 10px;
  border-left: 10px solid;
  border-radius: 5px;
  word-wrap: break-word;
  -webkit-box-shadow: 0px 0px 16px -5px rgba(0,0,0,0.57);
  -moz-box-shadow: 0px 0px 16px -5px rgba(0,0,0,0.57);
  box-shadow: 0px 0px 16px -5px rgba(0,0,0,0.57);
}

.user_count {
  padding: 10px;
  white-space: nowrap;
}

.message > .time_block {
  display: inline-block;
  float: right;
  color: #aaa;
}
</style>
