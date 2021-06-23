import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //当前登录用户id
    id: 0,
    //当前选择订单id
    curOrderId: 0,
    position: 0,
    keepalive:['Home','WriteOrder'],
    company: ['平湖凯隆新材料科技有限公司','平湖市兆涌五金塑胶制造有限公司','嘉兴凯隆智能科技股份有限公司'],
    curCompany: '',
  },
  mutations: {
    savePosition(state,position) {
      state.position = position
    },
  },
  actions: {
  },
  modules: {
  }
})
