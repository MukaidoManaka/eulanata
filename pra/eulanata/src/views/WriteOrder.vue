<template>
  <div class="writeOrder">
    <div class="header">
       <van-nav-bar title="送货单详情" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <van-cell-group>
        <van-cell title="单据编号" :value="data.djbh" />
        <van-cell title="交货日期" :value="$date(data.fsrq)" />
      </van-cell-group>
      <!-- <van-cell-group>
        <van-cell title="合计不含税金额" :value="data.hjbhsje" />
        <van-cell title="合计含税金额" :value="data.hjhsje" />
        <van-cell title="合计商品税额" :value="data.hjspse" />
      </van-cell-group> -->
      <van-cell-group>
        <van-cell title="采购合同号" :value="data.khhth" />
        <van-cell title="销售合同号" :value="data.xshth" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="订单状态" :value="data.status" />
        <van-cell title="交货地址" :value="data.jhdz" />
        <van-cell title="所属公司" value="平湖凯隆新材料科技有限公司" v-if="data.company === 'pubdatanew'" class="_company"/>
        <van-cell title="所属公司" value="嘉兴凯隆智能科技股份有限公司" v-if="data.company === 'zy_erp'" class="_company"/>
        <van-cell title="所属公司" value="平湖市兆涌五金塑胶制造有限公司" v-if="data.company === 'wjfc'" class="_company"/>
      </van-cell-group>
      
      <van-cell-group>
        <van-cell title="去填写数量" is-link @click="readGoods" />
      </van-cell-group>
      <textarea name="remark" id="remark" cols="30" rows="5" placeholder="备注" v-model="submitObj.remark"></textarea>
      <van-button type="primary" class="submit" @click="submit" :disabled="disabled">提 交</van-button>
    </div> 
  </div>
</template>

<script>
import { submitGoods } from '@/api/all.js'
export default {
  name: 'ListDetail',
  data() {
    return {
      data:{},
      submitObj: {
        djbh: '',
        xshth: '',
        remark: '',
        sp: [],
        csmc: `${this.$store.state.csmc}`,
        csbm: `${this.$store.state.csbm}`,
      },
      disabled: false,
    }
  },
  methods: {
    returnPrev() {
      this.$router.push('/home')
    },
    readGoods() {
      if(Object.keys(this.$route.params).includes('num')) {
        this.$router.push({name: 'WriteGoods',params: {
          djbh:this.data.djbh,
          item: this.$route.params.item, 
          status: this.data.status,
          num: this.$route.params.num,
          company: this.data.company
          }
        })
      }else {
        this.$router.push({name: 'WriteGoods',params: {
          djbh:this.data.djbh,
          item: this.$route.params.item, 
          status: this.data.status,
          company: this.data.company
          }
        })
      }
    },
    submit() {
      this.submitObj.djbh = this.data.djbh
      this.submitObj.xshth = this.data.xshth

      this.submitObj.sp = this.$route.params.sp
      // for(let i in this.$route.params.sp) {
      //   this.submitObj.sp.push(this.$route.params.sp[i])
      // }

      console.log('提交前的submitObj',this.submitObj)

      submitGoods(this.submitObj).then(res => {
        console.log('提交啦',res)
        this.$router.push({name: 'Home'})
      })
    }
  },
  created() {
    if(this.$route.params.item) {
      console.log('外面传进来的item',this.$route.params.item)
      this.data = this.$route.params.item
      this.data.status = this.$route.params.status
    }else {
      gzhJump("D000124879").then(res => {
        console.log("shuaxin--",res)
        this.data = res
        if(res.shbz == 1) {
          this.data.status = '未完成'
        }else if(res.shbz == 0) {
          this.data.status = '未发货'
        }else {
          this.data.status = '已完成'
        }
      })
    }
    


    // //根据以上item拿到详情
    // homeListDetail(this.item).then(res => {
    //   console.log('created时的res',res)
    //   this.data = res
    // })

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