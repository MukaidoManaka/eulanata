<template>
<!-- wwc是未完成的缩写 -->
  <div class="wwc">
    <div class="header">
       <van-nav-bar title="送货单详情" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <van-cell-group>
        <van-cell title="单据编号" :value="data.djbh" />
        <van-cell title="交货日期" :value="$date(data.fsrq)" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="采购合同号" :value="data.khhth" />
        <van-cell title="销售合同号" :value="data.xshth" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="订单状态" :value="data.status" />
        <van-cell title="交货地址" :value="data.jhdz" />
        <van-cell title="所属公司" value="凯隆凯龙开龙铠龙" />
      </van-cell-group>
      
      <van-cell-group>
        <van-cell title="去填写数量" is-link @click="readGoods" />
      </van-cell-group>
      <textarea name="remark" id="remark" cols="30" rows="5" placeholder="备注" v-model="submitObj.remark"></textarea>
      <van-button type="primary" class="submit" @click="submit">提 交</van-button>
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
        sp: []
      }
    }
  },
  methods: {
    returnPrev() {
      this.$router.push('/home')
    },
    readGoods() {
      if(Object.keys(this.$route.params).includes('num')) {
        this.$router.push({name: 'WwcDetail',params: {
          djbh:this.data.djbh,
          item: this.$route.params.item, 
          status: this.data.status,
          num: this.$route.params.num
          }
        })
      }else {
        this.$router.push({name: 'WwcDetail',params: {
          djbh:this.data.djbh,
          item: this.$route.params.item, 
          status: this.data.status,
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
    console.log('外面传进来的item',this.$route.params.item)
    this.data = this.$route.params.item
    this.data.status = this.$route.params.status


    // //根据以上item拿到详情
    // homeListDetail(this.item).then(res => {
    //   console.log('created时的res',res)
    //   this.data = res
    // })

  }
}
</script>

<style scoped lang="less">
  .wwc {
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