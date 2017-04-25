<template>
  <div id="loading">
    <img src="/static/loader.gif">
    <br />
    <h3>Generating your RSA key...</h3>
  </div>
</template>

<script>
  export default {
    name: 'Loading'
  }
</script>

<style scoped>
#loading {
  margin-top: 20px;
  position: relative;
  width: 100%;
  text-align: center;
}
</style>
