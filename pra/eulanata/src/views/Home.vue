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
          <van-field label="客户合同号" placeholder="输入客户合同号" v-model="searchParams.khhth"></van-field>
          <van-field is-link @click="showPopup('start')" v-model="startDate" label="选择起始时间"></van-field>
          <van-field is-link @click="showPopup('end')" v-model="endDate" label="选择截至时间"></van-field>
          <van-radio-group v-model="radio" checked-color="#60C08B">
            <!-- <van-row type="flex" justify="space-around" class="van_row">
              <van-col span="1"></van-col>
              <van-col span="11"><van-radio name="1">全部</van-radio></van-col>
              <van-col span="11"><van-radio name="2">待发货</van-radio></van-col>
              <van-col span="1"></van-col>
            </van-row>
            <van-row>
              <van-col span="1"></van-col>
              <van-col span="11"><van-radio name="3">送货中</van-radio></van-col>
              <van-col span="11"><van-radio name="4">已完成</van-radio></van-col>
              <van-col span="1"></van-col>
            </van-row> -->
            <van-row type="flex" justify="space-around" class="van_row">
              <van-col span="8"><van-radio name="1">待发货</van-radio></van-col>
              <van-col span="8"><van-radio name="2">送货中</van-radio></van-col>
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
      <van-tabs v-model="active" @click="tabClick" @change="tabChange" swipeable color="#06AE56">
        <van-tab :key="index" v-for="(item,index) in dict1" :title="item">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <div class="list_item" v-for="item in currentArr" :key="item.id" :title="item.hjbhsje" @click="enterDetail(item.djbh)">
                <!-- 左边图片 -->
                <div class="left_item">
                  <img src="@/assets/image/f_qq1.png" alt="">
                </div>
                <!-- 右边订单相关数据 -->
                <div class="right_item">
                  <div class="_top">
                    <span>客户合同号：{{item.khhth}}</span>
                    <van-tag plain type='primary' :class="'bindClass' + `${searchParams.status}`">{{searchParams.status === 'wait' ? '待发货' : (searchParams.status === 'going' ? '送货中' : '已完成')}}</van-tag>
                    <!-- <van-tag plain type='primary' :class="'bindClass' + `${item.status}`">{{item.status == 0 ? '待发货' : '已完成'}}</van-tag> -->
                    <!-- <van-tag plain type="warning">{{item.status}}</van-tag> -->
                  </div>
                  <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '2px' }"/>
                  <div class="_bottom">
                    <p>销售合同号: {{item.xshth}} </p>
                    <p>交货日期：{{item.fsrq}} </p>
                    <p>合计不含税金额：{{item.hjbhsje}} </p>
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
// import json from '../../mock3.json'
import Footer from '@/components/Footer'
import { dateFormat, dateFormat2, timestamp } from '@/assets/js/utils'
import { homeList, homeListDetail } from '@/api/all.js'
export default {
  name: 'Home',
  components: {
    Footer
  },
  data() {
    return {
      //区分审核或者通过火已完成3中状态 所需要的中间件
      newJson: [],
      loading: false,
      finished: false,
      refreshing: false,
      
      show: false,//overlay的显隐
      showPop: false,//popup的显隐
      active: 0,  //tab处于哪一栏
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2025, 5, 1),
      currentDate: new Date(2021, 5, 15),
      //不管先选起止还是截至，x_date来标记时间
      x_date: '',
      pink: 'pink',
      //区分审核或者通过火已完成3中状态
      // dict1:['全部','待发货','送货中','已完成'],
      dict1:['待发货','送货中','已完成'],
      x_status: 0,
      x_name: '',

      //搜索时日期的起始截至时间
      startDate: '',
      endDate: '',

      currentArr:[],
      waitArr:[],
      goingArr:[],
      finishedArr:[],
      formatDate: '',
      startOrEnd: '', //此时是在选择起始还是截至时间  start/end
      radio: "1", //这东西得是字符串，就能默认选中了
      searchParams: {
        khhth: '',
        startdate: '',
        enddate: '',
        status: 'wait', //默认显示wait待发货
      },
      page: 1,
      whetherSearching: false, //搜索条件是否正在生效
    }
  },
  methods: {
    onLoad() {
      //判断是在哪一栏执行这个上拉加载动作
      if(this.active === 0) {
        //如果这个为true，就说明目前是有搜索条件在的，是onload一个搜索条件下的剩余列表 ，page什么的至少也是第二第三页
        // if(this.whetherSearching) {
        //   this.page += 1
        //   this.searchParams.page = this.page
        //   homeList(this.searchParams).then(res => {
        //     console.log('某某搜索条件下的onload',res)
        //     if (res.results.length > 0) {
        //       this.currentArr = [...currentArr,...res.results]
        //       this.waitArr = this.currentArr
        //     }
        //   })
        // }else {

        // }

      }


      this.page += 1
      this.searchParams.page = this.page
      homeList(this.searchParams).then(res => {
        console.log('某某搜索条件下的onload',res)
        if (res.results.length > 0) {
          this.currentArr = [...this.currentArr,...res.results]
          this.waitArr = this.currentArr
          this.loading = false
          this.refreshing = false
        }else { // length = 0
          this.loading = false
          this.refreshing = false
          this.finished = true
        }
      })
      
    },
    onRefresh() {


      setTimeout(() => {
        // 清空列表数据
        this.finished = false

        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true
        this.onLoad()
      },1000)
    },
    enterDetail(djbh) {
      console.log('看看djbh',djbh)
      console.log('active',this.active)
      //0表示点击事件时tab处于待发货这一栏，就去填写页
      if (this.active == 0 ) {
        this.$router.push({name: 'WriteOrder', params: {djbh: djbh}})
      }else {
        this.$router.push({name:'ListDetail',params:{djbh:djbh}})
      }
      
    },
    tabClick(name,title) {
      console.log('title',title)

      this.clearSearch()
      if(name == 0) {
        //如果waitArr里面没值，就去请求
        if(this.waitArr.length === 0) {
          this.searchParams.status = 'wait'
          homeList(this.searchParams).then(res => {
            this.currentArr = res.results
            this.waitArr = res.results
          })
        }else {
          this.currentArr = this.waitArr
        }
      }else if (name == 1) {
        //如果goingArr里面没值，就去请求
        if(this.goingArr.length === 0) {
          this.searchParams.status = 'going'
          homeList(this.searchParams).then(res => {
            this.currentArr = res.results
            this.goingArr = res.results
          })
        }else {
          this.currentArr = this.goingArr
        }
      }else if (name == 2) {
        //如果finishedArr里面没值，就去请求
        if(this.finishedArr.length === 0) {
          this.searchParams.status = 'finished'
          homeList(this.searchParams).then(res => {
            this.currentArr = res.results
            this.finishedArr = res.results
          })
        }else {
          this.currentArr = this.finishedArr
        }
      }

    },
    tabChange(name,title) {
      console.log('title',title)

      this.clearSearch()
      if(name == 0) {
        //如果waitArr里面没值，就去请求
        if(this.waitArr.length === 0) {
          this.searchParams.status = 'wait'
          homeList(this.searchParams).then(res => {
            console.log('待发货',res)
            this.currentArr = res.results
            this.waitArr = res.results
          })
        }else {
          this.currentArr = this.waitArr
        }
      }else if (name == 1) {
        //如果goingArr里面没值，就去请求
        if(this.goingArr.length === 0) {
          this.searchParams.status = 'going'
          homeList(this.searchParams).then(res => {
            console.log('送货中',res)
            this.currentArr = res.results
            this.goingArr = res.results
          })
        }else {
          this.currentArr = this.goingArr
        }
      }else if (name == 2) {
        //如果finishedArr里面没值，就去请求
        if(this.finishedArr.length === 0) {
          this.searchParams.status = 'finished'
          homeList(this.searchParams).then(res => {
            console.log('已完成',res)
            this.currentArr = res.results
            this.finishedArr = res.results
          })
        }else {
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
        this.currentDate = dateFormat2(dateFormat('YYYY-mm-dd',val))
        console.log(this.startDate)
      }else if (this.startOrEnd === 'end') {
        this.endDate = dateFormat('YYYY-mm-dd',val)
        this.currentDate = dateFormat2(dateFormat('YYYY-mm-dd',val))
        console.log(this.endDate)
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
    },
    submit() {
      //如果搜索框的 起始时间 > 截至时间 ，不通过(化成时间戳来比较) 4320000000=3600*24*50*1000
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
            this.searchParams.startDate = this.startDate
            this.searchParams.endDate = this.endDate
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
              if (res.results.length > 0) {
                this.currentArr = res.results

                // this.clearSearch()
                //页面跳到对应的那栏
                
                this.active = this.radio - 1
                this.whetherSearching = true
                this.show = !this.show
              }else {
                console.log('搜索到的数据为0条')
              }
            })
            
           
            
          }
        }
      }
      

      // 客户合同号，销售合同号，交货日期，合计不含税金额，单据编号
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
    },
    reset() {
      this.clearSearch()
      this.whetherSearching = false
      //清空之后重新定位到待发货那一栏去
      this.searchParams.status = 'wait'
      this.active = 0
      homeList(this.searchParams).then(res => {
        this.currentArr = res.results
      })
    }
  },
  created() {
    //读本地json当作是请求
    // console.log(require('../../mock3.json'))
    // this.currentArr = json.filter((item) => {
    //   return item.status == 0
    // })

    // this.$axios.get(`/api/orderforms?page=${this.page}`).then(res => {
    //   console.log('res',res)
    //   this.currentArr = res.data.results
    // })

    homeList(this.searchParams).then(res => {
      console.log('初始化wait',res)
      this.currentArr = res.results
    })

    // homeListDetail('D000126235').then(res => {
    //   console.log('编号',res)
    // })

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
    border-bottom: 1px solid gray;
    font-size: .12px;
    .left_item {
      width: 1rem;
      height: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .left_item img {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: .8rem;
    }
    .right_item {
      flex: 1;
    }
    .right_item ._top {
      height: 0.34rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: .1rem;
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
  .bindClasswait.van-tag--primary.van-tag--plain {
    // color: #1989FA;
    color: goldenrod;
  }
  .bindClassgoing.van-tag--primary.van-tag--plain {
    // color: goldenrod;
    color: #f30;
  }
  .bindClassfinished.van-tag--primary.van-tag--plain {
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
</style>
