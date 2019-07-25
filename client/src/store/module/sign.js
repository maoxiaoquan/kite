import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  SIGN_SEND_CODE: ({ commit, dispatch, state }, { email }) => {
    // 注册发送验证码
    return fetch({
      url: '/sign-up-code',
      method: 'post',
      parameter: { email }
    })
  },
  LOGIN: ({ commit, dispatch, state }, parameter) => {
    // 登录 post
    return fetch({
      url: '/sign-in',
      method: 'post',
      parameter
    })
  },
  REGISTER: ({ commit, dispatch, state }, parameter) => {
    // 注册 post
    return fetch({
      url: '/sign-up',
      method: 'post',
      parameter
    })
  },
  RESET_PASSWORD_CODE: ({ commit, dispatch, state }, parameter) => {
    // 重置密码发送验证码
    return fetch({
      url: '/reset-password-code',
      method: 'post',
      parameter
    })
  },
  RESET_PASSWORD: ({ commit, dispatch, state }, parameter) => {
    // 重置密码
    return fetch({
      url: '/reset_password',
      method: 'post',
      parameter
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
