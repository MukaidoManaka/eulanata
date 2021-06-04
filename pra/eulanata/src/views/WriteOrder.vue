<template>
  <div class="writeOrder">
    <div class="header">
       <van-nav-bar title="填写订单" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <van-cell-group>
        <van-cell title="送货商名称" :value="data.supplierName" />
        <van-cell title="送货商ID" :value="id" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="送货日期" :value="data.arrivalDate" />
        <van-cell title="送货单号" :value="data.arrivalNo" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="送货人" :value="data.createBy" />
        <van-cell title="生成订单时间" :value="data.createTime" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="合同号" :value="data.saleNo" />
        <van-cell title="订单状态" :value="data.status" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="填写" is-link @click="writeGoods" />
      </van-cell-group>
      <textarea name="remark" id="remark" cols="30" rows="5" placeholder="备注" :value="data.remark"></textarea>
      <van-button type="info" class="submit">提 交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WriteOrder',
  data() {
    return {
      data:{},
      data1:[],
      json:[],
      //进来这页面的是哪个id
      id:null,
    }
  },
  methods: {
    returnPrev() {
      this.$router.push('/home')
    },
    writeGoods() {
      this.$router.push({name: 'WriteGoods',params: {routerData:this.data.goods,id: this.id}})
    }
  },
  created() {
    console.log('外面传进来的id',this.$route.params.id)
    this.id = this.$route.params.id
    //根据以上id拿到详情
    this.json = require('../../mock.json')
    console.log('先看看json',this.json)
    this.data1 = this.json.filter((item) => {
      console.log(1)
      return item.id == this.id
    })
    this.data = this.data1[0]
    console.log('现在的data',this.data)

  }
}
</script>

<style scoped lang="less">
  .writeOrder {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: .14rem;
  }
  .section {
    flex: 1;
    overflow: scroll;
  }
  .submit {
    width: 90%;
    margin: .3rem 5%;
    border-radius: 20px;
  }
  textarea {
    width: 90%;
    margin: .1rem 5%;
    padding: 5px;
  }
</style>