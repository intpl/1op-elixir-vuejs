<template>
  <header>
    <span class="bigAndBold"><span class="grey"> / </span>1op.eu <span class="grey"> / </span></span>
    <span><b>Extremely</b> private way to send you messages and passwords in realtime. Fully encrypted using <b>RSA-2048</b> for messages and <b>AES-256</b> to transmit their public keys.</span>
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

<style lang="scss" scoped>
  header {
    padding-top: 20px;

    .bigAndBold {
      font-size: 1.8em;
      font-weight: bolder;
      color: #fff;
    }
    .grey {
      color: #222;
    }
  }
  .error {
    color: red
  }
</style>
