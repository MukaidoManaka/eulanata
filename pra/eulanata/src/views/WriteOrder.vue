<template>
  <div class="writeOrder">
    <div class="header">
       <van-nav-bar title="送货单详情" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <!-- <van-cell-group>
        <van-cell title="单据编号" :value="data.djbh" />
        
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
import { submitGoods, gzhJump, getOpenid } from '@/api/all.js'
import { setStorage, getStorage, transformObj, decodeurl, getLocal, setLocal } from '@/assets/js/utils.js'
export default {
  name: 'WriteOrder',
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
        pk: 0,

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
      if(Object.keys(this.$route.query).includes('num')) {
        this.$router.push({name: 'WriteGoods',params: {
          id: this.id, 
          status: this.data.status,
          num: this.$route.query.num,
          }
        })
      }else {
        this.$router.push({name: 'WriteGoods',params: {
          id: this.id, 
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

      // console.log('提交前的submitObj',this.submitObj)

      //判断提交时间  是否为交货日期的7tian之内 暂时不用这个功能，直接就能提交 不做限制
      // const date = new Date(this.$store.state.date)
      // const date2 = this.$date(this.data.fsrq)
      // const date3 = new Date(date2)
      // console.log('qian',date3)
      // //交货日期的七天之前是这一天
      // date3.setDate(date3.getDate() - 7)
      // console.log('hou',date3) 
      //
      // if(date.getTime() >= date3.getTime()) {
      //   console.log('keyi 提交')
      //   //不为undefined 填写了货物
      //   if(this.submitObj.sp != undefined) {
      //     submitGoods(this.submitObj).then(res => {
      //       console.log('提交啦',res)
      //       if(res.detail == 'success') {
      //         this.$toast.success({
      //           message: '   提交成功   凯隆已收到您的送货单',
      //           duration: 5000
      //         })
              
      //         //提交成功的单子存其id进sessionStorage, [10,55,32]
      //         if(getStorage('submitId')) {
      //           console.log('这')
      //           let j = JSON.parse(getStorage('submitId'))
      //           j.push(this.id)
      //           let k = JSON.stringify(j)
      //           setStorage('submitId',k)
      //         }else {
      //           //初次submitId肯定不存在 进来这里
      //           console.log('那')
      //           let arr = []
      //           arr.push(this.id)
      //           let arr2 = JSON.stringify(arr)
      //           setStorage('submitId',arr2)
      //         }
      //       }
      //       this.$router.push({name: 'Home',params: {id: this.id}})
      //     })
      //   }else {
      //     console.log('sp的值',this.submitObj.sp)
      //     this.$toast.fail("请至少填写一样所送货物")
      //   }
      // }else {
      //   this.$toast.fail({
      //     message: '提交失败，只允许提前一周送货',
      //     duration: 4000
      //   })
      // }

      if(this.submitObj.sp != undefined && this.submitObj.sp.length > 0) {
        submitGoods(this.submitObj).then(res => {
          // console.log('提交啦',res)
          if(res.detail == 'success') {

            this.$toast.success({
              message: '   提交成功   凯隆已收到您的送货单',
              duration: 5000
            })
            
            //提交成功的单子存其id进sessionStorage, [10,55,32]
            if(getStorage('submitId')) {
              // console.log('这')
              let j = JSON.parse(getStorage('submitId'))
              j.push(this.id)
              let k = JSON.stringify(j)
              setStorage('submitId',k)
            }else {
              //初次submitId肯定不存在 进来这里
              // console.log('那')
              let arr = []
              arr.push(this.id)
              let arr2 = JSON.stringify(arr)
              setStorage('submitId',arr2)
            }
          }
          this.$router.push({name: 'Home',params: {id: this.id}})
        })
      }else {
        // console.log('sp的值',this.submitObj.sp)
        this.$toast.fail("请至少填写一样所送货物")
      }
  
    },
    //
    init() {
      if(this.$route.query.id) {
        // console.log('外面传进来的id',this.$route.query.id)
        // console.log('外面传进来的route',this.$route)
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
        // console.log('不进else')
        let p = location.href
        // console.log(p)
        let obj = decodeurl(p)
        // console.log(obj)
        gzhJump(obj.id).then(res => {
          // console.log("shuaxin--",res)
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
    }
    
  },
  mounted() {

    //没有openid就去else请求
    if (getLocal('openid') && getLocal('openid') !== 'undefined'){
      // console.log('if true的openid',getLocal('openid'))
      this.init()
    }else {
      const local = window.location.href
      const hash = window.location.hash 
      const o = decodeurl(local)
      const code = o.code // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      // console.log(code)
      const baseurl = 'http://www.keeplong.vip/dist/'
      const url = baseurl + hash
      // console.log(url)
      if (code == null || code === '') {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.state.appid + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
      } else {
        // console.log('else')
        getOpenid({'code':code}).then(res => {
          // console.log('openid的res',res)
          this.$store.commit('saveOpenid',res.open_id)
          setStorage('openid',res.open_id)
          setLocal('openid',res.open_id)
          this.init()
        })
      }
    }

  },
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
  .readGoods {
    margin-top: .05rem;
    font-weight: 600;
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