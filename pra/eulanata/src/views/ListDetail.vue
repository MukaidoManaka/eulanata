<template>
  <div class="deliveryDetail">
    <div class="header">
       <van-nav-bar title="送货单详情" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <!-- <van-cell-group>
        <van-cell title="单据编号" :value="data.djbh" />
        <van-cell title="交货日期" :value="$date(data.fsrq)" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="采购合同号" :value="data.xshth" />
        <van-cell title="客户合同号" :value="data.khhth" />
      </van-cell-group> -->
      <van-cell-group>
        <van-cell title="采购合同号" :value="data.djbh" />
        <van-cell title="客户合同号" :value="data.xshth" />
        <van-cell title="交货日期" :value="$date(data.fsrq)" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="订单状态" :value="data.status" />
        <van-cell title="交货地址" :value="data.jhdz" />
        <van-cell title="所属公司" value="平湖凯隆新材料科技有限公司" v-if="data.company === 'pubdatanew'" class="_company"/>
        <!-- <van-cell title="所属公司" value="嘉兴凯隆智能科技股份有限公司" v-if="data.company === 'wjfc'" class="_company"/> -->
        <van-cell title="所属公司" value="平湖市兆涌五金塑胶制造有限公司" v-if="data.company === 'zy_erp'" class="_company"/>
        <van-cell title="所属公司" value="嘉兴市鸿镕五金塑胶制品股份有限公司" v-if="data.company === 'hong'" class="_company"/>
      </van-cell-group>
      
      <van-cell-group>
        <van-cell title="货物详情" is-link @click="readGoods" class="readGoods"/>
      </van-cell-group>
      <div class="remark">
        <!-- <span>备注:</span> -->
        <!-- <p> {{data.remark}} </p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { gzhJump } from '@/api/all.js'
import { decodeurl } from '@/assets/js/utils.js'
export default {
  name: 'ListDetail',
  data() {
    return {
      data:{},
      data1:[],
      //进来这页面的是哪个djbh
      djbh:'',
      id: 0,
    }
  },
  methods: {
    returnPrev() {
      this.$router.push('/home')
    },
    readGoods() {
      this.$router.push({name: 'GoodsDetail',params: {
        id: this.$route.query.id, 
        status: this.data.status,
        }
      })
    }
  },
  created() {
    if(this.$route.query.id) {
      console.log('外面传进来的id',this.$route.query.id)
      console.log('外面传进来的route',this.$route)
      this.id = this.$route.query.id
      gzhJump(this.id).then(res => {
        this.data = res
        if(res.shbz == 0) {
          this.data.status = '未发货'
        }else if (res.shbz == 1) {
          this.data.status = '未完成'
        }else if (res.shbz == 2) {
          this.data.status = '已完成'
        }
      })
      
    }else {
      console.log('不进else')
      let p = location.href
      console.log(p)
      let obj = decodeurl(p)
      console.log(obj)
      gzhJump(obj.id).then(res => {
        console.log("shuaxin--",res)
        this.data = res
        if(res.shbz == 1) {
          this.data.status = '未完成'
          this.$router.push({name:'Wwc',query:{id:obj.id}})
        }else if(res.shbz == 0) {
          this.data.status = '未发货'
        }else {
          this.data.status = '已完成'
          this.$router.push({name:'ListDetail',query:{id:obj.id}})
        }
      })
    }

    // if(this.$route.params.id) {
    //   console.log('外面传进来的id',this.$route.params.id)
    //   this.id = this.$route.params.id
    //   gzhJump(this.id).then(res => {
    //     this.data = res
    //     this.data.status = this.$route.params.status
    //   })
      
    // }else {
    //   console.log(22222222222)
      
    // }
    

  }
}
</script>

<style scoped lang="less">
  .deliveryDetail {
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
  .readGoods {
    margin-top: .05rem;
    font-weight: 600;
  }
  .section .van-cell__right-icon {
    color: #323232;
  }
</style>