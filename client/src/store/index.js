import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import modules from './module'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      personalInfo: {
        islogin: false,
        user: {}
      }, // 登录后的用户个人信息
      home_banner: [] // home banner
    },
    actions,
    mutations,
    getters,
    modules
  })
}
