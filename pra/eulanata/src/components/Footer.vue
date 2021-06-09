<template>
  <div class="footer">
    <van-tabbar v-model="active" active-color="#06AE56">
      <van-tabbar-item icon="home-o" @click="goHome">主页</van-tabbar-item>
      <!-- <van-tabbar-item icon="search" @click="goAbout">搜索</van-tabbar-item> -->
      <!-- <van-tabbar-item icon="friends-o" @click="message">消息</van-tabbar-item> -->
      <van-tabbar-item icon="user-o" @click="goOre">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      active: 0
    }
  },
  methods: {
    goHome() {
      this.active = 0
      this.$router.push({name: 'Home', params: {
        id:10000
      }})
    },
    // goAbout() {
    //   this.active = 1
    //   this.$router.push({name: 'About', params: {
    //     id:10000
    //   }})
    // },
    // message() {
    //   this.active = 1
    //   this.$router.push({name: 'Message', params: {
    //     id:10000
    //   }})
    // },
    goOre() {
      this.active = 1
      this.$router.push({name: 'Ore', params: {
        id:10000
      }})
    }
  }
}
</script>

<style scoped lang="less">
.footer {
    width: 100%;
    height: 0.5rem;
    line-height: 0.5rem;
  }
</style>