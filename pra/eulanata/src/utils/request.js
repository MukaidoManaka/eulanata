import axios from 'axios'
import store from '@/store'
import {
  Toast
} from 'vant'
// import {
//   api
// } from '@/config'
// create an axios instance
const service = axios.create({
  // baseURL: api.base_api, // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    // config.headers['Authorization'] = 'eyJ3eE1wVXNlciI6eyJibG9vZENhcmQiOm51bGwsImJsb29kU3RhdGlvbklkIjowLCJjaXR5IjoxMjAxMDAsImNvdW50cnkiOm51bGwsImNvdW50eSI6MTIwMTAxLCJjcmVhdGVCeSI6IiIsImNyZWF0ZVRpbWUiOjE1NzU1MzYwNjgwMDAsImRlbEZsYWciOiIwIiwiaGVhZEltZ1VybCI6bnVsbCwiaWQiOjEsImlkQ2FyZCI6IjEzMDgyNDE5OTMwMTIxNDAxOCIsImluQ29tZSI6bnVsbCwiaW50ZWdyYWxzIjpudWxsLCJpbnZpdGVDb2RlIjoiMDAwMDAxIiwibGFzdERhdGUiOm51bGwsIm5hbWUiOiLosKLnmpMiLCJuaWNrbmFtZSI6bnVsbCwib3BlbklkIjoib3o2cWJ2MWU0UTg0WjVjMjRPNHlxd2ZyLVdrbyIsInBob25lIjoiMTg2MDA4NDcxNjQiLCJwaW55aW4iOiJ4IiwicHJpdmlsZWdlIjpudWxsLCJwcm92aW5jZSI6MTIwMDAwLCJyZWFsTmFtZSI6ZmFsc2UsInJlbGF0ZWRQYXJ0eUlkIjowLCJyZW1hcmsiOm51bGwsInNleCI6bnVsbCwic3RhdHVzIjpudWxsLCJ0b2tlbiI6bnVsbCwidG93biI6MTIwMTAxMDAyLCJ1bmlvbklkIjoiL2ltZ1VwbG9hZC9xckNvZGUvMS5qcGciLCJ1cGRhdGVCeSI6IiIsInVwZGF0ZVRpbWUiOjE1ODU1MjkyNjkzMjh9LCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlvbklkIjoiL2ltZ1VwbG9hZC9xckNvZGUvMS5qcGciLCJvcGVuSWQiOiJvejZxYnYxZTRRODRaNWMyNE80eXF3ZnItV2tvIiwiaWQiOjEsImV4cCI6MTU4NjgyNTI2OSwic3RhdGlvbklkIjowfQ.1zYearYiD1Jzkwhip11ZQ-Ar0ub85PPdr3rh5EH1kqc'
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
    Toast.clear()
    const res = response.data
    // 这里注意修改成你访问的服务端接口规则
    // 登录超时,重新登录
    if (res.code === 401) {
      store.dispatch('user/fedLogOut').then(() => {
        location.reload()
      })
    }

    if (res.code && res.code == 500) {
      Toast.fail(res.message);
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
