<template>
<!-- wwc是未完成的缩写 -->
  <div class="wwc">
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
        <van-cell title="填写发货单" is-link @click="readGoods" class="readGoods"/>
      </van-cell-group>
      <textarea name="remark" id="remark" cols="30" rows="5" placeholder="备注(非必填,最多100字)" maxlength="100" v-model="submitObj.remark"></textarea>
      <van-button type="primary" class="submit" @click="submit" :disabled="disabled">提 交</van-button>
    </div>
  </div>
</template>

<script>
import { submitGoods, gzhJump } from '@/api/all.js'
import { setStorage, getStorage, decodeurl } from '@/assets/js/utils.js'
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
        pk: 0
      },
      disabled: false,
      id: 0,
    }
  },
  methods: {
    returnPrev() {
      this.$router.push('/home')
    },
    readGoods() {
      //场景： 在detail页面填过一次数据回到Wwc页面，还想再进去WwcDetail页面看看/改改，detail页面里面填过的输入框应该显示刚刚填的值
      //如果包含num属性 那就说明在那边填过
      if(Object.keys(this.$route.query).includes('num')) {
        this.$router.push({name: 'WwcDetail',params: {
          id: this.$route.query.id,
          status: this.data.status,
          num: this.$route.query.num,
          }
        })
      }else {
        this.$router.push({name: 'WwcDetail',params: {
          id: this.$route.query.id, 
          status: this.data.status,
          }
        })
      }
    },
    submit() {
      this.submitObj.djbh = this.data.djbh
      this.submitObj.xshth = this.data.xshth
      this.submitObj.pk = this.id

      this.submitObj.sp = this.$route.query.sp
      // for(let i in this.$route.params.sp) {
      //   this.submitObj.sp.push(this.$route.params.sp[i])
      // }

      console.log('提交前的submitObj',this.submitObj)

      //不为undefined 填写了货物
      if(this.submitObj.sp != undefined && this.submitObj.sp.length > 0) {
        submitGoods(this.submitObj).then(res => {
          console.log('提交啦',res)
          if(res.detail == 'success') {
            this.$toast.success({
              message: '   提交成功   凯隆已收到您的送货单',
              duration: 5000
            })
            //提交成功的单子存其id进sessionStorage, [10,55,32]
            //submitId : 未完成的单子 送货成功存里面；waitId：未发货的单子
            if(getStorage('submitId')) {
              let j = JSON.parse(getStorage('submitId'))
              j.push(this.id)
              let k = JSON.stringify(j)
              setStorage('submitId',k)
            }else {
              //初次submitId肯定不存在 进来这里
              let arr = []
              arr.push(this.id)
              let arr2 = JSON.stringify(arr)
              setStorage('submitId',arr2)
            }
          }
          this.$router.push({name: 'Home',params:{id: this.id}})
        })
      }else {
        console.log('sp的值',this.submitObj.sp)
        this.$toast.fail("请至少填写一样所送货物")
      }
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

    //   gzhJump(630).then(res => {
    //     console.log("shuaxin--",res)
    //     this.data = res
    //     if(res.shbz == 1) {
    //       this.data.status = '未完成'
    //     }else if(res.shbz == 0) {
    //       this.data.status = '未发货'
    //     }else {
    //       this.data.status = '已完成'
    //     }
    //   })
    // }


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
  .readGoods {
    font-weight: 600;
    margin-top: .05rem;
  }
  .readGoods:before {
    position: absolute;
    left: 8px;
    color: #ee0a24;
    font-size: 14px;
    content: '*';
  }
  .section .van-cell__right-icon {
    color: #323232;
  }
</style>