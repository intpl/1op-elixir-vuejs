<template>
  <div class="container" id="app">
    <logo></logo>
    <transition name="fade">
      <loading v-if="!submitEntranceAllow"></loading>
    </transition>

    <transition name="fade">
      <entrance v-if="!authorized" v-show="submitEntranceAllow"></entrance>
    </transition>

    <transition name="fade">
      <chat v-if="authorized"></chat>
    </transition>
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s
}
.fade-enter, .fade-leave-active {
  opacity: .1
}
@import 'assets/milligram.css'

</style>
