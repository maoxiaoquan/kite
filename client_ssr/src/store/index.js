import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      is_login_show: false, // 登录弹窗是否显示
      is_register_show: false, // 注册弹窗是否显示
      is_reset_password_show: false, // 找回密码弹窗是否显示
      movie: {},
      user_info: {}
    },
    actions,
    mutations
  })
}
