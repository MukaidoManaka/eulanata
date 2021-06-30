<template>
  <div class="goodsDetail">
    <div class="header">
       <van-nav-bar title="商品发货详情" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <div v-for="(item, index) in data" :key="item.id">
        <div class="title"> 商品{{index + 1}} </div>
        <van-cell-group>
          <van-cell title="单据编号" :value="item.djbh" />
          <van-cell title="商品编码" :value="item.spbm" />
          <van-cell title="交货日期" :value="item.jhrq" />
          <van-cell title="商品名称" :value="item.spmc" />
          <van-collapse v-model="activeNames">
            <van-collapse-item title="扩展属性" :name="item.spmc">{{item.spjbsx}}</van-collapse-item>
          </van-collapse>
          <div class="relative">
            <van-cell title="应发" :value="item.require_num"/>
            <span class="span">{{item.spjldw}}</span>
          </div>
          <div class="relative">
            <van-cell title="实发" :value="item.recv_num"/>
            <span class="span">{{item.spjldw}}</span>
          </div>
        </van-cell-group>
      </div>
      <div class="image" v-if="display">
        <img :src="img" alt="">
        <p>没有查到相关货物数据</p>
      </div>
    </div>
    <div class="footer">

    </div>
  </div>
</template>

<script>
import { goodsDetail } from '@/api/all.js'
export default {
  name: 'goodsDetail',
  data() {
    return {
      data: [],
      //当前展开的折叠面板 有什么值，就展开对应name
      activeNames: [],
      recv_num: null,
      djbh: '', //单据编号
      searchParams: {
        djbh: ''
      },
      company: '',
      id: 0,
      img: require('@/assets/404_images/404.png'),
      display: false,
    }
  },
  methods: {
    returnPrev() {
      this.$router.push({name: 'ListDetail',params: {id: this.$route.params.id,status: this.$route.params.status}})
    },
  },
  created() {
    this.id = this.$route.params.id

    goodsDetail({"order":this.id}).then(res => {
      console.log('res',res)
      this.data = res

      if(res.length == 0) {
        console.log("空空空空空空")
        this.display = true
      }

      //不用var会报i not defined,把i当vue data里的变量
      for (var i in this.data) {
        this.activeNames.push(this.data[i].spmc)
      }
      console.log('折叠面板数组值',this.activeNames)
    })
    
  }
}
</script>

<style scoped lang="less">
  .goodsDetail {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
.goodsDetail .section {
  flex: 1;
  overflow-y: scroll;
}
.title {
  font-size: .18rem;
  padding: .1rem .16rem;
  font-weight: 700;
}
.writeGoods .van-cell--required::before {
  top:14px;
  font-size: 18px;
}
.relative {
  position: relative;
  padding-right: .3rem;
  .span {
    position: absolute;
    right: .2rem;
    z-index: 10;
    top: .1rem;
  }
}
.footer {
  width: 100%;
  height: 0.2rem;
}
.image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  img {
    width: 100%;
  }
  p {
    color: #aaa;
    margin-top: .1rem;
  }
}
</style>