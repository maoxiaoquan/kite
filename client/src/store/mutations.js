import Vue from 'vue'

export default {
  SET_IS_LOGIN (state, data) {
    // 登录弹窗控制
    state.isLoginShow = data
  },
  SET_IS_REGISTER (state, data) {
    // 注册弹窗控制
    state.isRegisterShow = data
  },
  SET_IS_RESET_PASSWORD (state, data) {
    // 找回密码弹窗控制
    state.isResetPasswordShow = data
  },
  SET_PERSONAL_INFO (state, data) {
    // 设置登录后的个人信息
    state.personalInfo = data
  },
  SET_HOME_BANNER (state, data) {
    // home banner
    state.home_banner = data.banner
  }
}
