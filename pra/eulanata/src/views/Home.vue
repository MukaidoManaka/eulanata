<template>
  <div class="home">
    home
    <van-tabbar v-model="active">
      <van-tabbar-item to="home" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item to="about" icon="search" dot>随意</van-tabbar-item>
      <van-tabbar-item to="delivery" icon="friends-o" badge="5">送货</van-tabbar-item>
      <van-tabbar-item to="ore" icon="user-o" badge="20">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
          return {
              active: null
          }
      }
  }
</script>
