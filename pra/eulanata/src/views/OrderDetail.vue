<template>
  <div class="orderDetail">
    <div class="header">
       <van-nav-bar title="订单详情" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
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
        <van-cell title="货物详情" is-link />
      </van-cell-group>
      <div class="remark">
        <span>备注:</span>
        <p> {{data.remark}} </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
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
      this.$router.push('/message')
    },
  },
  created() {
    

  }
}
</script>

<style scoped lang="less">
  .orderDetail {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: .14rem;
  }
  .section {
    flex: 1;
    overflow: scroll;
  }
  .remark {
    width: 100%;
    padding:.1rem .16rem;
    p {
      width: 100%;
      background-color: #fff;
      min-height: .5rem;
      padding-left: 20px;
      border:1px solid #333;
    }
  }
</style>