<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div class="footer">
      <van-tabbar v-model="active">
        <van-tabbar-item to="home" icon="home-o">主页</van-tabbar-item>
        <van-tabbar-item to="about" icon="search">随意</van-tabbar-item>
        <van-tabbar-item to="delivery" icon="friends-o">送货</van-tabbar-item>
        <van-tabbar-item to="ore" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'About',
    data() {
      return {
        active: null
      }
    }
  }
</script>