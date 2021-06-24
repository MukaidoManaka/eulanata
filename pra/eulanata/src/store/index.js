import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    position: 0,
    keepalive:['Home','WriteOrder'],
    // company: ['平湖凯隆新材料科技有限公司','平湖市兆涌五金塑胶制造有限公司','嘉兴凯隆智能科技股份有限公司'],
    // curCompany: '',
    count_no: 0,  //no：不 
    count_ing: 0,
    count_finished: 0,

    csbm: '',
    csmc: '',
    name: '',
    phone: '',
  },
  mutations: {
    //保存当前页面Y轴的滚动条位置
    savePosition(state,position) {
      state.position = position
    },
    //修改未发货 未完成 已完成 的数量
    changeNo(state,val) {
      state.count_no = val
    },
    changeIng(state,val) {
      state.count_ing = val
    },
    changeFinished(state,val) {
      state.count_finished = val
    },
    //保存厂商编码
    saveCSBM(state,val) {
      state.csbm = val
    },
    //保存厂商名称
    saveCSMC(state,val) {
      state.csmc = val
    },
    //
    changeName(state,val) {
      state.name = val
    },
    changePhone(state,val) {
      state.phone = val
    }
  },
  actions: {
  },
  modules: {
  }
})
