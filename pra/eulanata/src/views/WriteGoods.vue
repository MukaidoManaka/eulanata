<template>
  <div class="writeGoods">
    <div class="header">
       <van-nav-bar title="商品发货填写" left-text="返回" right-text="保存" @click-right="save" left-arrow @click-left="returnPrev"></van-nav-bar>
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
          <van-cell title="应发" :value="item.require_num"/>
          <!-- <div class="relative">
            <van-cell title="应发" :value="item.require_num"/>
            <span>{{item.spjldw}}</span>
          </div> -->
          <div class="relative">
            <van-field v-model="recv_num" label="实发" required input-align="right" placeholder="请输入" />
            <span>{{item.spjldw}}</span>
          </div>
          
          <!-- <van-cell title="实发数量" :value="item.buhegeNO" /> -->
        </van-cell-group>
      </div>
    </div>
    <div class="footer">

    </div>
  </div>
</template>

<script>
import { goodsDetail } from '@/api/all.js'
export default {
  name: 'WriteGoods',
  data() {
    return {
      data: [],
      //当前展开的折叠面板 有什么值，就展开对应name
      activeNames: [],
      recv_num: null,
      djbh: '', //单据编号
      searchParams: {
        djbh: ''
      }
    }
  },
  methods: {
    returnPrev() {
      this.$router.push({name: 'WriteOrder',params: {item: this.$route.params.item,status: this.$route.params.status}})
    },
    save() {
      this.$toast('保存')
    }
  },
  created() {
    this.searchParams.djbh = this.$route.params.djbh
    goodsDetail(this.searchParams).then(res => {
      console.log('res',res)
      this.data = res

      //不用var居然会报i not defined
      for (var i in this.data) {
        this.activeNames.push(this.data[i].spmc)
      }
      console.log('折叠面板数组值',this.activeNames)
    })
    
    
  }
}
</script>

<style scoped lang="less">
  .writeGoods {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
.writeGoods .section {
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
  span {
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
</style>