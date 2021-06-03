<template>
  <div class="ore">
    <div class="header">
      <div class="touxiang">
        <img :src="touxiang" alt="" />
        <p>愤怒の审判</p>
      </div>
      <div class="order">
        <div class="order_item">
          <p>5</p>
          <p>待审核</p>
        </div>
        <div class="order_item">
          <p>3</p>
          <p>进行中</p>
        </div>
        <div class="order_item">
          <p>58</p>
          <p>已成交</p>
        </div>
      </div>
    </div>
    <div class="section">
      <van-cell-group>
        <van-cell title="送货人" value="阿玛忒拉斯" />
        <van-cell title="生成订单时间" value="阿玛忒拉斯" />
        <van-cell title="生成订单时间" value="阿玛忒拉斯" />
        <van-cell title="生成订单时间" value="阿玛忒拉斯" />
      </van-cell-group>
      <van-button type="danger" @click="logout" class="logout">退 出</van-button>
    </div>
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
    name: 'Ore',
    data() {
        return {
            active: null,
            touxiang: require('@/assets/image/bingguo.gif')
        }
    },
    methods: {
      logout() {
        this.$dialog.alert({
          message:"确定要登出么？"
        }).then(() => {
          this.$router.push('/login')
        })
      }
    }
  }
</script>

<style scoped lang="less"> 
.ore {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  width: 100%;
  height: 2.5rem;
  background-color: lightblue;
  display: flex;
  flex-direction: column;
  color: #fff;
}
.touxiang {
  display: flex;
  height: 1.8rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: .75rem;
    border: 1px solid rgba(0,0,0,.15);
    margin: .1rem 0;
  }
  p {
    font-size: .18rem;
  }
}
.order {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: .14rem;
  .order_item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .order_item>p:first-child {
    font-size: .2rem;
  }
}
.section {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: .2rem;
  // justify-content: space-between;
}
.logout {
  width: 90%;
  margin: .2rem 5%;
  border-radius: .2rem;
}
.footer {
  height: .5rem;
}
</style>