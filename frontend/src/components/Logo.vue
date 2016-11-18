<template>
  <header>
    <div class="error" v-if="error">{{ error }}</div>
  </header>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'logo',
    computed: mapState(['error'])
  }
</script>

<style scoped>
.error {
  color: red
}
</style>
