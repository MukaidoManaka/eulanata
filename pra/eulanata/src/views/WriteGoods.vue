<template>
  <div class="writeGoods">
    <div class="header">
       <van-nav-bar title="货物填写" left-text="返回" right-text="保存" @click-right="save" left-arrow @click-left="returnPrev"></van-nav-bar>
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
            <van-collapse-item title="扩展属性" :name="item.basicProperty">{{item.expandProperty}}</van-collapse-item>
          </van-collapse>
          <van-cell title="单位" :value="item.unit" />
          <van-cell title="应发数量" :value="item.totalNO" />
          <van-field v-model="digit" type="digit" label="实发数量" required input-align="right" placeholder="请输入" />
          <!-- <van-cell title="实发数量" :value="item.buhegeNO" /> -->
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WriteGoods',
  data() {
    return {
      routerData: [],
      id: null,
      //当前展开的折叠面板 有什么值，就展开对应name
      activeNames: [],
      digit: null
    }
  },
  methods: {
    returnPrev() {
      this.$router.push({name: 'WriteOrder',params: {id: this.id}})
    },
    save() {
      this.$toast('保存')
    }
  },
  created() {
    this.routerData = this.$route.params.routerData
    //暂时先这样解决，不一路带着ID走的话，返回ListDetail会出错
    this.id = this.$route.params.id
    console.log('routerData多少',this.routerData)
    
    //不用var居然会报i not defined
    for (var i in this.routerData) {
      this.activeNames.push(this.routerData[i].basicProperty)
    }
    console.log('折叠面板数组值',this.activeNames)
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
</style>