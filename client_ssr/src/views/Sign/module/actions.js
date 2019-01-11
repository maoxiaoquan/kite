import { fetch } from '@request'

export default {
  SIGN_SEND_CODE: ({ commit, dispatch, state }, { email }) => { // 注册发送验证码
    return fetch({
      url: '/client/sign_up_code',
      method: 'post',
      parameter: { email }
    })
  },
  LOGIN: ({ commit, dispatch, state }, parameter) => { // 登录 post
    return fetch({
      url: '/client/sign_in',
      method: 'post',
      parameter
    })
  },
  REGISTER: ({ commit, dispatch, state }, parameter) => { // 注册 post
    return fetch({
      url: '/client/sign_up',
      method: 'post',
      parameter
    })
  }
}
