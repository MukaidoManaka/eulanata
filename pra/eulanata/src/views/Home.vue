<template>
  <div class="home">
    <div class="header">
      <van-nav-bar title="主页" color="white">
        <template #right>
          <van-icon name="search" size="18" @click="search" v-show="!whetherSearching"/>
          <van-icon name="search" size="24" @click="search" v-show="whetherSearching" dot class="searchIcon"/>
        </template>
      </van-nav-bar>
      <!-- 搜索按钮的弹出框 -->
      <van-overlay :show="show" @click="overlay">
        <van-cell-group>
          <div class="cross">
            <van-icon name="cross" @click="closeSearch"/>
          </div>
          <van-field label="合同号" placeholder="输入采购/销售合同号" v-model="searchParams.khhth"></van-field>
          <van-field is-link @click="showPopup('start')" v-model="startDate" label="选择起始时间"></van-field>
          <van-field is-link @click="showPopup('end')" v-model="endDate" label="选择截至时间"></van-field>
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
    </div>
    <div class="section">
      <van-tabs v-model="active" @change="tabChange" swipeable color="#06AE56">
        <van-tab :key="index" v-for="(item,index) in dict1" :title="item">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              :offset="5"
              :immediate-check="false"
            >
              <div class="list_item" v-for="(item,idx) in currentArr" :key="item.idx" :title="item.hjbhsje" @click="enterDetail(item)">
                <!-- 左边图片 -->
                <div class="left_item">
                  <!-- <img src="@/assets/image/f_qq1.png" alt=""> -->
                  <p> {{idx + 1}} </p>
                </div>
                <!-- 右边订单相关数据 -->
                <div class="right_item">
                  <div class="_top">
                    <span>采购合同号：{{item.khhth}}</span>
                    <van-tag plain type='primary' :class="'bindClass' + `${active}`">{{active === 0 ? '未发货' : (active === 1 ? '未完成' : '已完成')}}</van-tag>
                    <!-- <van-tag plain type='primary' :class="'bindClass' + `${searchParams.status}`">{{searchParams.status === 'wait' ? '未发货' : (searchParams.status === 'going' ? '未完成' : '已完成')}}</van-tag> -->
                    <!-- <van-tag plain type='primary' :class="'bindClass' + `${item.status}`">{{item.status == 0 ? '未发货' : '已完成'}}</van-tag> -->
                    <!-- <van-tag plain type="warning">{{item.status}}</van-tag> -->
                  </div>
                  <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '2px' }"/>
                  <div class="_bottom">
                    <p>销售合同号: {{item.xshth}} </p>
                    <p>交货日期：{{$date(item.fsrq)}} </p>
                    <!-- <p>合计不含税金额：{{item.hjbhsje}} </p> -->
                    <span class="progress" v-show="active === 1"> 已送：约{{item.percent}}% </span>
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
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="selectDate"
        @cancel="cancelDate"
      />
    </van-popup>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import { dateFormat, timestamp } from '@/assets/js/utils'
import { homeList, goodsDetail } from '@/api/all.js'
export default {
  name: 'Home',
  components: {
    Footer
  },
  data() {
    return {
      //区分审核或者通过火已完成3中状态 所需要的中间件
      loading: false,
      finished: false,
      refreshing: false,
      currentRate: 55,
      gradientColor: {
        '0%': '#3fecff',
        '100%': '#6149f6',
      },
      
      show: false,//overlay的显隐
      showPop: false,//popup的显隐
      active: 0,  //tab处于哪一栏
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2025, 5, 1),
      currentDate: new Date(),
      //不管先选起止还是截至，x_date来标记时间
      x_date: '',
      pink: 'pink',
      //区分审核或者通过火已完成3中状态
      // dict1:['全部','未发货','未完成','已完成'],
      dict1:['未发货','未完成','已完成'],
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
      waitPage: '',
      goingPage: '',
      finishedPage: '',

      formatDate: '',
      startOrEnd: '', //此时是在选择起始还是截至时间  start/end
      radio: "1", //搜索框中的单选按钮，这东西得是字符串，就能默认选中了
      searchParams: {
        khhth: '',
        startdate: '',
        enddate: '',
        status: 'wait', //默认显示wait未发货
      },
      page: 1,  //分页の第一页
      whetherSearching: false, //搜索条件是否正在生效,
      testMSG: '加载加载',
      loadload: 20000,  //20秒

      percentArr: [],
      emptyArr: []
    }
  },
  methods: {
    onLoad() {
      //判断是在哪一栏执行这个上拉加载动作
      // if(this.active === 0) {
      //   //如果这个为true，就说明目前是有搜索条件在的，是onload一个搜索条件下的剩余列表 ，page什么的至少也是第二第三页
      //   if(this.whetherSearching) {
      //     this.page += 1
      //     this.searchParams.page = this.page
      //     homeList(this.searchParams).then(res => {
      //       console.log('某某搜索条件下的onload',res)
      //       if (res.results.length > 0) {
      //         this.currentArr = [...currentArr,...res.results]
      //         this.waitArr = this.currentArr
      //       }
      //     })
      //   }else {

      //   }

      // }


      //onload时有两种情况的考虑：①此时是否有搜索条件？反正每次请求的东东都在searchParams里存的好好的，有无搜索条件都用searchParams就没错
      //②此时列表处于哪一栏？每次切换栏目的时候都clear了searchParams，所以也没事
      //综上，昨天“灵机一动”地去定义whetherSearching这个变量以及还去区分是哪一栏进行的onload动作的我是个🤡了
      //不对，②还是有必要的，已经onlaod过的数据放waitArr goingArr finishedArr里面，不然三栏互相切换的时候每次都只有新请求10条

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
            if (res.results.length > 0) {
              //给percentArr里面新增数据
              for (var i in res.results) {
                var obj2 = {djbh:''}
                
                obj2.djbh = res.results[i].djbh
                goodsDetail(obj2).then(res => {
                  
                  console.log('详细信息---',res)
                  var require = 0
                  var receive = 0
                  for(var k in res) {
                    
                    require = require + Number(res[k].require_num)
                    receive = receive + Number(res[k].recv_num)
                  }
                  console.log('打印前的require ',require)
                  console.log('打印前的receive',receive)
                  var percent = (receive/require).toFixed(2) * 100
                  console.log('百分比------',percent)
                  this.percentArr.push(percent)
                }).then(res => {
                  console.log('onload时更新percent',this.percentArr)
                  this.currentArr = [...this.currentArr,...this.emptyArr]
                  this.goingArr = this.currentArr
                  for (var j in this.currentArr) {
                    this.currentArr[j].percent = this.percentArr[j]
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
          }).catch(err => {
            console.log("error------------",err.code)
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
          for (var j in this.currentArr) {
            this.currentArr[j].percent = this.percentArr[j]
          }

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
    enterDetail(item) {
      console.log('看看item',item)
      console.log('active',this.active)
      //0表示点击事件时tab处于未发货这一栏，就去填写页
      if (this.active === 0 ) {
        this.$router.push({name: 'WriteOrder', params: {item, status: '未发货'}})
      }else if(this.active === 1) {
        this.$router.push({name:'Wwc',params:{item, status: '未完成'}})
      }else {
        this.$router.push({name:'ListDetail',params:{item, status: '已完成'}})
      }
      
    },
    tabChange(name,title) {
      console.log('title',title)
      console.log('name',name)

      //栏目切换了 clear一下
      this.reset()

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
            
            if(res.next === null) {
              this.waitPage = null
              this.finished = true
            }
            this.$toast.clear()
          })
        }else {
          this.searchParams.status = 'wait'
          this.currentArr = this.waitArr
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

          homeList(this.searchParams).then(res => {
            console.log('未完成',res)
            this.currentArr = res.results
            this.goingArr = res.results
            this.nextPage = res.next
            
            if(res.next === null) {
              this.goingPage = null
              this.finished = true
            }
            //显示百分比的
            for (var j in this.currentArr) {
              this.currentArr[j].percent = this.percentArr[j]
            }
            this.$toast.clear()
          })
        }else {
          this.searchParams.status = 'going'
          this.currentArr = this.goingArr
          //显示百分比
          for (var j in this.currentArr) {
            this.currentArr[j].percent = this.percentArr[j]
          }
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
            
            if(res.next === null) {
              this.finishedPage = null
              this.finished = true
            }
            this.$toast.clear()
          })
        }else {
          this.searchParams.status = 'finished'
          this.currentArr = this.finishedArr
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
      let time1 = timestamp(this.startDate)
      let time2 = timestamp(this.endDate)
      if(time1 > time2 ) {
        this.$toast.fail('日期选择不规范！')
      } else {
        if(this.searchParams.khhth.length > 10 ) {
          this.$toast.fail('查询关键字长度不能大于10！')
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
            // this.searchParams.khhth = this.khhth
            if (this.radio == '1') {
              this.searchParams.status = 'wait'
            }else if (this.radio == '2') {
              this.searchParams.status = 'going'
            }else {
              this.searchParams.status = 'finished'
            }
            
            console.log('searchParams',this.searchParams)
            //searchParams组装好了 发请求
            homeList(this.searchParams).then(res => {
              console.log('搜索时的res',res)
              if (res.results.length > 0 && res.results.length <= 9) {
                this.currentArr = []
                this.currentArr = res.results
                this.nextPage = res.next

                if(res.next === null) {
                  if(this.radio == '1') {
                    this.waitPage = null
                  }else if(this.radio == '2') {
                    this.goingPage = null
                  }else {
                    this.finishedPage = null
                  }
                }

                this.finished = true

                // this.clearSearch()
                //页面跳到对应的那栏
                
                this.active = this.radio - 1
                this.whetherSearching = true
                
                this.show = !this.show
                this.$toast.loading({
                  message: this.testMSG,
                  forbidClick: true,
                  duration: 2000
                })
                this.$toast.clear()
              }else {
                this.$toast.fail('未搜索到相应数据!')
                console.log('搜索到的数据为0条')
              }
            })
            
           
            
          }
        }
      }
      

      // 采购合同号，销售合同号，交货日期，合计不含税金额，单据编号
      // khhth，xshth，fsrq，hjbhsje djbh


    },
    closeSearch() {
      this.show = !this.show
    },
    //清空条件
    clearSearch() {
      this.searchParams.status = ''
      this.searchParams.khhth = ''
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
    percent() {
      let count = 0
      let arr = []
      const obj = {
        'khhth': '',
        'startdate': '',
        'enddate': '',
        'status': 'going',
        'page': 1
      }
      homeList(obj).then(res => {
        console.log('mounted的res',res)
        if(res.results.length > 0) {
          for (var i in res.results) {
            var obj2 = {djbh:''}
            obj2.djbh = res.results[i].djbh
            goodsDetail(obj2).then(res => {
              console.log('详细信息---',res)
              var require = 0
              var receive = 0
              for(var k in res) {
                
                require = require + Number(res[k].require_num)
                receive = receive + Number(res[k].recv_num)
              }
              console.log('打印前的require ',require)
              console.log('打印前的receive',receive)
              var percent = (receive/require).toFixed(2) * 100
              console.log('百分比------',percent)
              arr.push(percent)
            }).then(res => {
              console.log('neng够这样用吗',arr)
            })

          }
          console.log('总的arr',arr)
        }
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
    homeList(this.searchParams).then(res => {
      console.log('初始化wait',res)
      
      this.currentArr = res.results
      this.waitArr = res.results
      this.nextPage = res.next

      if(res.next === null) {
        this.waitPage = null
      }
      this.$toast.clear()
    })

  },
  beforeRouteLeave(to, from, next){
    console.log('window',window.scrollY)
    let position = window.scrollY
    console.log('position的值',position)
    this.$store.commit('savePosition', position) //离开路由时把位置存起来
    next()
  },
  activated() {
    console.log('activeted')
    let position = this.$store.state.position //返回页面取出来
    window.scrollTo(0, 800)
    // this.$nextTick(() => {
    //   let position = this.$store.state.position //返回页面取出来
    //   window.scrollTo(0, 300 + position)
    // })
  },
  mounted() {
    const obj = {
      'khhth': '',
      'startdate': '',
      'enddate': '',
      'status': 'going',
      'page': 1
    }
    homeList(obj).then(res => {
      console.log('mounted的res',res)
      if(res.results.length > 0) {
        for (var i in res.results) {
          var obj2 = {djbh:''}
          obj2.djbh = res.results[i].djbh
          goodsDetail(obj2).then(res => {
            console.log('详细信息---',res)
            var require = 0
            var receive = 0
            for(var k in res) {
              
              require = require + Number(res[k].require_num)
              receive = receive + Number(res[k].recv_num)
            }
            console.log('打印前的require ',require)
            console.log('打印前的receive',receive)
            var percent = (receive/require).toFixed(2) * 100
            console.log('百分比------',percent)
            this.percentArr.push(percent)
          }).then(res => {
            console.log('neng够这样用吗',this.percentArr)
          })

        }
        // console.log('总的percent',this.percentArr)
      }
    })
    
  },
  updated() {
    
  }
}
</script>

<style scoped lang="less">
  .home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    // position: relative;
  }
  .header {
    width: 100%;
    // position: fixed;
    // left: 0;
    // top: 0;
    // z-index: 100;
    // margin-bottom: .46rem;
  }
  .section {
    flex: 1;
    overflow: scroll;
    // margin-top: .46rem;
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
      font-size: 22px;
      text-align: center;
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
    .right_item ._bottom .progress {
      position: absolute;
      bottom: 0;
      right: 0;
    }
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
  .home .van-overlay .van-cell-group {
    width: 80%;
    border-radius: 10px;
    padding: 15px 15px 10px;
  }
  .cross {
    display: flex;
    justify-content: flex-end;
  }
  .van_row {
    margin: .05rem 0;
  }
  // .section {
  //   position: relative;
  // }
  // .section .van-tabs--line .van-tabs__wrap {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   z-index: 101;
  //   margin-top: .9rem;
  // }

  //想让van-tabs那四个选项像header一样固定在顶部不动，还未成功  成功了，写到init.css里面就生效了
  .section .van-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  // .section .van-tabs.van-tabs--line .van-tabs__wrap {
  //   overflow: visible;
  // }
  // .section .van-tabs.van-tabs--line .van-tabs__content {
  //   flex: 1;
  //   overflow: scroll;
  // }
  // .section .van-tabs>div:first-child {
  //   overflow: visible;
  // }
  // .section .van-tabs>div:last-child {
  //   flex: 1;
  //   overflow: scroll;
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
  .home .van-overlay {
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  // .home .van-tab__pane {
  //   height: 100%;
  // }
  // .home .van-pull-refresh {
  //   height: 101%;
  // }
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