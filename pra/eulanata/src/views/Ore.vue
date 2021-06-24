<template>
  <div class="ore">
    <div class="header">
      <div class="touxiang">
        <img :src="touxiang" alt="" />
        <p>讴歌_</p>
      </div>
      <div class="order">
        <div class="order_item">
          <p> {{$store.state.count_no}} </p>
          <p>未发货</p>
        </div>
        <div class="order_item">
          <p> {{$store.state.count_ing}} </p>
          <p>未完成</p>
        </div>
        <div class="order_item">
          <p> {{$store.state.count_finished}} </p>
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
        <van-field label="送货人" placeholder="请输入姓名" @blur="changeName" v-model="name" input-align="right" clearable :error="nameError" :error-message="nameErrorMsg"/>
        <van-field label="手机号" placeholder="请输入手机号" @blur="changePhone" v-model="phone" input-align="right" clearable :error="phoneError" :error-message="phoneErrorMsg"/>
        <!-- <van-cell title="我的姓名" value="张三" />
        <van-cell title="我的电话" value="18408246666" /> -->
        <!-- <van-cell title="生成订单时间" value="2021-09-09" /> -->
        
        <van-cell title="我的消息" value="查看" />
        <van-cell title="我的公司" value="凯隆智能" />
        <!-- <van-field clickable label="公司" :value="value" placeholder="选择公司" :is-link="true" input-align="right" @click="changeCompany" class="company"/> -->
      </van-cell-group>
      <!-- <van-button type="danger" @click="logout" class="logout">退 出</van-button> -->
    </div>
    <!-- <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="company"
        @cancel="showPicker = false"
        @confirm="confirmCompany"
      />
    </van-popup> -->
    <van-overlay :show="show" @click="overlay">
      <div class="cross">
        <van-icon name="cross" @click="closeSearch"/>
      </div>

    </van-overlay>
    <Footer />
  </div>
</template>

<script>
  import Footer from '@/components/Footer'
  import { editName, editPhone } from '@/api/all.js'
  import { checkMobile } from '@/assets/js/utils.js'
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
            company: [],
            value: '选择公司查看送货单',
            showPicker: false,
            show: false,
            name: `${this.$store.state.name}`,
            phone: `${this.$store.state.phone}`,
            nameError: false,
            nameErrorMsg: '',
            phoneError: false,
            phoneErrorMsg: '',
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
      },
      changeCompany() {
        this.showPicker = true
      },
      confirmCompany(val,index) {
        console.log('val--index',val,index)
        this.value = val
        this.showPicker =false
      },
      overlay() {

      },
      closeSearch() {

      },
      changeName(e) {
        if(this.name === '') {
          this.$toast.fail('送货人姓名不能为空！')
          this.nameError = true
          // this.nameErrorMsg = "姓名不能为空"
        }else {
          this.nameError = false
          editName({name: this.name}).then(res => {
            console.log('修改名字',res)
          })
        }
      },
      changePhone() {
        if(checkMobile(this.phone)) {
          this.phoneError = false
          editPhone({phone: this.phone}).then(res => {
            console.log('修改手机号',res)
          })
        }else {
          this.phoneError = true
          // this.phoneErrorMsg = "请填写正确的手机号"
          this.$toast.fail('请填写正确的手机号！')
        }
        
      }
    },
    created() {
      this.company = this.$store.state.company
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
    font-size: 18px;
  }
}
.order {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 14px;
  .order_item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .order_item>p:first-child {
    font-size: 20px;
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