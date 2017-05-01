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
        </transition-group>
      </div>
      <div v-else>
        <br>
        <br>
        <div v-if="users.length == 1">
          Invite somebody by sending them a link to this page. Remember to tell them what's the password. Otherwise, they won't be able to connect.
          <br> <br>
          Keep in mind that users won't be able to see messeges sent while they were gone.
        </div>
        <div v-else>
          <br>
          <b>Oh! Somebody is here!</b> Write something, quickly! :)
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
input {
  color: #fff;
}

html, body {
  height: 100%;
}

.chat {
  margin-bottom: 100px;
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
  color: #eee;
  margin: 10px;
  padding: 13px;
  border-left: 10px solid;
  border-radius: 5px;
  word-wrap: break-word;
}

.user_count {
  padding: 10px;
  white-space: nowrap;
}

.message > .time_block {
  display: inline-block;
  float: right;
  color: #888;
}
</style>
