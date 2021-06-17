// import qs from 'qs'
const qs = require('qs');
import request from '@/utils/request.js'


export function homeList(params) {
  console.log("请求的search",qs.stringify(params))
  return request({
    url: '/orderforms',
    method: 'get',
    // params: qs.stringify(params)
    params: params  //我服了，用别人的模板键名data是错的，正确是params，还有也不能qs 四准fy ，就这样最简单的模样是正确的请求姿势！！
    // data: params
  })
}

export function homeListDetail(params) {
  return request({
    url: '/orderforms/' + params,
    method: 'get',
    // data: qs.stringify(params)
  })
}

/**
 * 登录接口请求token与userinfo
 * @param params {code: code}
 */
export function loginByCode(params) {
  return request({
    url: '/wechat/auth',
    method: 'post',
    data: qs.stringify(params)
  })
}
/**
 * 获取登录用户信息
 * @param params
 */
export function getUserInfo(params) {
  return request({
    url: '/user/get_user',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * 获取用户所有信息
 * @param params
 */
export function getUserAllInfo(params) {
  return request({
    url: '/user/query',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 *通过当前页面url获取jssdk授权配置信息
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getJssdkConfig(params) {
  return request({
    url: '/wechat/js',
    method: 'post',
    data: qs.stringify(params)
  })
}


/**
 * 获取用户所有信息
 * @param params
 */
export function realNameAuth(params) {
  return request({
    url: '/user/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * 获取用户所有信息
 * @param params
 */
export function selectArea(params) {
  return request({
    url: '/area/select',
    method: 'post',
    data: qs.stringify(params)
  })
}


/**
 * 获取用户所有信息
 * @param params
 */
export function getArea(params) {
  return request({
    url: '/area/query',
    method: 'post',
    data: qs.stringify(params)
  })
}


/**
 * 预约
 * @param params
 */
export function queryAppoint(params) {
  return request({
    url: '/appoint/query',
    method: 'post',
    data: qs.stringify(params)
  })
}
/**
 * 预约
 * @param params
 */
export function makeAppoint(params) {
  return request({
    url: '/appoint/make',
    method: 'post',
    data: qs.stringify(params)
  })
}




/**
 * 献浆记录
 * @param params
 */
export function bloodRecord(params) {
  return request({
    url: '/blood/record',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * 根据邀请码获取个人信息
 * @param params
 */
export function inviteUserInfo(params) {
  return request({
    url: '/user/invite',
    method: 'post',
    data: qs.stringify(params)
  })
}


/**
 * 第一次点击推荐详情获得酱豆
 * @param params
 */
export function shareRecommend() {
  return request({
    url: '/user/share',
    method: 'post',
  })
}


/**
 * 分享推荐次数
 * @param params
 */
export function shareRecommendCount() {
  return request({
    url: '/share/info',
    method: 'post',
  })
}

/**
 * 默认请求url import { api } from '@/config' 的 base_api + /wechat/auth2
 * 请求common_api打头的参照如下示例：
 * import { api } from '@/config'
 * export function loginByCode(params) {
 *  return request({
 *     url:api.common_api+ '/wechat/auth2',
 *     method: 'post',
 *     data: qs.stringify(params)
 *  })
 * }
 */
