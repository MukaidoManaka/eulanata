<template>
  <div>
    <h1>送货</h1>
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
      name: 'Delivery',
      data() {
        return {
            active: null
        }
      }
    }
</script>

<style scoped lang="less">

</style>