<template>
  <div class="writeGoods">
    <div class="header">
       <van-nav-bar title="商品发货填写" left-text="返回" :right-text="rightBtn" @click-right="save" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <van-cell class="djbh" title="单据编号" :value="djbh" />
      <div v-for="(item, index) in data" :key="item.id">
        <div class="title"> 商品{{index + 1}} </div>
        <van-cell-group>
          <!-- <van-cell title="单据编号" :value="item.djbh" /> -->
          <!-- <van-cell title="商品编码" :value="item.spbm" /> -->
          <van-cell title="商品名称" :value="item.spmc" />
          <van-cell title="交货日期" :value="$date(item.jhrq)" />
          <van-collapse v-model="activeNames">
            <van-collapse-item title="扩展属性" :name="item.spmc">{{item.spjbsx}}</van-collapse-item>
          </van-collapse>
          <div class="relative">
            <van-cell title="应发" :value="item.require_num"/>
            <span class="span">{{item.spjldw}}</span>
          </div>
          <div class="relative">
            <van-field v-model="num[index]" label="实发" :class="[item.isError ? 'warning':'']" required input-align="right" type="number" @blur="checkValue(item,index)" placeholder="请输入(不发此货就不填)" />
            <span class="span">{{item.spjldw}}</span>
          </div>
        </van-cell-group>
      </div>
      <div class="image" v-if="display">
        <img :src="img" alt="">
        <p>没有查到相关货物数据</p>
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
      checkNum: [],
      canSubmit: true, //是否能提交
      company: '',
      id: 0,
      rightBtn: '保存',
      img: require('@/assets/404_images/404.png'),
      display: false,
    }
  },
  methods: {
    returnPrev() {
      this.$router.push({name: 'WriteOrder',query: {id: this.$route.params.id}})
    },
    save() {
      console.log('保存时的num',this.num)
      //置空，不然出错的时候不能提交,会一直往sp里面push(obj)
      this.sp = []
      
      for(let i in this.num) {
        const obj = {}
        //num大于0 小于require数量
        if(this.num[i] - 0 > 0 && this.num[i] - 0 <= this.data[i].require_num) {
          //num这个数组里可能会出现[10,'',20,30]这种情况，场景：在第二个input框里面输入值然后删了，就会出现空字符串，会被vmodel同步到num里去，所以判断一下
          if(this.num[i] != '') {
            obj.spbm = this.data[i].spbm
            obj.spmc = this.data[i].spmc
            obj.num = this.num[i] - 0
            obj.spjbsx = this.data[i].spjbsx

            this.data[i].isError = false
            this.$forceUpdate()
            this.sp.push(obj)
          }
          this.checkNum[i] = true
        }else {
          console.log('此时num【i】的值',this.num[i])
          if(this.num[i] != '') {
            //能进这个if的  就是数字乱填 / 填错
            this.checkNum[i] = false
            this.data[i].isError = true
            this.$forceUpdate()
            this.$toast.fail('请检查货物所填数目是否正确')
          }else {
            //checkNum---- (4) [true, false, true, true, __ob__: Observer] 删掉那个false
            this.checkNum.splice(i,1)
          }
          
        }
      }

      console.log('sppppppp-------',this.sp)
      console.log('checkNum----',this.checkNum)
      if(this.checkNum.includes(false)) {
        this.canSubmit = false
        this.$toast.fail('保存失败，请检查填写内容')
      }else {
        this.canSubmit = true
      }

      //为true才让保存 并跳转
      if(this.canSubmit == true) {
        this.$toast.success('保存成功！')
        this.$router.push({name:'WriteOrder',query: {
          id: this.$route.params.id,
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
        console.log('有值填错了')
        this.data[index].isError = true
        this.$forceUpdate()
      }else {
        this.data[index].isError = false
        this.$forceUpdate()
      }
    }
  },
  created() {
    //来回传num是为了点击保存之后到提交页面，他还想返回来看一眼goods页面填的值是多少的话，就得这个num来做
    if(Object.keys(this.$route.params).includes('num')) {
      console.log('包含num',this.$route.params.num)
      this.num = this.$route.params.num
    }else {
      console.log('不包含num')
    }
    
    goodsDetail({"order": this.$route.params.id}).then(res => {
      console.log('res',res)
      this.data = res
      this.djbh = res[0].djbh
      for (let p in this.data) {
        this.data[p].isError = false
      }

      if(res.length == 0) {
        console.log("空空空空空空")
        this.rightBtn = ''
        this.display = true
      }
      //不用var会报i not defined,把i当vue data里的变量
      for (var i in this.data) {
        this.activeNames.push(this.data[i].spmc)
      }
      console.log('折叠面板数组值',this.activeNames)
    }).catch(err => {
      console.log('errrrrrrrrrrrrrrrrr',err)
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
.image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  img {
    width: 100%;
  }
  p {
    color: #aaa;
    margin-top: .1rem;
  }
}
.djbh {
  color: #000;
  font-weight: 600;
  .van-cell__value {
    color: #000;
  }
}
// .warning input::placeholder {
//   color: #ee0a24;
// }
</style>