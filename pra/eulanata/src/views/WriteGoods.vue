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
          <van-cell title="交货日期" :value="$date(item.jhrq)" />
          <van-cell title="商品名称" :value="item.spmc" />
          <van-collapse v-model="activeNames">
            <van-collapse-item title="扩展属性" :name="item.spmc">{{item.spjbsx}}</van-collapse-item>
          </van-collapse>
          <div class="relative">
            <van-cell title="应发" :value="item.require_num"/>
            <span class="span">{{item.spjldw}}</span>
          </div>
          <div class="relative">
            <van-field v-model="num[index]" label="实发" required input-align="right" type="number" @blur="checkValue(item,index)" placeholder="请输入" :error="error" />
            <span class="span">{{item.spjldw}}</span>
          </div>
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
      num: [],  //input框>=2的话，只能用数组
      djbh: '', //单据编号
      searchParams: {
        djbh: ''
      },
      sp: [],
      error: false,
      checkNum: [],
      canSubmit: true, //是否能提交
      company: '',
    }
  },
  methods: {
    returnPrev() {
      this.$router.push({name: 'WriteOrder',params: {item: this.$route.params.item,status: this.$route.params.status}})
    },
    save() {
      console.log('保存时的num',this.num)
      
      for(let i in this.num) {
        const obj = {}
        //num大于0 小于require数量
        if(this.num[i] - 0 > 0 && this.num[i] - 0 <= this.data[i].require_num) {
          //num这个数组里可能会出现[10,'',20,30]这种情况，场景：在第二个input框里面输入值然后删了，就会出现空字符串，会被vmodel同步到num里去，所以判断一下
          if(this.num[i] != '') {
            obj.spbm = this.data[i].spbm
            obj.spmc = this.data[i].spmc
            obj.num = this.num[i] - 0
            this.sp.push(obj)
          }
          this.checkNum[i] = true
        }else {
          if(this.num[i] != '') {
            //能进这个if的  就是数字乱填 / 填错
            this.checkNum[i] = false
            this.$toast.fail('请检查货物所填数目是否正确')
          }
          
        }
      }

      console.log('sppppppp-------',this.sp)
      console.log('checkNum----',this.checkNum)
      if(this.checkNum.includes(false)) {
        this.canSubmit = false
      }else {
        this.canSubmit = true
      }

      //为true才让保存 并跳转
      if(this.canSubmit) {
        this.$router.push({name:'WriteOrder',params: {
          item: this.$route.params.item,
          status: this.$route.params.status,
          sp: this.sp,
          num: this.num
          }
        })
      }
    },
    checkValue(item,index) {
      console.log('item---index',item,index,this.num[index])
      console.log('num',this.num)
      if(this.num[index] - 0 > this.data[index].require_num) {
        this.error = true
      }else {
      }
    }
  },
  created() {
    //来回传num是为了点击保存之后到提交页面，他还想返回来看一眼goods页面填的值是多少的话，就得这个num来做简单
    if(Object.keys(this.$route.params).includes('num')) {
      console.log('包含num',this.$route.params.num)
      this.num = this.$route.params.num
    }else {
      console.log('不包含num')
    }
    
    //路由携带的公司
    this.company = this.$route.params.company

    this.searchParams.djbh = this.$route.params.djbh
    goodsDetail(this.searchParams,this.company).then(res => {
      console.log('res',res)
      this.data = res

      //不用var会报i not defined,把i当vue data里的变量
      for (var i in this.data) {
        this.activeNames.push(this.data[i].spmc)
      }
      console.log('折叠面板数组值',this.activeNames)
    })
    
    
  },
  updated() {
    // console.log('num',this.num)
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
  .span {
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