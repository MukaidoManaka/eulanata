<template>
  <div id="app" class="app">
    <keep-alive :include="$store.state.keepalive">
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <Footer /> -->
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import { getDate, userInfo } from '@/api/all.js'
import { setStorage } from '@/assets/js/utils.js'
  export default {
    data() {
      return {
        
      }
    },
    components: {
      Footer
    },
    created() {
      setStorage('openid','G00012openid')
      getDate().then(res => {
        console.log('这是App.vue里面的请求',res)
      })

      userInfo().then(res => {
        console.log('这是App.vue里面的请求',res)
      })
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
