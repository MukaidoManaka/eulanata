<template>
  <div class="home">
    <div class="header">
      <van-nav-bar title="主页" color="white">
        <template #right>
          <van-icon name="search" size="18" />
        </template>
      </van-nav-bar>
    </div>
    <div class="section">
      <van-tabs v-model="active2" @click="tabClick" @change="tabChange" swipeable>
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
                    <van-tag plain type='primary'>{{item.status == 0 ? '待审核' : (item.status == 1 ? '已通过' : '已完成')}}</van-tag>
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
    <div class="footer">
      <van-tabbar v-model="active">
        <van-tabbar-item to="home" icon="home-o">主页</van-tabbar-item>
        <van-tabbar-item to="about" icon="search" dot>随意</van-tabbar-item>
        <van-tabbar-item to="delivery" icon="friends-o" badge="5"
          >送货</van-tabbar-item
        >
        <van-tabbar-item to="ore" icon="user-o" badge="20"
          >我的</van-tabbar-item
        >
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import json from '../../mock.json'
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      //区分审核或者通过火已完成3中状态 所需要的中间件
      newJson: [],
      loading: false,
      finished: false,
      refreshing: false,
      active: null,
      active2: null,
      pink: 'pink',
      //区分审核或者通过火已完成3中状态
      dict1:['全部','待审核','已通过','已完成'],
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
      this.$router.push('/listDetail',{id})
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
    // display: flex;
    // flex-direction: column;
    position: relative;
  }
  .header {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    // margin-bottom: .46rem;
  }
  .section {
    // flex: 1;
    margin-top: .46rem;
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

  // 改 一些UI的默认样式
  .header .van-nav-bar {
    background-color: #6cf;
  }
  .section .list_item:first-child {
    border-top: 1px solid gray;
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

  .sectiopn .van-tabs {
    position: static!important;;
  }
  .section .van-tabs--line .van-tabs__wrap .van-tabs__nav {
    position: fixed!important;
    top: 0;
    left: 0;
    z-index: 101;
    margin-top: .9rem;
  }
</style>
