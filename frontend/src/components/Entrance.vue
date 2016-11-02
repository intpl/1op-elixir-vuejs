<template>
  <div class="entrance">
    <form v-on:submit.prevent>
      <input type="text" input @keyup.enter="APPLY_PASSWORD($event.target.value)" placeholder="Enter the password..."/>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'entrance',
  methods: mapActions(['APPLY_PASSWORD'])
}
</script>

<style scoped></style>
