<template>
  <div class="entrance">
    <form v-on:submit.prevent>
      <input type="text" input @keyup.enter="APPLY_PASSWORD($event.target.value)" placeholder="Enter the password..."/>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'entrance',
  computed: mapState(['password']),
  methods: mapMutations(['APPLY_PASSWORD'])
}
</script>

<style scoped></style>
