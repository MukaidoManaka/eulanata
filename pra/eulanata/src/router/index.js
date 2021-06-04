import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//引入页面组件
const Home = resolve => require(['@/views/Home'], resolve);
const Login = resolve => require(['@/views/Login'], resolve);
const About = resolve => require(['@/views/About'], resolve);
const Ore = resolve => require(['@/views/Ore'], resolve);
const Delivery = resolve => require(['@/views/Delivery'], resolve);
const ListDetail = resolve => require(['@/views/ListDetail'], resolve);
const GoodsDetail = resolve => require(['@/views/GoodsDetail'], resolve);
const WriteOrder = resolve => require(['@/views/WriteOrder'], resolve);
const WriteGoods = resolve => require(['@/views/WriteGoods'], resolve);
const Index = resolve => require(['@/views/Index'], resolve);

const routes = [
  {
    path: '/',
    // name: 'Login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录a'
    }
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    meta: {
      title: '首页aa'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于'
    }
  },
  {
    path: '/ore',
    name: 'Ore',
    component: Ore,
    meta: {
      title: '个人中心'
    }
  },
  {
    path: '/delivery',
    name: 'Delivery',
    component: Delivery,
    meta: {
      title: '送货'
    }
  },
  {
    path: '/listDetail',
    name: 'ListDetail',
    component: ListDetail,
    meta: {
      title: '送货单详情'
    }
  },
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component: GoodsDetail,
    meta: {
      title: '货物详情'
    }
  },
  {
    path: '/writeOrder',
    name: 'WriteOrder',
    component: WriteOrder,
    meta: {
      title: '订单填写'
    }
  },
  {
    path: '/writeGoods',
    name: 'WriteGoods',
    component: WriteGoods,
    meta: {
      title: '货物填写'
    }
  }
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
