<template>
 <div class="login" :style="background">
     <div class="opacity">
         <div class="logo">
            <img src="@/assets/image/logo.jpg" alt="">
            <span>凯隆智能</span>
        </div>
        <van-form class="form">
            <div class="icon">
                <van-field v-model="username" placeholder="请输出账号" type="text"></van-field>
                <van-icon name="user-circle-o" class="userIcon"></van-icon>
            </div>
            <div class="icon">
                <van-field class="password" v-model="password" placeholder="请输出密码" type="password"></van-field>
                <van-icon name="credit-pay" class="userIcon"></van-icon>
            </div>
            <div class="wawa">
                <a href="#" @click="register">立即注册</a>
                <a href="#" @click="forgetPwd">忘记密码</a>
            </div>
            <div>
                <van-button class="loginBtn" block round type="info" @click="login">登 录</van-button>
                <!-- <img :src="button" alt="" class="buttonImg"> -->
            </div>
        </van-form>
     </div>
 </div>
</template>

<script>
    export default  {
        name: 'login',
        data() {
            return {
                bg1:require('@/assets/image/login_bg1.jpg'),
                bg2:require('@/assets/image/login_bg2.jpg'),
                bg3:require('@/assets/image/login_bg3.jpg'),
                bg4:require('@/assets/image/login_bg4.jpg'),
                bg5:require('@/assets/image/login_bg5.jpg'),
                bg6:require('@/assets/image/login_bg6.jpg'),
                bg7:require('@/assets/image/login_bg7.jpg'),
                bg8:require('@/assets/image/login_bg8.jpg'),
                button:require('@/assets/image/phone-btn.png'),
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
                   this.$router.push('/ore',{
                       id: 1,
                       username: this.params.username
                   })
               }else {
                   this.$toast('请检查一下你输的什么')
               }
           },
           register() {
               this.$toast.loading({
                   message:'请稍微，马上注册成功',
                   forbidClick: true
               })
           },
           forgetPwd() {
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
        margin: 0 auto 80px;
        padding-top: 80px;
        font-size: 20px;
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
            height: 44px;
            font-size: 16px;
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
        // .van-field__control {
        //     padding-left: 15px;
        // } 
        .van-field {
            padding-left: 35px;
        }
    }
</style>