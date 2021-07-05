<template>
  <div class="home">
    <div class="header">
      <van-nav-bar title="主页" color="white">
        <template #right>
          <van-icon name="search" size="18" @click="search" v-show="!whetherSearching"/>
          <van-icon name="search" size="24" @click="search" v-show="whetherSearching" dot class="searchIcon"/>
        </template>
        <template #left>
          <van-icon name="question-o" size="18" @click="readHelp"/>
        </template>
      </van-nav-bar>
    </div>
    <div class="section">
      <van-tabs v-model="active" @click="tabChange" color="#06AE56">
        <van-tab :key="index" v-for="(item,index) in dict" :title="item">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              :offset="20"
              :immediate-check="false"
              id="postion"
            >
              <div class="list_item" v-for="(item,idx) in currentArr" :key="item.id" :title="item.hjbhsje" @click="enterDetail(item.id)">
                <!-- 左边图片 -->
                <div class="left_item">
                  <!-- <img src="@/assets/image/f_qq1.png" alt=""> -->
                  <p>{{idx + 1}}</p>
                </div>
                <!-- 右边订单相关数据 -->
                <div class="right_item">
                  <div class="_top">
                    <span v-if="!(item.xshth === '' && item.khhth === '')">采购合同号：{{item.xshth}}</span>
                    <span v-if="item.xshth === '' && item.khhth === ''">单据编号：{{item.djbh}}</span>
                    <div>
                      <!-- <van-tag plain type='primary' v-if="func(item.id)" style="margin-right:3px">已提交</van-tag> -->
                      <van-tag plain type='primary' v-if="item.going || func(item.id)" style="margin-right:3px">已提交</van-tag>
                      <van-tag plain type='primary' :class="'bindClass' + `${active}`" class="tag3" v-if="active === 1 || !item.going">{{active === 0 ? '未发货' : (active === 1 ? '未完成' : '已完成')}}</van-tag>
                    </div>
                    <!-- <van-tag plain type='primary' :class="'bindClass' + `${searchParams.status}`">{{searchParams.status === 'wait' ? '未发货' : (searchParams.status === 'going' ? '未完成' : '已完成')}}</van-tag> -->
                    <!-- <van-tag plain type='primary' :class="'bindClass' + `${item.status}`">{{item.status == 0 ? '未发货' : '已完成'}}</van-tag> -->
                    <!-- <van-tag plain type="warning">{{item.status}}</van-tag> -->
                  </div>
                  <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '2px' }"/>
                  <div class="_bottom">
                    <div class="_bottom_left">
                      <p>客户合同号: {{item.khhth}} </p>
                      <p>交货日期：{{$date(item.fsrq)}} </p>
                    </div>
                    <!-- <span class="progress" v-show="active === 1"> 已送：约{{item.percent}}% </span> -->
                    <div class="progress _bottom_right"  ref="progrs">
                      <!-- 只有未完成这栏才显示百分比  如果运行出错了，undefined就不显示 v-show="active === 1" v-if="item.percent != undefined"-->
                      <van-progress color="#07C160" v-show="active === 1" :percentage="item.percent" ref="progress" v-if="item.percent != undefined"/>
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup v-model="showPop" position="bottom" >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择查询日期"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="selectDate"
        @cancel="cancelDate"
      />
    </van-popup>
    <!-- 搜索按钮的弹出框 -->
    <van-overlay :show="show" @click="overlay" class="overlay_search">
      <van-cell-group>
        <div class="cross">
          <van-icon name="cross" @click="closeSearch"/>
        </div>
        <van-field label="合同号" placeholder="输入采购/客户合同号" v-model="searchParams.xshth" clearable></van-field>
        <van-field is-link @click="showPopup('start')" v-model="startDate" label="选择起始时间" @focus="focusStart" ref="start"></van-field>
        <van-field is-link @click="showPopup('end')" v-model="endDate" label="选择截至时间" @focus="focusEnd" ref="end"></van-field>
        <van-radio-group v-model="radio" checked-color="#60C08B">
          <!-- <van-row type="flex" justify="space-around" class="van_row">
            <van-col span="1"></van-col>
            <van-col span="11"><van-radio name="1">全部</van-radio></van-col>
            <van-col span="11"><van-radio name="2">未发货</van-radio></van-col>
            <van-col span="1"></van-col>
          </van-row>
          <van-row>
            <van-col span="1"></van-col>
            <van-col span="11"><van-radio name="3">未完成</van-radio></van-col>
            <van-col span="11"><van-radio name="4">已完成</van-radio></van-col>
            <van-col span="1"></van-col>
          </van-row> -->
          <van-row type="flex" justify="space-around" class="van_row">
            <van-col span="8"><van-radio name="1">未发货</van-radio></van-col>
            <van-col span="8"><van-radio name="2">未完成</van-radio></van-col>
            <van-col span="8"><van-radio name="3">已完成</van-radio></van-col>
          </van-row>
        </van-radio-group>
        <div class="btn">
          <van-button plain color="#333" class="reset" @click="reset">重 置</van-button>
          <van-button type="primary" class="search" @click="submit">搜 索</van-button>
        </div>
      </van-cell-group>
    </van-overlay>
    <!-- 自动弹出的帮助 v-if保证help为false的时候直接不渲染 就不会半秒的出现遮罩层再消失 ，show保证为明明help为true，但是居然不显示遮罩层 -->
    <van-overlay class="overlay_help" v-if="$store.state.help" :show="$store.state.help"> 
      <div class="help">
        <div class="content">
          <h3>使用说明</h3>
          <ul>
            <li class="font18">主要功能：</li>
            <li class="pl5"> 1.实时查看订单的收货状态与详细信息</li>
            <li class="pl5"> 2.提前预约送货</li>
            <li class="pl5"> 3.新订单到达提醒</li>
            <li class="font18">流程：</li>
            <li class="pl5"> 点击任意订单—><span>填写送货单</span>—>填写数量—><span>保存</span>—><span>提交</span></li>
            <li></li>
            <li class="font18">订单状态：</li>
            <li class="pl5"> 未发货：未发货的订单</li>
            <li class="pl5"> 未完成：订单仅部分发货</li>
            <li class="pl5"> 已完成：订单中的货品已全部发货</li>
            <li class="pl5"> 已提交：指您刚刚提交送货的订单</li>
            <li></li>
            <li class="red"> 注：</li>
            <li class="red"> 1.需要等到我司相关负责人员入库验收货物之后，此页面上的订单状态才会改变</li>
            <li class="red"> 2.送货数量请依据实际情况如实填写</li>
            <li class="red"> 3.如果订单中的某一货物这次不送，那么就不填，不要填0</li>
            <li></li>
            <li></li>
          </ul>
          <van-checkbox v-model="checked" shape="square" style="margin-top:5px">下次不再弹出</van-checkbox>
        </div>
        <div class="iknow" @click="closeHelp">我知道了</div>
      </div>
    </van-overlay>
    <!-- 点击帮助按钮弹出 -->
    <van-overlay class="overlay_help" :show="help"> 
      <div class="help">
        <div class="content">
          <h3>使用说明</h3>
          <ul>
            <li class="font18">主要功能：</li>
            <li class="pl5"> 1.实时查看订单的收货状态与详细信息</li>
            <li class="pl5"> 2.提前预约送货</li>
            <li class="pl5">3.新订单到达提醒</li>
            <li class="font18">流程：</li>
            <li class="pl5"> 点击任意订单—><span>填写送货单</span>—>填写数量—><span>保存</span>—><span>提交</span></li>
            <li></li>
            <li class="font18">订单状态：</li>
            <li class="pl5"> 未发货：未发货的订单</li>
            <li class="pl5"> 未完成：订单仅部分发货</li>
            <li class="pl5"> 已完成：订单中的货品已全部发货</li>
            <li class="pl5"> 已提交：指您刚刚提交送货的订单</li>
            <li></li>
            <li class="red"> 注：</li>
            <li class="red"> 1.需要等到我司相关负责人员入库验收货物之后，此页面上的订单状态才会改变</li>
            <li class="red"> 2.送货数量请依据实际情况如实填写</li>
            <li class="red"> 3.如果订单中的某一货物这次不送，那么就不填，不要填0</li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div class="iknow" @click="closeHelp2">我知道了</div>
      </div>
    </van-overlay>
    <Footer :currentIndex = '0' />
    <!-- <div class="blankFooter"></div> -->
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import { dateFormat, timestamp, setLocal, getStorage, getLocal, setStorage } from '@/assets/js/utils.js'
import { homeList, goodsDetail, userInfo, getDate, showHelp } from '@/api/all.js'
export default {
  name: 'Home',
  components: {
    Footer
  },
  data() {
    return {
      loading: false, //是否处于加载状态，加载过程中不触发load事件
      finished: false,  //是否已加载完成，加载完成后不再触发load事件
      refreshing: false,
      currentRate: 55,
      gradientColor: {
        '0%': '#3fecff',
        '100%': '#6149f6',
      },
      
      show: false,//overlay_search的显隐
      showPop: false,//popup的显隐
      help: false,  //帮助（使用指南）的显隐
      active: 0,  //tab处于哪一栏
      minDate: new Date(2021, 0, 1),
      maxDate: new Date(2025, 5, 1),
      currentDate: new Date(),
      //不管先选起止还是截至，x_date来标记时间
      x_date: '',
      pink: 'pink',
      //区分审核或者通过火已完成3中状态
      // dict:['全部','未发货','未完成','已完成'],
      // dict:[`未发货(${this.$store.state.count_no})`,`未完成(${this.$store.state.count_ing})`,`已完成(${this.$store.state.count_finished})`],
      dict:[`未发货(${this.a})`,`未完成(${this.b})`,`已完成(${this.c})`],
      x_status: 0,
      x_name: '',

      //搜索时日期的起始截至时间
      startDate: '',
      endDate: '',

      currentArr:[],  //当前数组，用来渲染list
      waitArr:[],
      goingArr:[],
      finishedArr:[],
      nextPage: '', //用来存请求接口获得的next值，如果为null表示加载完 没有下一页了
      waitPage: '', //等于null时，表示待发货一栏已加载完
      goingPage: '',
      finishedPage: '',

      formatDate: '',
      startOrEnd: '', //此时是在选择起始还是截至时间  start/end
      radio: "1", //搜索框中的单选按钮，这东西得是字符串，就能默认选中了
      checked: false, //复选框 不再弹出
      searchParams: {
        xshth: '',
        startdate: '',
        enddate: '',
        status: 'wait', //默认显示wait未发货
      },
      page: 1,  //分页の第一页
      whetherSearching: false, //搜索条件是否正在生效,
      testMSG: '加载加载',
      loadload: 20000,  //20秒

      percentArr: [], //装百分比的数组
      emptyArr: [],
      a:0,  //a b c分别代表 未发货未完成已完成的数量，和上面的dict与$set一起食用
      b:0,
      c:0,
      x_arr: [],  //用来存goingArr，初始就计算好going第一页的percent
      submitId: 0,
      
    }
  },
  methods: {
    onLoad() {

      if(this.active === 0) {
        if(this.waitPage === null) {
          this.finished = true
          this.currentArr = this.waitArr
          this.loading = false
          this.refreshing = false
        }else {
          //假如length为11-20，就说明已经加载过第二页了，要么已经加载完 要么从第三页开始
          const p = Math.ceil(this.waitArr.length/10)
          this.page = 1 + p
          this.searchParams.page = this.page
          console.log("onload之前的page是多少",this.page,'------p是多少',p)

          homeList(this.searchParams).then(res => {
            console.log('onload时的res',res)
            if (res.results.length > 0) {

              this.currentArr = [...this.currentArr,...res.results]
              this.waitArr = this.currentArr
              this.nextPage = res.next
              this.loading = false
              this.refreshing = false

              if(res.next === null) {
                this.waitPage = null
                console.log("wait已加载完")
              }
              
            }else { // length = 0
              this.loading = false
              this.refreshing = false
              this.finished = true
            }
          }).catch(err => {
            console.log("error------------",err.code)
          })
        }
      }else if (this.active === 1) {
        //如果页面的这个标记是null，那么代表根本没有下一页了
        if(this.goingPage === null) {
          this.finished = true
          this.currentArr = this.goingArr
          this.loading = false
          this.refreshing = false
        }else {
          //假如length为11-20，就说明已经加载过第二页了，要么已经加载完 要么从第三页开始
          const p = Math.ceil(this.goingArr.length/10)
          this.page = 1 + p
          this.searchParams.page = this.page
          console.log("onload之前的page是多少",this.page,'------p是多少',p)

          homeList(this.searchParams).then(res => {
            console.log('onload时的res',res)
            this.emptyArr = res.results
            var res_length = 0  
            if (res.results.length > 0) {
              res_length = res.results.length
              //给percentArr里面新增数据
              for (let i in res.results) {
                var obj2 = {order:0}
                
                obj2.order = res.results[i].id
                goodsDetail(obj2).then(response => {
                  
                  console.log('详细信息---',response)
                  var require = 0
                  var receive = 0
                  for(let k in response) {
                    
                    require = require + Number(response[k].require_num)
                    receive = receive + Number(response[k].recv_num)
                  }
                  console.log('打印前的require ',require)
                  console.log('打印前的receive',receive)
                  var percent = (receive/require).toFixed(2) * 100
                  console.log('百分比------',percent)
                  // this.percentArr.push(Math.trunc(percent))
                  // res.results[i].percent = Math.trunc(percent)
                  // this.currentArr.percent = Math.trunc(percent)
                  this.emptyArr[i].percent = Math.trunc(percent)
                  // this.goingArr[i].percent = Math.trunc(percent)
                }).then(() => {
                  // this.percentArr.push(percent)
                  // console.log('onload时更新percent',this.percentArr)
                  // console.log("res_length和i的值",res_length,i)
                  //当下面条件成立时，for in此时执行最后一次，这最后一次时处理数组
                  if(res_length - 1 == i) {
                    console.log("res_length和i的值",res_length,i)
                    this.currentArr = [...this.goingArr,...this.emptyArr]
                    this.goingArr = this.currentArr
                    console.log("onload 里 currentArr的值",this.currentArr)
                    // for (let j in this.currentArr) {
                    //   this.currentArr[j].percent = this.percentArr[j]
                    // }
                  }
                })

              }

              
              

              // this.currentArr = [...this.currentArr,...res.results]
              console.log('----------------------------percent',this.percentArr)
              // this.goingArr = this.currentArr
              this.nextPage = res.next
              this.loading = false
              this.refreshing = false
              
              // for (var j in this.currentArr) {
              //   this.currentArr[j].percent = this.percentArr[j]
              // }

              if(res.next === null) {
                this.goingPage = null
                console.log("going已加载完")
              }
              
            }else { // length = 0
              this.loading = false
              this.refreshing = false
              this.finished = true
            }
          })
        }
      }else {
        if(this.finishedPage === null) {
          this.finished = true
          this.currentArr = this.finishedArr
          this.loading = false
          this.refreshing = false
        }else {
          //假如length为11-20，就说明已经加载过第二页了，要么已经加载完 要么从第三页开始
          const p = Math.ceil(this.finishedArr.length/10)
          this.page = 1 + p
          this.searchParams.page = this.page
          console.log("onload之前的page是多少",this.page,'------p是多少',p)

          homeList(this.searchParams).then(res => {
            console.log('onload时的res',res)
            if (res.results.length > 0) {

              this.currentArr = [...this.currentArr,...res.results]
              this.finishedArr = this.currentArr
              this.nextPage = res.next
              this.loading = false
              this.refreshing = false

              if(res.next === null) {
                this.finishedPage = null
                console.log("已完成已加载完")
              }
              
            }else { // length = 0
              this.loading = false
              this.refreshing = false
              this.finished = true
            }
          }).catch(err => {
            console.log("error------------",err.code)
          })
        }
      }
    },
    onRefresh() {
      this.loading = false
      //清除搜索条件（如果有的话）
      this.reset()
      //刷新得时候，page置1
      this.page = 1
      this.searchParams.page = this.page
      if(this.active === 0) {
        this.searchParams.status = 'wait'
      }else if(this.active ===1) {
        this.searchParams.status = 'going'
      }else {
        this.searchParams.status = 'finished'
      }

      homeList(this.searchParams).then(res => {
        console.log('下拉刷新时的res',res)
        this.currentArr = res.results
        this.nextPage = res.next
        this.refreshing = false

        //刷新完还得重置缓存的数据数组，不然执行onload时里面的p变量会不对
        if(this.active === 0) {
          this.waitArr = res.results
          if(res.next === null) {
            this.waitPage = null
          }else {
            this.waitPage = ''
          }
        }else if(this.active === 1) {
          //找active为1时的各种情况 给currentArr绑定percent属性
          // for (var j in this.currentArr) {
          //   this.currentArr[j].percent = this.percentArr[j]
          // }
          
          this.currentArr = this.x_arr 
          this.goingArr = this.x_arr 
          // this.goingArr = res.results

          // for (let i in res.results) {
          //   var obj2 = {djbh:''}
          //   obj2.djbh = res.results[i].djbh
          //   goodsDetail(obj2,res.results[i].company).then(res => {
          //     var require = 0
          //     var receive = 0
          //     for(var k in res) {
          //       require = require + Number(res[k].require_num)
          //       receive = receive + Number(res[k].recv_num)
          //     }
          //     var percent = (receive/require).toFixed(2) * 100
          //     console.log('百分比------',percent)
          //     this.currentArr[i].percent = Math.trunc(percent)
          //     this.goingArr[i].percent = Math.trunc(percent)
          //   })
          // }
          

          
          if(res.next === null) {
            this.goingPage = null
          }else {
            this.goingPage = ''
          }
        }else {
          this.finishedArr = res.results
          if(res.next === null) {
            this.finishedPage = null
          }else {
            this.finishedPage = ''
          }
        }
        //刷新完之后得把它重置
        this.finished = false
      })
    },
    enterDetail(id) {
      console.log('看看id',id)
      console.log('active',this.active)
      //0表示点击事件时tab处于未发货这一栏，就去填写页
      if (this.active === 0 ) {
        this.$router.push({name: 'WriteOrder', query: {id, status: '未发货'}})
      }else if(this.active === 1) {
        this.$router.push({name:'Wwc',params:{id, status: '未完成'}})
      }else {
        this.$router.push({name:'ListDetail',params:{id, status: '已完成'}})
      }
      
    },
    tabChange(name,title) {
      console.log('title',title)
      console.log('name',name)

      //神之一true，被遗忘的loading这么强大，切换tab的时候置个true 再也不用怕瞎逼自动onload数据导致的各种报错了
      this.loading = true

      //栏目切换了 clear一下
      this.reset()
      this.$nextTick(() => {
        document.querySelector('.van-pull-refresh').scrollTop = 21
        document.querySelector('.van-pull-refresh').scrollTo(0,33)
        console.log("scrollTop--------",document.querySelector('.van-pull-refresh'))
        console.log("scrollTop--------",document.querySelector('.van-pull-refresh').scrollTop)
      })
      this.currentArr = []

      this.page = 1
      this.searchParams.page = this.page

      this.finished = false

     
      
      if(name == 0) { //用name还是active好像没区别吧
        //如果waitArr里面没值，就去请求
        if(this.waitArr.length === 0) {
          //给个loading画面，不然看到的效果是 上一栏的数据(currentArr) 突然变成现在的数据(请求成功)
          this.$toast.loading({
            message: this.testMSG,
            forbidClick: true,
            duration: this.loadload
          });

          this.searchParams.status = 'wait'

          homeList(this.searchParams).then(res => {
            console.log('未发货',res)
            this.currentArr = res.results
            this.waitArr = res.results
            this.nextPage = res.next
            this.loading = false
            
            if(res.next === null) {
              this.waitPage = null
              this.finished = true
            }
            this.$toast.clear()
          })
        }else {
          this.searchParams.status = 'wait'
          this.currentArr = this.waitArr
          this.loading = false
        }
      }else if (name == 1) {
        //如果goingArr里面没值，就去请求
        if(this.goingArr.length === 0) {
          this.$toast.loading({
            message: this.testMSG,
            forbidClick: true,
            duration: this.loadload
          });

          this.searchParams.status = 'going'

          this.currentArr = this.x_arr
          this.goingArr = this.x_arr

          homeList(this.searchParams).then(res => {
            // console.log('未完成',res)
            // this.currentArr = this.x_arr
            // this.currentArr = res.results
            // this.goingArr = res.results

            // for (let i in res.results) {
            //   var obj2 = {djbh:''}
            //   obj2.djbh = res.results[i].djbh
            //   goodsDetail(obj2,res.results[i].company).then(res => {
            //     var require = 0
            //     var receive = 0
            //     for(var k in res) {
            //       require = require + Number(res[k].require_num)
            //       receive = receive + Number(res[k].recv_num)
            //     }
            //     var percent = (receive/require).toFixed(2) * 100
            //     console.log('百分比------',percent)
            //     this.currentArr[i].percent = Math.trunc(percent)
            //     this.goingArr[i].percent = Math.trunc(percent)
            //   })
            // }
            
            
            this.nextPage = res.next
            this.loading = false
            
            if(res.next === null) {
              this.goingPage = null
              this.finished = true
            }
            //显示百分比的
            // for (var j in this.currentArr) {
            //   this.currentArr[j].percent = this.percentArr[j]
            // }
            this.$toast.clear()
            
            
          })
        }else {
          this.searchParams.status = 'going'
          console.log("已经有goingArr的情况进else时",this.goingArr)
          this.currentArr = this.goingArr
          this.loading =false
          //显示百分比
          // for (var j in this.currentArr) {
          //   this.currentArr[j].percent = this.percentArr[j]
          // }
          // this.$refs.progress.resize();
        }

        
        console.log('active 1时的currentArr',this.currentArr)
      }else if (name == 2) {
        //如果finishedArr里面没值，就去请求
        if(this.finishedArr.length === 0) {
          this.$toast.loading({
            message: this.testMSG,
            forbidClick: true,
            duration: this.loadload
          });

          this.searchParams.status = 'finished'

          homeList(this.searchParams).then(res => {
            console.log('已完成',res)
            this.currentArr = res.results
            this.finishedArr = res.results
            this.nextPage = res.next
            this.loading = false
            
            if(res.next === null) {
              this.finishedPage = null
              this.finished = true
            }
            this.$toast.clear()
          })
        }else {
          this.searchParams.status = 'finished'
          this.currentArr = this.finishedArr
          this.loading = false
        }
      }

    },
    search() {
      this.show = !this.show
    },
    overlay1() {
      // console.log('overlay1')
    },
    overlay() {
      // console.log('overlay')
      // this.show = !this.show
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`
      }
      return val;
    },
    //日期选择之确认
    selectDate(val) {
      // console.log('val',val) //val Mon Mar 20 2023 00:00:00 GMT+0800 (中国标准时间)

      if (this.startOrEnd === 'start') {
        this.startDate = dateFormat('YYYY-mm-dd',val)
        this.currentDate = val
        console.log('start',this.startDate)
      }else if (this.startOrEnd === 'end') {
        this.endDate = dateFormat('YYYY-mm-dd',val)
        this.currentDate = val
        console.log('end',this.endDate)
      }

      this.showPop = !this.showPop
    },
    //日期选择之取消
    cancelDate() {
      this.showPop = !this.showPop
    },
    showPopup(val) {
      this.showPop = !this.showPop
      this.startOrEnd = val
      // if(val == 'start') {
      //   this.
      // }
    },
    submit() {
      //如果搜索框的 起始时间 > 截至时间 ，不通过(化成时间戳来比较) 4320000000=3600*24*50*1000
      //搜索所得到的数据就只保存在currentArr中，要是左右切换了，再切回来想看之前那个搜索条件下的数据，需要再搜索一次
    
      this.page = 1
      this.searchParams.page = this.page
      //如果之前划到底了 finished就为true，搜索时置false
      this.finished = false
      let time1 = timestamp(this.startDate)
      let time2 = timestamp(this.endDate)
      if(time1 > time2 ) {
        this.$toast.fail('日期选择不规范！')
      } else {
        if(this.searchParams.xshth.length > 20 ) {
          this.$toast.fail('查询关键字长度不能大于20！')
        }else {
          if(time2 - time1 > 4320000000) {
            console.log('time',time2 - time1)
            this.$toast.fail('查询时间跨度不能大于50天!')
          }else {

             this.$toast.loading({
              message: this.testMSG,
              forbidClick: true,
              duration: this.loadload
            });

            this.searchParams.startdate = this.startDate
            this.searchParams.enddate = this.endDate
            // this.searchParams.xshth = this.xshth
            if (this.radio == '1') {
              this.searchParams.status = 'wait'
              //有可能之前是null，搜索之前置为空字符串
              this.waitPage = ''
              //这个数组不置空的话 onload时可能p会出错
              this.waitArr = []
            }else if (this.radio == '2') {
              this.searchParams.status = 'going'
              this.goingPage = ''
              this.goingArr = []
            }else {
              this.searchParams.status = 'finished'
              this.finishedPage = ''
              this.finishedArr = []
            }
            
            console.log('searchParams',this.searchParams)
            //searchParams组装好了 发请求
            homeList(this.searchParams).then(res => {
              console.log('搜索时的res',res)
              if (res.results.length > 0) {
                this.currentArr = []
                this.currentArr = res.results
                console.log("这个currentArr是没变么",this.currentArr)
                this.nextPage = res.next

                if(this.radio == '1') {
                  this.waitArr = res.results
                }else if(this.radio == '2') {
                  this.goingArr = res.results
                  for (var j in this.currentArr) {
                    this.currentArr[j].percent = this.percentArr[j]
                  }
                }else {
                  this.finishedArr = res.results
                }

                if(res.next === null) {
                  if(this.radio == '1') {
                    this.waitPage = null
                  }else if(this.radio == '2') {
                    this.goingPage = null
                  }else {
                    this.finishedPage = null
                  }
                }

                // this.finished = true

                // this.clearSearch()
                //页面跳到对应的那栏
                
                this.active = this.radio - 1
                this.whetherSearching = true

                this.$nextTick(() => {
                  document.querySelector('.van-tabs__content').scrollTop = 0
                })
                console.log('aaaa',document.querySelector('.van-tabs__content'))
                
                this.show = !this.show
                // this.$toast.loading({
                //   message: this.testMSG,
                //   forbidClick: true,
                //   duration: 2000
                // })
                this.$toast.clear()
              }else {
                this.$toast.fail('未搜索到相应数据!')
                console.log('搜索到的数据为0条')
                this.finished = true
              }
            })
            
          }
        }
      }
      

      // 采购合同号，客户合同号，交货日期，合计不含税金额，单据编号
      // xshth，khhth，fsrq，hjbhsje djbh


    },
    closeSearch() {
      this.show = !this.show
    },
    //清空条件
    clearSearch() {
      this.searchParams.status = ''
      this.searchParams.xshth = ''
      this.searchParams.startdate = ''
      this.searchParams.enddate = ''
      this.startDate = ''
      this.endDate = ''
      this.currentDate = ''
    },
    reset() {
      this.clearSearch()
      this.radio = '1'
      this.whetherSearching = false
    },
    //监听focus事件， 当field一focus就让他blur，手机端就不会弹出输入法了
    focusStart() {
      this.$refs.start.blur()
    },
    focusEnd() {
      this.$refs.end.blur()
    },
    //提交成功的单子存其id进sessionStorage，为true就显示 “已提交”这个tag
    func(id) {
      let array = JSON.parse(getStorage('submitId'))
      for (let o in array) {
        if(array[o] == id)  {
          return true
        }
      }
      return false
    },
    closeHelp() {
      if(this.checked == true) {
        showHelp({'show_help':!this.checked}).then(res => {
          console.log('show help',res)
          this.$store.commit('saveHelp',false)
        })
      }else {
        this.$store.commit('saveHelp',false)
        this.help = false
      }
    },
    closeHelp2() {
      this.help = false
    },
    readHelp() {
      this.help = true
    }
  },
  created() {
    //一进来先让他无限加载，请求拿到res之后就给他clear掉
    this.$toast.loading({
      message: this.testMSG,
      forbidClick: true,
      duration: this.loadload
    });

    setStorage('openid','G00012openid')
    
    // //获取厂商信息
    // userInfo().then(res => {
    //   console.log('厂商信息',res)
    //   this.$store.commit('saveCSBM',res.csbm)
    //   this.$store.commit('saveCSMC',res.csmc)
    //   this.$store.commit('changeName',res.name)
    //   this.$store.commit('changePhone',res.phone)
    //   this.help = res.show_help
    // })

    //拿未完成的总count
    let _ing = JSON.parse(JSON.stringify(this.searchParams))
    _ing.status = 'going'
    homeList(_ing).then(res => {
      this.b = res.count
      console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbb',this.b)
      this.$store.commit('changeIng',res.count)
      this.$set(this.dict,1,`未完成(${this.b})`)
      
    })

    //拿已完成的总count
    let _finished = JSON.parse(JSON.stringify(this.searchParams))
    _finished.status = 'finished'
    homeList(_finished).then(res => {
      this.c = res.count
      this.$store.commit('changeFinished',res.count)
      this.$set(this.dict,2,`已完成(${this.c})`)
    })

    //获取当天时间
    getDate().then(res => {
      console.log("今天时间---",res.time)
      this.$store.commit('saveDate',res.time)
    })

    homeList(this.searchParams).then(res => {
      console.log('初始化wait',res)
      
      this.currentArr = res.results
      this.waitArr = res.results
      this.nextPage = res.next

      if(res.next === null) {
        this.waitPage = null
      }
      this.a = res.count
      //待发货的总count
      this.$store.commit('changeNo',res.count)

      this.$set(this.dict,0,`未发货(${this.a})`)
      
      this.$toast.clear()
    })

    const obj = {
      'xshth': '',
      'startdate': '',
      'enddate': '',
      'status': 'going',
      'page': 1
    }
    
    homeList(obj).then(res => {
      console.log('mounted的res',res)
      this.x_arr = res.results
      if(res.results.length > 0) {
        for (let i in res.results) {
          var obj2 = {order:0}
          obj2.order = res.results[i].id
          goodsDetail(obj2).then(res => {
            console.log('详细信息---',res)
            
            var require = 0
            var receive = 0
            for(var k in res) {
              
              require = require + Number(res[k].require_num)
              receive = receive + Number(res[k].recv_num)
            }
            var percent = (receive/require).toFixed(2) * 100
            console.log('百分比------',percent)
            // this.percentArr.push(Math.trunc(percent))
            // res.results[i].percent = Math.trunc(percent)
            this.currentArr[i].percent = Math.trunc(percent)
            this.x_arr[i].percent = Math.trunc(percent)
          })

        }
      }
    })
  },
  // beforeRouteLeave(to, from, next){
  //   console.log('window',window.scrollY)
  //   let position = window.scrollY
  //   console.log('position的值',position)
  //   this.$store.commit('savePosition', position) //离开路由时把位置存起来
  //   next()
  // },
  activated() {
    console.log('activeted')
    console.log(this.$route.params.id)
    this.func(this.$route.params.id)
    // if(document.querySelector('.tag3')) {
    //   document.querySelector('.tag3').style.display = 'none'
    // }
    if(this.active === 0) {
      //van-tag的item.going没变，这样强制更新
      this.onRefresh()
    }
    //只有里面提交成功才会传回来id，强制更新tag
    if(this.$route.params.id) {
      console.log('进没进force啊')
      this.$forceUpdate()
      
    }
    
    // let position = this.$store.state.position //返回页面取出来
    // window.scrollTo(0, 800)
    // this.$nextTick(() => {
    //   let position = this.$store.state.position //返回页面取出来
    //   window.scrollTo(0, 300 + position)
    // })
  },
  beforeRouteUpdate(to,from,next) {
    console.log('id',this.$route.params.id)
  },
  mounted() {
  },
  updated() {
    
  }
}
</script>

<style scoped lang="less">
  .home {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    width: 100%;
  }
  .section {
    flex: 1;
    overflow: scroll;
  }
  .footer {
    width: 100%;
    height: 0.5rem;
    line-height: 0.5rem;
  }

  .list_item {
    display: flex;
    font-size: 12px;
    margin: .15rem .05rem;
    border: 1px solid #37AE52;
    border-radius: 10px;
    .left_item {
      width: .4rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .left_item p {
      width: 0.3rem;
      height: 0.3rem;
      border-radius: .3rem;
      border: 1px solid #37AE52;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;
    }
    // .left_item img {
    //   width: 0.8rem;
    //   height: 0.8rem;
    //   border-radius: .8rem;
    // }
    .right_item {
      flex: 1;
    }
    .right_item ._top {
      // height: 0.24rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px .1rem 2px 0;
    }
    .right_item ._bottom {
      padding-bottom: 3px;
      position: relative;
    }
    // .right_item ._bottom .progress {
    //   position: absolute;
    //   bottom: 0;
    //   right: 0;
    // }
  }
  
  .search {
    width: .8rem;
    height: .36rem;
    border-radius: 5px;
    
  }
  .reset {
    width: .8rem;
    height: .36rem;
    border-radius: 5px;
    
  }

  .searchIcon {
    font-weight: 1000;
  }

  .btn {
    padding-top: 5px;
    display: flex;
    justify-content: space-evenly;
  }
  ._bottom {
    display: flex;
    ._bottom_left {
      flex: 1;
    }
    ._bottom_right {
      flex: 1;
      display: flex;
      align-items: flex-end;
      padding-bottom: 7px;
    }
  }
  .help .iknow {
    width: 100%;
    height: 40px;
    background-color: #06AE56;
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 0 0 14px 14px;
  }
  .home .help .font18 {
    font-size: 16px;
    margin: 3px 0;
  }
  .help h3 {
    text-align: center;
  }
  .help li span {
    color: #6cf;
  }
  .home .help .red {
    color: #F4606C;
    line-height: 14px;
  }
  .help .content li {
    font-size: 14px;
    color: #666;
  }
  .help .content {
    padding: .2rem .1rem .1rem;
    // height: 250px;
    overflow: scroll;
  }
  .help .van-checkbox {
    font-size: 12px;
  }
  .pl5 {
    padding-left: 8px;
  }
  // 改(覆盖) 一些UI的默认样式

  .header .van-nav-bar {
    // background-color: #6cf;
    background-color: #06AE56;
  }
  .section .list_item:first-child {
    // border-top: 1px solid gray;
  }
  .section .van-divider {
    margin: 0;
  }
  .home .van-overlay.overlay_search .van-cell-group {
    width: 80%;
    border-radius: 10px;
    padding: 15px 15px 10px;
  }
  .home .van-overlay.overlay_help .help {
    width: 70%;
    border-radius: 15px;
    background-color: #fff;
  }
  
  .cross {
    display: flex;
    justify-content: flex-end;
  }
  .van_row {
    margin: .05rem 0;
  }
  
  .section .van-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  // .blankFooter {
  //   width: 100%;
  //   height: 50px;
  // }
  
  //改van-tag颜色 成功
  .bindClass0.van-tag--primary.van-tag--plain {
    // color: #1989FA;
    color: goldenrod;
  }
  .bindClass1.van-tag--primary.van-tag--plain {
    // color: goldenrod;
    color: #f30;
  }
  .bindClass2.van-tag--primary.van-tag--plain {
    color: #07C160;
  }

  // .home .van-ellipsis.van-picker__title {
  //   color: #2c3e50;
  // }
  .home .van-nav-bar__title {
    color: #fff;
  }
  
  //遮罩层要在Tab的滑动横线之上
  .home .van-overlay.overlay_search {
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .home .van-overlay.overlay_help {
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
  }

  .van-progress {
    width: 100%;
  }
</style>

<style >
.home .van-list .list_item {
  display: flex;
  font-size: 12px;
  margin: 0.15rem 0.05rem;
  border: 1px solid #37AE52;
  border-radius: 10px;
}
</style>