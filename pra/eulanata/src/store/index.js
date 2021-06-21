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
    keepalive:['Home','WriteOrder']
  },
  mutations: {
    savePosition(state,position) {
      state.position = position
    }
  },
  actions: {
  },
  modules: {
  }
})
