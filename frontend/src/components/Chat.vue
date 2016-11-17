<template>
  <div class="chat">
    <h3>you are in :)</h3>
		<ol>
      online:
			<li v-for="u in users">
				{{ u.user_id }}
			</li>
		</ol>
		<ul>
			<li v-for="message in messages">
				{{ message }}
			</li>
		</ul>
  <input type="text" v-model="newMessage" v-on:keyup.13="sendMessage">
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

<style scoped></style>
