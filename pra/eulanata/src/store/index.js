import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    position: 0,
    keepalive:['Home','WriteOrder'],  //缓存的页面
    
    count_no: 0,  //no：不 
    count_ing: 0,
    count_finished: 0,

    csbm: '',
    csmc: '',
    name: '',
    phone: '',

    date: '', //今天日期
    help: true, //默认显示帮助
    appid: 'wxf67fa2fc7c8643a4',
    openid: '',
    token: '',
    // userinfo: {
    //   avatar:'',
    //   nickname: ''
    // },
    avatar:'',
    nickname: ''
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
    },
    saveDate(state, val) {
      state.date = val
    },
    saveHelp(state,val)  {
      state.help = val
    },
    //保存openid
    saveOpenid(state,val) {
      state.openid = val
    },
    saveToken(state, val) {
      state.token = val
    },
    // saveUserinfo(state,[head,name]) {
    //   console.log(head,name)
    //   state.userinfo.avatar = head
    //   state.userinfo.nickname = name
    // }
    saveAvatar(state, val) {
      state.avatar = val
    },
    saveNickname(state, val) {
      state.nickname = val
    }
  },
  actions: {
  },
  modules: {
  }
})
