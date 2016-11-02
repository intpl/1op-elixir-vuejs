<template>
  <div class="chat">
    <h1>you are in :)</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'chat',
  computed: mapState(['password'])
}
</script>

<style scoped></style>
