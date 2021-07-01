import axios from 'axios'
import store from '@/store'
import { getStorage, setStorage } from '@/assets/js/utils.js'
import { Toast } from 'vant'
// import {
//   api
// } from '@/config'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['Authorization'] = 'qms'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 ,// request timeout,
  // headers: {'Openid': 'G00016openid'}
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    //请求前判断是否有openid，有就给header加上
    if(getStorage('openid')) {
      config.headers.Openid = getStorage('openid')
    }else {
      // Toast.fail({
      //   message: '无效的供应商openid',
      //   duration: 5000
      // })
    }
    
    if (store.getters.token) {
      config.headers['Authorization'] = store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    // Toast.clear()
    const res = response.data
    // 这里注意修改成你访问的服务端接口规则
    // 登录超时,重新登录
    // console.log('------resresres拦截器',response)
    if (response.code === 401) {
      console.log(401)
    }
    if(response.status === 200) {
      // console.log(200)
    }

    if(response.status === 404) {
      console.log(404)
      this.loading = false
      this.finished = true
    }

    if (response.code && response.code == 500) {
      // Toast.fail(response.message);
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    // Toast.clear()
    console.log('八嘎！', error.response) // for debug

    if(error.response.status === 401) {
      Toast.fail({
        message:error.response.data.detail,
        duration: 5000
      })
    }

    if(error.response.status === 404) {
      Toast.fail({
        message:error.response.data.detail,
        duration: 5000
      })
    }

    if(error.response.status === 500) {
      Toast.fail({
        message:'服务器开小差了~ 请刷新/重进或者稍微再试',
        duration: 5000
      })
    }

    return Promise.reject(error)
  }
)

export default service
