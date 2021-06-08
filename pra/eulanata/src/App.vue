<template>
  <div id="app" class="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        active: 0
      }
    }
  }
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #2c3e50; */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: .16rem;
  background-color: #F9F9F9;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
