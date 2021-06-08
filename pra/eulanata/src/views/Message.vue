<template>
  <div class="message">
    <div class="header">
      <van-nav-bar title="我的消息" color="white">
        <!-- <template #right>
          <van-icon name="search" size="18" />
        </template> -->
      </van-nav-bar>
    </div>
    <div class="section">
      <div class="msg_item" v-for="(item, index) in data " :key="index">
        <van-badge :dot="item.isNew">
          <div class="date">
            <span>时间:</span>
            <span>{{item.date}} </span>
          </div>
          <div class="detail">
            <span>您有一笔新的订单:</span>
            <span>{{item.msg}} </span>
            <span class="readDetail" @click="readOrder">查看详情>></span>
          </div>
        </van-badge>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
export default {
  name: 'Message',
  components: {
    Footer
  },
  data() {
    return {
        // active: null
        data: [
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: true
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: true
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: false
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: false
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: true
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: true
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: false
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: true
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: false
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: true
          },
          {
            date: '2021-06-01 13:43:25',
            msg: '21419481411',
            isNew: true
          },
        ]
    }
  },
  methods: {
    readOrder() {
      this.$router.push({name: 'OrderDetail',params: {id: 83}})
    }
  }
}
</script>

<style scoped lang="less">
.message {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.section {
  flex: 1;
  flex-direction: column;
  overflow: scroll;
}
.msg_item {
  width: 90%;
  margin: .1rem auto;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.03);
  border-radius: 20px;
  font-size: 14px;
  padding: .1rem;
  div {
    width: 100%;
  }
  .readDetail {
    color: #6cf;
  }
  .date {
    margin: 10px 3px ;
  }
  .detail {
    margin: 10px 3px 5px;
  }
  .readDetail {
    margin-left: 20px;
  }
}
</style>