<template>
 <div class="login" :style="background">
     <div class="opacity">
         <div class="logo">
            <img :src="logo" alt="">
            <span>凯隆智能</span>
        </div>
        <van-form class="form">
            <div class="icon icon_1">
                <van-field v-model="username" placeholder="请输出账号" type="text"></van-field>
                <van-icon name="user-circle-o" class="userIcon"></van-icon>
            </div>
            <div class="icon">
                <van-field class="password" v-model="password" placeholder="请输出密码" type="password"></van-field>
                <van-icon name="credit-pay" class="userIcon"></van-icon>
            </div>
            <div class="wawa">
                <a href="javascript:void(0);" @click="register">立即注册</a>
                <a href="javascript:void(0);" @click="forgetPwd">忘记密码</a>
            </div>
            <div>
                <van-button color="{'rgb(29, 98, 240)', 'rgb(25, 213, 253)'}" type="info" class="loginBtn" block round @click="login">登 录</van-button>
            </div>
        </van-form>
        <div class="wechat">
            <img :src="wechat" alt="" @click="wxLogin">
        </div>
     </div>
 </div>
</template>

<script>
    export default  {
        name: 'Login',
        data() {
            return {
                bg5:require('@/assets/image/login_bg5.jpg'),
                logo:require('@/assets/image/logo.png'),
                wechat:require('@/assets/image/f_we_chat.png'),
                username: '',
                password: '',
                url: '',
                //设置背景图
                background: {
                    backgroundImage: `url(${require('@/assets/image/login_bg5.jpg')})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                },
                params:{
                    username:'',
                    password:''
                }
            }
        },
       methods: {
           login() {
               this.params.username = this.username
               this.params.password = this.password
               console.log(this.params.username.split('').length,this.password.split('').length)
               if (this.params.username.split('').length <= 10 && this.params.password.split('').length >= 8) {
                   this.$router.push({name: 'Home',params:{id:9999}})
               }else {
                   this.$toast('请检查一下你输的什么')
               }
           },
           wxLogin() {
               this.$toast.success('微信登录成功！')
               this.$router.push({name: 'Home',params: {id:10000}})
           },
           register() {
               this.$toast.loading({
                   message:'请稍微，马上注册成功',
                //    forbidClick: true
               })
           },
           forgetPwd() {
               console.log('wang ji mi ma')
               this.$dialog.alert({
                   message:'你确定忘记密码了？'
               }).then(() => {
                   this.$toast('忘了也不给改')
               })
           }
       },
       created() {
           //必须拼好了之后给background赋值  才能生效
           this.url = `url(${this.bg5})`
       }
    }
</script>

<style scoped lang="less">
    .login {
        width: 100%;
        height: 100%;
        .opacity {
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,.2);
        }
    }
    .logo {
        width: 80px;
        margin: 0 auto .8rem;
        padding-top: .8rem;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
            width: 84px;
            height: 84px;
        }
    }
    .van-field:after {
        content: '';
        width: 100%;
        border-bottom: 2px solid skyblue;
    }
    .wawa {
        display: flex;
        justify-content: space-between;
        a {
            margin: 10px;
        }
    }
    .form {
        width: 90%;
        margin: 0 auto;
        .loginBtn {
            height: .44rem;
            font-size: 16px;
            margin-top: .2rem;
            // background: linear-gradient(to bottom right, #2aa3df , #2ac3df);
        }
        .loginBtn:before {
            // background: linear-gradient(to bottom right, #2aa3df , #2ac3df);
        }
        .icon {
            position: relative;
        }
        .icon .userIcon {
            position: absolute;
            left: 10px;
            top: 12px;
            font-size: 20px;
        }
        .icon .van-cell {
            border-radius: .2rem;
        }
        .icon_1 {
            margin-bottom: .2rem;
        }
        // .van-field__control {
        //     padding-left: 15px;
        // } 
        .van-field {
            padding-left: 35px;
        }
    }
    .wechat {
        display: flex;
        justify-content: center;
        margin-top: .2rem;
        img {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: .5rem;
        }
    }
    .button {
        width: 100%;
        height: 0.44rem;
        background-image: linear-gradient(to right,rgba(29, 98, 240,.5), rgba(25, 213, 253,.5));
        border:0;
        border-radius: 10px;
        margin-top: .1rem;
    }
</style>