<template>
  <div class="home">
    <div class="header">
      <van-nav-bar title="主页" color="white">
        <template #right>
          <van-icon name="search" size="18" @click="search"/>
        </template>
      </van-nav-bar>
      <van-overlay :show="show" @click="overlay">
        <div class="wrapper" @click="overlay1">
          <van-datetime-picker
            v-model="currentDate"
            type="year-month"
            title="选择年月"
            :min-date="minDate"
            :max-date="maxDate"
            :formatter="formatter"
            @confirm="selectDate"
          />
        </div>
      </van-overlay>
    </div>
    <div class="section">
      <van-tabs v-model="active2" @click="tabClick" @change="tabChange" swipeable color="#06AE56">
        <van-tab :key="index" v-for="(item,index) in dict1" :title="item">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <div class="list_item" v-for="item in data1" :key="item.id" :title="item.supplierName" @click="enterDetail(item.id)">
                <div class="left_item">
                  <img src="@/assets/image/f_qq1.png" alt="">
                </div>
                <div class="right_item">
                  <div class="_top">
                    <span>送货单号：{{item.arrivalNo}}</span>
                    <!-- <van-tag plain type='primary' :class="'bindClass' + `${item.status}`">{{item.status == 0 ? '待填写' : (item.status == 1 ? '待发货' : '已完成')}}</van-tag> -->
                    <van-tag plain type='primary' :class="'bindClass' + `${item.status}`">{{item.status == 0 ? '待发货' : '已完成'}}</van-tag>
                    <!-- <van-tag plain type="warning">{{item.status}}</van-tag> -->
                  </div>
                  <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '2px' }"/>
                  <div class="_bottom">
                    <p>创建时间： {{item.createTime}} </p>
                    <p>送货地：{{item.supplierName}} </p>
                    <p>预计送达：2021.01.01 22:23:24 </p>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <Footer />
  </div>
</template>

<script>
import json from '../../mock.json'
import Footer from '@/components/Footer'
import { dateFormat } from '@/assets/js/utils'
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

      show: false,
      // active: 0,
      active2: 0,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17),
      pink: 'pink',
      //区分审核或者通过火已完成3中状态
      // dict1:['全部','待填写','待发货','已完成'],
      dict1:['全部','待发货','已完成'],
      x_status: 0,
      x_name: '',

      date: '2021-06-06 10:11:12',
      kehu: '嘉兴凯隆智能有限公司',
      data1:[],
      oneItem: {
        "id": 833,
        "arrivalNo": "DH2021050900002",
        "arrivalDate": "2021-05-20",
        "purchaseNo": "D000000067          ",
        "supplierCode": null,
        "supplierName": "梁山群达工贸有限公司",
        "status": "0",
        "createBy": "keepAdmin",
        "createTime": "2021-05-09 17:52:40",
        "verifyBy": "",
        "verifyTime": null,
        "remark": null,
        "deliveryNo": null,
        "saleNo": "100426A",
        "source": null
      },
      formatDate: ''
    }
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        // if (this.refreshing) {
        //   this.data1 = require('../../mock.json')
        //   this.refreshing = false
        // }

        // if(this.data1.length <= 10) {
        //   this.data1.push(this.oneItem)
        //   this.loading = false
        // }

        this.finished = true
        this.loading = false
        this.refreshing = false
       
      }, 1000)
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
    enterDetail(id) {
      console.log('看看id',id)
      console.log('acttive2',this.active2)
      //0表示待填写，就去填写页
      if (this.active2 == 1 ) {
        this.$router.push({name: 'WriteOrder', params: {id: id}})
      }else {
        this.$router.push({name:'ListDetail',params:{id:id}})
      }
      
    },
    tabClick(name,title) {
      console.log('name',name)
      console.log('title',title)
      if(name == 1) {
        this.newJson = require('../../mock.json')
        this.data1 = this.newJson.filter((item) => {
          return item.status == 0
        })
      }else if (name == 2) {
        this.newJson = require('../../mock.json')
        this.data1 = this.newJson.filter((item) => {
          return item.status == 1
        })
      }else if (name == 3) {
        this.newJson = require('../../mock.json')
        this.data1 = this.newJson.filter((item) => {
          return item.status == 2
        })
      }else {
        this.data1 = require('../../mock.json')
      }

      console.log('filter之后的数据',this.data1)
    },
    tabChange(name,title) {
      console.log('name',name)
      console.log('title',title)
      console.log("active",this.active2)

      if(name == 1) {
        this.newJson = require('../../mock.json')
        this.data1 = this.newJson.filter((item) => {
          return item.status == 0
        })
      }else if (name == 2) {
        this.newJson = require('../../mock.json')
        this.data1 = this.newJson.filter((item) => {
          return item.status == 1
        })
      }else if (name == 3) {
        this.newJson = require('../../mock.json')
        this.data1 = this.newJson.filter((item) => {
          return item.status == 2
        })
      }else {
        this.data1 = require('../../mock.json')
      }

      console.log('filter之后的数据',this.data1)
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
      }
      return val;
    },
    selectDate(val) {
      this.formatDate = val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate() + ' ' + val.getHours() + ':' + val.getMinutes() + ':' + val.getSeconds(); 
      console.log("格式化",this.formatDate)
      console.log(dateFormat('YYYY-mm-dd', val))
      this.show = !this.show
    }
  },
  created() {
    //读本地json当作是请求后端
    console.log(require('../../mock.json'))
    console.log('json值',json)
    this.data1 = json

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
    font-size: .12rem;
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

  //想让van-tabs那四个选项像header一样固定在顶部不动，还未成功
  .section .van-tabs {
    // display: flex;
    flex-direction: column;
    height: 100%;
  }
  .section .van-tabs.van-tabs--line .van-tabs__wrap {
    overflow: visible;
  }
  .section .van-tabs.van-tabs--line .van-tabs__content {
    flex: 1;
    overflow: scroll;
  }
  .section .van-tabs>div:first-child {
    overflow: visible;
  }
  .section .van-tabs>div:last-child {
    flex: 1;
    overflow: scroll;
  }

  //改van-tag颜色 成功
  .bindClass0.van-tag--primary.van-tag--plain {
    // color: #1989FA;
    color: goldenrod;
  }
  .bindClass1.van-tag--primary.van-tag--plain {
    // color: goldenrod;
    color: #07C160;
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
</style>
