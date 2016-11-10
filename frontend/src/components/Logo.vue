<template>
  <header>
    <h4>1op :)</h4>
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
