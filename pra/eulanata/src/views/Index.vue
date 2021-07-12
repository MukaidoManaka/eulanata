<template>
  <div class="index">
    <div class="header">
      <van-nav-bar title="主页" color="white">
        <template #right>
          <van-icon name="search" size="18" />
        </template>
      </van-nav-bar>
    </div>
    <div class="section">
      <div class="swipeWraper">
        <!-- <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item><img :src="swipeImg1" alt=""></van-swipe-item>
          <van-swipe-item><img :src="swipeImg2" alt=""></van-swipe-item>
          <van-swipe-item><img :src="banner2" alt=""></van-swipe-item>
        </van-swipe> -->
      </div>
      <div class="msg">
        <van-notice-bar scrollable text="技术是开发它的人的共同灵魂。" />
        <van-notice-bar scrollable text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"/>
      </div>
      <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">关于我们</van-divider>
      <p> 嘉兴凯隆智能科技股份有限公司成立于2011年，国家高新技术企业，公司位于浙江省平湖市，占地面积25000平方米，现有员工80余名。是一家专门从事研发、设计、制造、销售塑胶、五金配件，智能化配件及产品，工厂智能制造装备及系统的民营企业。
       长期以来，公司坚持以技术、品质和规范提升为基础，坚持以物联网+平台为发展方向，坚持以先进智能化生产为手段，致力于打造成为全球旅行装备用品、智能制造系统应用及解决方案的提供商。公司现拥有数控加工中心、精雕设备、线切割、电火花及车铣刨各种精加工设备，可自主设计制造塑料模具、冷冲模具、锌合金模具、铝模和五金配件加工及装配，同时配备齐全的物理测试实验室、塑胶原料改性筛选、测试实验室等先进的研发和测试装备，支撑起健全的品质管理体系，建立了产品设计、质量、性能、可靠性等全流程的品质检测评估系统。
       作为国家高新技术企业，凯隆人秉持“创新、敬业、诚信、共赢”的企业核心价值观，在全体同仁的不懈努力下，凯隆先后获得了50多项专利、软件著作权及荣誉证书等，终端产品客户遍及全球各地。已初步完成企业自身数字化改造，逐步把下属塑胶、五金制造工厂打造成为名副其实的智能化工厂，并将实际运行的经验，推广到同行业，乃至跨行业运用，最终将公司转型为一家致力于为各行业提供智能制造解决方案的公司，为中国的小微企业转型升级提供支持。</p>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
export default {
  name: 'Index',
  components: {
    Footer
  },
  data() {
    return {
      // swipeImg1: require("@/assets/image/solution02.png"),
      // swipeImg2: require("@/assets/image/solution04.png"),
      // banner2: require("@/assets/image/banner2.jpg"),
      false: true
    }
  }
}
</script>

<style scoped lang="less">
  .index {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  
  .section {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }
  .swipeWraper {
    width: 100%;
  }
  .my-swipe img {
    width: 100%;
  }
  .msg {
    width: 100%;
    // height: 0.4rem;
  }

  .header .van-nav-bar {
    background-color: #6cf;
  }
</style>