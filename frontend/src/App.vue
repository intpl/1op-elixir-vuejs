<template>
  <div class="container" id="app">
    <logo></logo>
    <entrance v-if="!authorized"></entrance>
    <chat v-if="authorized"></chat>
  </div>
</template>

<script>
import Logo from './components/Logo'
import Entrance from './components/Entrance'
import Chat from './components/Chat'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: { Entrance, Logo, Chat },
  computed: mapState(['authorized'])
}
</script>

<style>
@import 'assets/milligram.css'
</style>
