import { fetch } from '@request'

const state = () => ({
  count: 0
})

const mutations = {}

const actions = {
  SIGN_SEND_CODE: ({ commit, dispatch, state }, { email }) => { // 注册发送验证码
    return fetch({
      url: '/sign_up_code',
      method: 'post',
      parameter: { email }
    })
  },
  LOGIN: ({ commit, dispatch, state }, parameter) => { // 登录 post
    return fetch({
      url: '/sign_in',
      method: 'post',
      parameter
    })
  },
  REGISTER: ({ commit, dispatch, state }, parameter) => { // 注册 post
    return fetch({
      url: '/sign_up',
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
