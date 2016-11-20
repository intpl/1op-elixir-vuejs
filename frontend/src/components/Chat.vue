<template>
  <div>
    <div class="row chat">
      <div v-if="messages.length > 0" class="column column-70">
        <blockquote v-for="message in messages">
          {{ message.date.getHours() }}:{{ message.date.getMinutes()}}
          <b>{{ message.user_id }}</b>:
          <em>{{ message.body }}</em>
        </blockquote>
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
        <div class="column column-100">

          online:
          <b v-for="u in users"> {{ u.user_id }} </b>

          <input
            autofocus
            placeholder="(somewhat around 200 characters)"
            type="text"
            v-model="newMessage"
            v-on:keyup.13="sendMessage" />

        </div>
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
}
</style>
