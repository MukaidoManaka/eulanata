import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//引入页面组件
const Home = resolve => require(['@/views/Home'], resolve);
const Login = resolve => require(['@/views/Login'], resolve);
const About = resolve => require(['@/views/About'], resolve);
const Ore = resolve => require(['@/views/Ore'], resolve);
const Message = resolve => require(['@/views/Message'], resolve);
const ListDetail = resolve => require(['@/views/ListDetail'], resolve);
const GoodsDetail = resolve => require(['@/views/GoodsDetail'], resolve);
const WriteOrder = resolve => require(['@/views/WriteOrder'], resolve);
const WriteGoods = resolve => require(['@/views/WriteGoods'], resolve);
const Index = resolve => require(['@/views/Index'], resolve);
const OrderDetail = resolve => require(['@/views/OrderDetail'], resolve);
const BindUser = resolve => require(['@/views/BindUser'], resolve);
const Wwc = resolve => require(['@/views/Wwc'], resolve);
const WwcDetail = resolve => require(['@/views/WwcDetail'], resolve);

const routes = [
  {
    path: '/',
    // name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      keepAlive: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录a',
      keepAlive: false
    }
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    meta: {
      title: '首页aa',
      keepAlive: false
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      keepAlive: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于',
      keepAlive: false
    }
  },
  {
    path: '/ore',
    name: 'Ore',
    component: Ore,
    meta: {
      title: '个人中心',
      keepAlive: false
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: Message,
    meta: {
      title: '送货',
      keepAlive: false
    }
  },
  {
    path: '/listDetail',
    name: 'ListDetail',
    component: ListDetail,
    meta: {
      title: '送货单详情',
      keepAlive: false
    }
  },
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component: GoodsDetail,
    meta: {
      title: '货物详情',
      keepAlive: false
    }
  },
  {
    path: '/writeOrder',
    name: 'WriteOrder',
    component: WriteOrder,
    meta: {
      title: '订单填写',
      keepAlive: false
    }
  },
  {
    path: '/writeGoods',
    name: 'WriteGoods',
    component: WriteGoods,
    meta: {
      title: '货物填写',
      keepAlive: false
    }
  },
  {
    path: '/orderDetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: '订单详情',
      keepAlive: false
    }
  },
  {
    path: '/bindUser',
    name: 'BindUser',
    component: BindUser,
    meta: {
      title: '用户绑定',
      keepAlive: false
    }
  },
  {
    path: '/wwc',
    name: 'Wwc',
    component: Wwc,
    meta: {
      title: '未完成',
      keepAlive: false
    }
  },
  {
    path: '/wwcDetail',
    name: 'WwcDetail',
    component: WwcDetail,
    meta: {
      title: '未完成详情',
      keepAlive: false
    }
  },
]

//不写这个的话，如果一直点同一个路由 console会报错
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
})

export default router
