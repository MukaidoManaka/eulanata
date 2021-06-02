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
      title: '登录'
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
      title: '送货'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
