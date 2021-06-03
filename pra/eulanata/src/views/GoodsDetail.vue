<template>
  <div class="goodsDetail">
    <div class="header">
       <van-nav-bar title="货物详情" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <div v-for="(item, index) in routerData" :key="index">
        <div class="title"> 货物{{index + 1}} </div>
        <van-cell-group>
          <van-cell title="编号" :value="item.goodsNO" />
          <van-cell title="品牌商" :value="item.brand" />
          <van-cell title="日期" :value="item.checkTime" />
          <van-cell title="物料名" :value="item.basicProperty" />
          <van-collapse v-model="activeNames">
            <van-collapse-item title="扩展属性" name="1">{{item.expandProperty}}</van-collapse-item>
          </van-collapse>
          <van-cell title="单位" :value="item.unit" />
          <van-cell title="总数" :value="item.totalNO" />
          <van-cell title="不合格" :value="item.buhegeNO" />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsDetail',
  data() {
    return {
      routerData: [],
      id:null,
      activeNames:[1],
    }
  },
  methods: {
    returnPrev() {
      this.$router.push({name: 'ListDetail',params: {id: this.id}})
    }
  },
  created() {
    this.routerData = this.$route.params.routerData
    //暂时先这样解决，不一路带着ID走的话，返回ListDetail会出错
    this.id = this.$route.params.id
    console.log('routerData多少',this.routerData)
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
</style>