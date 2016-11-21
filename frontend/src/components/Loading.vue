<template>
  <div id="loading">
    <img src="/static/konik.gif">
    <br />
    <h3>Loading...</h3>
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
  position: absolute;
  width: 100%;
  text-align: center;
}
</style>
