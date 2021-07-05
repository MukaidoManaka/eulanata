// import qs from 'qs'
const qs = require('qs');
import request from '@/utils/request.js'

//列表页
export function homeList(params) {
  console.log("请求的search",qs.stringify(params))
  return request({
    url: '/api/dbcache/order-forms',
    method: 'get',
    // params: qs.stringify(params)
    params: params  //我服了，用别人的模板键名data是错的，正确是params，还有也不能qs 四准fy ，就这样最简单的模样是正确的请求姿势！！
    // data: params
  })
}

//详情页
export function goodsDetail(params) {
  return request({
    url: `/api/dbcache/commodities`,
    method: 'get',
    params: params
  })
}

//提交
export function submitGoods(params) {
  return request({
    url: '/api/deliver',
    method: 'post',
    // params: params
    data: qs.parse(params)  //post时得是data，params会报错
  })
}

//获取厂商信息
export function userInfo() {
  return request({
    url: '/supplier/wechat-userinfo',
    method: 'get'
  })
}

//更改姓名
export function editName(params) {
  return request({
    url: '/supplier/wechat-userinfo',
    method: 'patch',
    data: qs.parse(params)
  })
}

//更改电话
export function editPhone(params) {
  return request({
    url: '/supplier/wechat-userinfo',
    method: 'patch',
    data: qs.parse(params)
  })
}

//公众号跳转到送货单的详情页面
export function gzhJump(id) {
  return request({
    url: '/api/dbcache/order-forms/' + id,
    method: 'get',
  })
}

//获得时间,前端获得的可能不准
export function getDate() {
  return request({
    url: '/api/nowdate',
    method: 'get',
  })
}

//提示框的显隐 true/false 的修改
export function showHelp(params) {
  return request({
    url: '/supplier/wechat-userinfo',
    method: 'patch',
    data: qs.parse(params)
  })
}

//获取openid
export function getOpenid(params) {
  return request({
    url:'/supplier/from-code-get-openid',
    method: 'post',
    data: qs.parse(params)
  })
}



export function homeListDetail(params) {
  return request({
    url: '/orderforms/' + params,
    method: 'get',
    // data: qs.stringify(params)
  })
}

