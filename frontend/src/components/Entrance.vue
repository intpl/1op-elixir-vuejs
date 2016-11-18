<template>
  <form v-on:submit.prevent="SUBMIT_ENTRANCE_REQUEST($event.target)">
    <div class="row">
      <div class="column column-100">
        <div v-if="!room_id">
          <label for="r">Your desired room id ( 1op.eu/... )</label>
          <input name="roomIdField" id="r" type="text" placeholder="room id, eg. asdasdasd">
        </div>

        <label for="p">Your secret password (it will never be sent away from your browser)</label>
        <input name="passwordField" id="p" type="password" placeholder="Enter your password..."/>

        <center>
          <input class="button-outline" type="submit">
        </center>
      </div>
    </div>
  </form>
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
