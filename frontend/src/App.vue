<template>
  <div id="app">
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
