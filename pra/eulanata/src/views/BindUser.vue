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
            },1000)
        }
    },
    created() {
        setTimeout(() => {
            this.company = '请问破案每次看v女巫i七篇公司'
            this.show = !this.show
        },3000)
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