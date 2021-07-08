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
import { getDate, userInfo, getToken, getOpenid } from '@/api/all.js'
import { setStorage, getLocal, setLocal, decodeurl } from '@/assets/js/utils.js'
  export default {
    data() {
      return {
        
      }
    },
    components: {
      Footer
    },
    created() {
      // getToken().then(res => {
      //   this.$store.commit('saveToken',res.token)
      //   setStorage("token",res.token)
      //   console.log('token--',res.token)
      // })

      // if (getLocal('openid')){
      
      // }else {
      //   this.getCode()
      // }
    },
    methods: {
      // getCode () { // 非静默授权，第一次有弹框
      //   const local = window.location.href
      //   const hash = window.location.hash 
      //   const o = decodeurl(local)
      //   const code = o.code // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      //   console.log('code',code)
      //   const baseurl = 'http://www.keeplong.vip/dist/'
      //   const url = baseurl + hash
      //   console.log(url)
      //   if (code == null || code === '') {
      //       window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.state.appid + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
      //   } else {
      //     console.log('else')
      //     this.getOpenId(code)
      //   }
      // },
      // getOpenId (code) {
      //   console.log(code)
      //   getOpenid({'code':code}).then(res => {
      //     console.log('openid的res',res)
      //     this.$store.commit('saveOpenid',res.open_id)
      //     setStorage('openid',res.open_id)
      //     setLocal('openid',res.open_id)
      //   })
        
      // },
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
