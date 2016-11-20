<template>
  <div class="container" id="app">
    <logo></logo>
    <loading v-if="!submitEntranceAllow"></loading>
    <entrance v-if="!authorized" v-show="submitEntranceAllow"></entrance>
    <chat v-if="authorized"></chat>
  </div>
</template>

<script>
import Logo from './components/Logo'
import Loading from './components/Loading'
import Entrance from './components/Entrance'
import Chat from './components/Chat'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: { Entrance, Logo, Chat, Loading },
  computed: mapState(['authorized', 'submitEntranceAllow'])
}
</script>

<style>
@import 'assets/milligram.css'
</style>
