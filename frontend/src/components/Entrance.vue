<template>
  <div class="entrance">
    <form v-on:submit.prevent="SUBMIT_ENTRANCE_REQUEST($event.target)">
      <input name="roomIdField" type="text" placeholder="room id, eg. asdasdasd" v-if="!room_id">
      <input name="passwordField" type="password" placeholder="Enter your password..."/>
      <input type="submit">
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'entrance',
  computed: mapState(['room_id']),
  methods: mapActions(['SUBMIT_ENTRANCE_REQUEST'])
}
</script>

<style scoped></style>
