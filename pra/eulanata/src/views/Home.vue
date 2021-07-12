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
                  <p>{{idx + 1}}</p>
                </div>
                <!-- 右边订单相关数据 -->
                <div class="right_item">
                  <div class="_top">
                    <span>采购合同号：{{item.djbh}}</span>
                    <div>
                      <!-- <van-tag plain type='primary' v-if="func(item.id)" style="margin-right:3px">已提交</van-tag> -->
                      <van-tag plain type='primary' v-if="item.going && active === 0 || func(item.id)" style="margin-right:3px">已提交</van-tag>
                      <van-tag plain type='primary' :class="'bindClass' + `${active}`" class="tag3" v-if="active === 1 || !item.going">{{active === 0 ? '未发货' : (active === 1 ? '未完成' : '已完成')}}</van-tag>
                    </div>
                    <!-- <van-tag plain type='primary' :class="'bindClass' + `${searchParams.status}`">{{searchParams.status === 'wait' ? '未发货' : (searchParams.status === 'going' ? '未完成' : '已完成')}}</van-tag> -->
                    <!-- <van-tag plain type='primary' :class="'bindClass' + `${item.status}`">{{item.status == 0 ? '未发货' : '已完成'}}</van-tag> -->
                    <!-- <van-tag plain type="warning">{{item.status}}</van-tag> -->
                  </div>
                  <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '2px' }"/>
                  <div class="_bottom">
                    <div class="_bottom_left">
                      <p>客户合同号: {{item.xshth}} </p>
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
    <van-overlay :show="show" class="overlay_search">
      <van-cell-group>
        <div class="cross">
          <van-icon name="cross" @click="closeSearch"/>
        </div>
        <van-field label="合同号" placeholder="输入采购/客户合同号" v-model="searchParams.xshth" clearable></van-field>
        <van-field is-link @click="showPopup('start')" v-model="startDate" label="选择起始时间" @focus="focusStart" ref="start"></van-field>
        <van-field is-link @click="showPopup('end')" v-model="endDate" label="选择截至时间" @focus="focusEnd" ref="end"></van-field>
        <van-radio-group v-model="radio" checked-color="#60C08B">
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
    <van-overlay class="overlay_help" v-if="help2" :show="help2">
      <div class="help">
        <div class="content">
          <h3>使用说明</h3>
          <ul>
            <li class="font18">主要功能：</li>
            <li class="pl5"> 1.查看订单详情及发货记录</li>
            <li class="pl5"> 2.接收新订单提醒</li>
            <li class="pl5"> 3.填写发货单</li>
            <li class="font18">操作步骤：</li>
            <li class="pl5"> 点击任意订单-><span>填写发货单</span>->发货数量-><span>保存</span>-><span>提交</span></li>
            <li></li>
            <li class="font18">订单状态：</li>
            <li class="pl5"> 未发货：未发货的订单</li>
            <li class="pl5"> 未完成：部分发货的订单</li>
            <li class="pl5"> 已完成：全部发货的订单</li>
            <li class="pl5"> 已提交：已填写发货单的订单</li>
            <li></li>
            <li class="red"> 备注：</li>
            <li class="red"> 1.发货数量请如实填写</li>
            <li class="red"> 2.货物入库手续完成后，订单状态才会改变</li>
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
            <li class="pl5"> 1.查看订单详情及发货记录</li>
            <li class="pl5"> 2.接收新订单提醒</li>
            <li class="pl5"> 3.填写发货单</li>
            <li class="font18">操作步骤：</li>
            <li class="pl5"> 点击任意订单-><span>填写发货单</span>->发货数量-><span>保存</span>-><span>提交</span></li>
            <li></li>
            <li class="font18">订单状态：</li>
            <li class="pl5"> 未发货：未发货的订单</li>
            <li class="pl5"> 未完成：部分发货的订单</li>
            <li class="pl5"> 已完成：全部发货的订单</li>
            <li class="pl5"> 已提交：已填写发货单的订单</li>
            <li></li>
            <li class="red"> 备注：</li>
            <li class="red"> 1.发货数量请如实填写</li>
            <li class="red"> 2.货物入库手续完成后，订单状态才会改变</li>
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
import { dateFormat, timestamp, setLocal, getStorage, getLocal, setStorage,transformObj, decodeurl } from '@/assets/js/utils.js'
import { homeList, goodsDetail, userInfo, getDate, showHelp, getOpenid, getToken } from '@/api/all.js'
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
      
      show: false,//overlay_search的显隐
      showPop: false,//popup的显隐
      help: false,  //帮助（使用指南）的显隐
      help2:false,
      active: 0,  //tab处于哪一栏
      minDate: new Date(2021, 0, 1),
      maxDate: new Date(2025, 5, 1),
      currentDate: new Date(),
      
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
      testMSG: '加载中~',
      loadload: 20000,  //20秒

      percentArr: [], //装百分比的数组
      emptyArr: [],
      a:0,  //a b c分别代表 未发货未完成已完成的数量，和上面的dict与$set一起食用
      b:0,
      c:0,
      x_arr: [],  //用来存goingArr，初始就计算好going第一页的percent
      submitId: 0,
      code: '', //微信的code
      scrollTop: ''
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
            console.log("error------------",err.response)
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
            // this.emptyArr = res.results
            
            if (res.results.length > 0) {
              this.currentArr = [...this.currentArr,...res.results]
              this.goingArr = this.currentArr
              this.nextPage = res.next
              this.loading = false
              this.refreshing = false

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
          // this.currentArr = this.x_arr 
          // this.goingArr = this.x_arr 
          this.goingArr = res.results
          
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
      console.log('进入详情的scrollTop',document.querySelector('.van-tabs__content').scrollTop)
      this.$store.commit('savePosition',document.querySelector('.van-tabs__content').scrollTop)

      //0表示点击事件时tab处于未发货这一栏，就去填写页
      if (this.active === 0 ) {
        this.$router.push({name: 'WriteOrder', query: {id}})
      }else if(this.active === 1) {
        this.$router.push({name:'Wwc',query:{id}})
      }else {
        this.$router.push({name:'ListDetail',query:{id}})
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
        this.radio = '1'
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
        this.radio = '2'
        //如果goingArr里面没值，就去请求
        if(this.goingArr.length === 0) {
          this.$toast.loading({
            message: this.testMSG,
            forbidClick: true,
            duration: this.loadload
          });

          this.searchParams.status = 'going'

          // this.currentArr = this.x_arr
          // this.goingArr = this.x_arr

          homeList(this.searchParams).then(res => {

            console.log('切换到未完成',res)
            this.currentArr = res.results
            this.goingArr = res.results
            
            this.nextPage = res.next
            this.loading = false
            
            if(res.next === null) {
              this.goingPage = null
              this.finished = true
            }
            
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
        this.radio = '3'
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
                  // for (var j in this.currentArr) {
                  //   this.currentArr[j].percent = this.percentArr[j]
                  // }
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

                
                this.show = !this.show
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
          this.help2 = false
        })
      }else {
        this.$store.commit('saveHelp',false)
        this.help2 = false
        // this.help = false
      }
    },
    closeHelp2() {
      this.help = false
    },
    readHelp() {
      this.help = true
    },
    //不管有没有openid都要执行的请求，当没openid时得在openid异步结束之后再请求
    init() {
      //post请求需要的token
      getToken().then(res => {
        this.$store.commit('saveToken',res.token)
        setStorage("token",res.token)
        console.log('token--',res.token)
      })
      //获取厂商信息
      userInfo().then(res => {
        console.log('App里面的请求--厂商信息',res)
        this.$store.commit('saveCSBM',res.csbm)
        this.$store.commit('saveCSMC',res.csmc)
        this.$store.commit('changeName',res.name)
        this.$store.commit('changePhone',res.phone)
        this.$store.commit('saveHelp',res.show_help)
        this.help2 = res.show_help
        this.$store.commit('saveAvatar',res.headimgurl)
        this.$store.commit('saveNickname',res.nickname)
        // this.$store.commit('saveUserinfo',[res.headimgurl,res.nickname])
      })

      //拿未完成的总count
      let _ing = JSON.parse(JSON.stringify(this.searchParams))
      _ing.status = 'going'
      homeList(_ing).then(res => {
        this.b = res.count
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
    }
  },

  
  created() {
    //一进来先让他无限加载，请求拿到res之后就给他clear掉
    this.$toast.loading({
      message: this.testMSG,
      forbidClick: true,
      duration: this.loadload
    });

    //没有openid就去else请求 
    
    if (getLocal('openid') && getLocal('openid') !== 'undefined'){
      console.log('进if了')
      console.log('if true的openid',getLocal('openid'))
      this.init()
    }else {
      const local = window.location.href
      const hash = window.location.hash 
      const o = decodeurl(local)
      const code = o.code // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      console.log(code)
      const baseurl = 'http://www.keeplong.vip/dist/'
      const url = baseurl + hash
      console.log(url)
      if (code == null || code === '') {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.state.appid + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
      } else {
        console.log('else')
        getOpenid({'code':code}).then(res => {
          console.log('openid的res',res)
          this.$store.commit('saveOpenid',res.open_id)
          setStorage('openid',res.open_id)
          setLocal('openid',res.open_id)
          this.init()
        })
      }
    }
    

  },
  activated() {
    console.log('activeted')
    // document.querySelector('.van-tabs__content').scrollTop = this.$store.state.position
    console.log(this.$route.params.id)
    this.func(this.$route.params.id)
    if(this.active === 0) {
      //van-tag的item.going没变，这样强制更新
      if (getLocal('openid') && typeof(getLocal('openid')) !== 'undefined') {
        this.onRefresh()
        // this.$forceUpdate()
      }
    }else {
      document.querySelector('.van-tabs__content').scrollTop = this.$store.state.position
    }

    //只有里面提交成功才会传回来id，强制更新tag
    if(this.$route.params.id) {
      console.log('进没进force啊')
      this.$forceUpdate()
    }
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
 
  .section .van-divider {
    margin: 0;
  }
  .home .van-overlay.overlay_search .van-cell-group {
    width: 80%;
    border-radius: 10px;
    padding: 15px 15px 10px;
  }
  .home .van-overlay.overlay_help .help {
    width: 80%;
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
    z-index: 2;
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
  .home .van-hairline--top-bottom::after {
    border: 0;
  }

</style>

<style >
/* 没有scoped的css 兼容data-v-****没绑定上的dom元素 */
.home .van-list .list_item {
  display: flex;
  font-size: 12px;
  margin: 0.15rem 0.05rem;
  border: 1px solid #37AE52;
  border-radius: 10px;
}
</style>