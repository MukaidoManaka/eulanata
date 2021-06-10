<template>
  <div class="bindUser">
      <div class="box" v-if="show">
          <img :src="img1" alt="">
          <p>是否绑定 {{this.company}} ?</p>
          <van-button type="primary" @click="bind" class="button">确 认</van-button>
      </div>
      <div class="loading" v-if="!show">
          <van-loading color="#0f6" size="40" vertical>加载中...</van-loading>
      </div>
  </div>
</template>

<script>
import { decodeurl, getUrlParam } from '@/assets/js/utils'
export default {
    data() {
        return {
            img1: require('@/assets/image/wechat_success_icon.png'),
            company: '嘉兴凯隆智能有限公司',
            show: false,
        }
    },
    methods: {
        bind() {
            setTimeout(() => {
                this.$toast.success('绑定成功')
                this.$router.push({name: 'Home'})
            },1000)
        },
        // getCode () { // 非静默授权，第一次有弹框
        //     const code = GetUrlParam('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
        //     const local = window.location.href
        //     if (code == null || code === '') {
        //         window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + window.APPID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
        //     } else {
        //         this.getOpenId(code) //把code传给后台获取用户信息
        //     }
        // },
        // getOpenId (code) { // 通过code获取 openId等用户信息，/api/user/wechat/login 为后台接口
        //     // let _this = this
        //     this.$http.post('/api/user/wechat/login', {code: code}).then((res) => {
        //         let datas = res.data
        //         if (datas.code === 0 ) {
        //             console.log('成功')
        //         }
        //     }).catch((error) => {
        //         console.log(error)
        //     })
        // }
    },
    created() {
        setTimeout(() => {
            this.company = '请问破案每次看v女巫i七篇公司'
            this.show = !this.show
        },3000)

        console.log(window.location.href)
        let url = 'https://www.abcd.com/user/edit?age=10&name=zhangsan&sex=男&openid=200'
        console.log('11',decodeurl(url))
        console.log('22',getUrlParam('code'))

        this.$axios.get('/').then(res => {
            console.log('res',res)
        })
    }
}
</script>

<style scoped lang="less">
    .bindUser {
        width: 100%;
        height: 100%;
    }
    .box {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: .8rem;
        padding: .1rem;
        img {
            width: 1rem;
            height: 1rem;
            border-radius: 1rem;
        }
        p {
            margin: .2rem 0;
        }
    }
    .button {
        width: 100px;
        border-radius: 5px;
    }
    .loading {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>