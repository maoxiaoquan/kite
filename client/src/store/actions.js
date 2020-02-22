import { fetch } from '@request'

export default {
  PERSONAL_INFO({ commit, dispatch, state }, parameter = {}) {
    // 登录用户的个人信息
    return fetch({
      url: '/personal/info',
      method: 'post',
      parameter: parameter
    }).then(result => {
      commit('SET_PERSONAL_INFO', result.data)
      return result
    })
  }
}
