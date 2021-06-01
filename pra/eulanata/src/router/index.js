import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//引入页面组件
const Home = resolve => require(['@/views/Home'], resolve);
const Login = resolve => require(['@/views/Login'], resolve);
const About = resolve => require(['@/views/About'], resolve);
const Ore = resolve => require(['@/views/Ore'], resolve);

const routes = [
  {
    path: '/',
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
  }
]

const router = new VueRouter({
  routes
})

export default router
