<template>
  <div class="footer">
    <!-- <van-tabbar v-model="nowTab" active-color="#06AE56" placeholder>
      <van-tabbar-item icon="home-o" name="home" @click="goHome" class="">主页</van-tabbar-item>
      <van-tabbar-item icon="search" @click="goAbout">搜索</van-tabbar-item>
      <van-tabbar-item icon="friends-o" @click="message">消息</van-tabbar-item>
      <van-tabbar-item icon="user-o" name="ore" @click="goOre">我的</van-tabbar-item>
    </van-tabbar> -->
    <div class="item" @click="goHome" :class="{active: currentIndex === 0 }" >
      <van-icon name="home-o" size="22"></van-icon>
      <span>首页</span>
    </div>
    <div class="item" @click="goOre" :class="{active: currentIndex === 1 }">
      <van-icon name="user-o" size="22"></van-icon>
      <span>我的</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      // currentIndex: 0
    }
  },
  props:['currentIndex'],
  methods: {
    goHome() {
      this.$router.push('home')
    },
    // goAbout() {
    //   this.nowTab = 1
    //   this.$router.push({name: 'About', params: {
    //     id:10000
    //   }})
    // },
    // message() {
    //   this.nowTab = 1
    //   this.$router.push({name: 'Message', params: {
    //     id:10000
    //   }})
    // },
    goOre() {
      this.$router.push('ore')
    }
  },
  created() {
    // this.nowTab = this.$route.params.nowTabbar
  }
}
</script>

<style scoped lang="less">
.footer {
    width: 100%;
    height: 0.5rem;
    line-height: 0.5rem;
    display: flex;

  }
.item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 12px;
    line-height: .2rem;
  }
  .van-icon {
    // font-size: 18px;
  }
}
.active {
  color: #06AE56;
}
</style>