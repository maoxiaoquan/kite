import Vue from 'vue'

export default {
  SET_IS_LOGIN(state, data) { // 登录弹窗控制
    state.is_login_show = data
  },
  SET_IS_REGISTER(state, data) { // 注册弹窗控制
    state.is_register_show = data
  },
  SET_IS_RESET_PASSWORD(state, data) { // 注册弹窗控制
    state.is_reset_password_show = data
  },
  setMoive(state, { res }) {
    Vue.set(state, 'movie', res)
  },
  setUserInfo(state, res) {
    state.user_info = res
  }
}
