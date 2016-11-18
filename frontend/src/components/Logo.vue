<template>
  <header>
    <div v-if="error">{{ error }}</div>
  </header>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'logo',
    computed: mapState(['error'])
  }
</script>

<style scoped></style>
