<template>
  <div class="ore">
    <div class="header">
      <div class="touxiang">
        <img :src="touxiang" alt="" />
        <p>讴歌_</p>
      </div>
      <div class="order">
        <div class="order_item">
          <p>5</p>
          <p>待发货</p>
        </div>
        <div class="order_item">
          <p>3</p>
          <p>送货中</p>
        </div>
        <div class="order_item">
          <p>58</p>
          <p>已完成</p>
        </div>
      </div>
      <div class="share">
        <van-icon name="share-o" class="share_icon" @click="share" />
        <van-share-sheet
          v-model="showShare"
          title="立即分享给好友"
          :options="options"
          @select="shareOne"
        />
      </div>
    </div>
    <div class="section">
      <van-cell-group>
        <van-cell title="送货人" value="凯隆智能" />
        <van-cell title="生成订单时间" value="2021-09-09" />
        <van-cell title="生成订单时间" value="2021-09-09" />
        <van-cell title="生成订单时间" value="2021-09-09" />
        <van-cell title="我的消息" value="凯隆智能" />
      </van-cell-group>
      <van-button type="danger" @click="logout" class="logout">退 出</van-button>
    </div>
    <Footer />
  </div>
</template>

<script>
  import Footer from '@/components/Footer'
  export default {
    name: 'Ore',
    components: {
      Footer
    },
    data() {
        return {
            // active: null,
            touxiang: require('@/assets/image/touxiang.jpeg'),
            showShare: false,
            options: [
              [
                { name: '微信', icon: 'wechat' },
                { name: '朋友圈', icon: 'wechat-moments' },
                { name: '微博', icon: 'weibo' },
                { name: 'QQ', icon: 'qq' },
              ],
              [
                { name: '复制链接', icon: 'link' },
                { name: '分享海报', icon: 'poster' },
                { name: '二维码', icon: 'qrcode' },
                { name: '小程序码', icon: 'weapp-qrcode' },
              ],
            ],
        }
    },
    methods: {
      logout() {
        this.$dialog.alert({
          message:"确定要登出么？"
        }).then(() => {
          this.$router.push('/login')
        })
      },
      share() {
        this.showShare = !this.showShare
      },
      shareOne(option,index) {
        this.$toast('分享成功！')
        console.log("分享的option",option)
        console.log("分享的index",index)
        this.showShare = !this.showShare
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
  position: relative;
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
.share {
  position: absolute;
  right: .2rem;
  top: .2rem;
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