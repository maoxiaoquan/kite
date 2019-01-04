import { fetch } from '../../request'

export default {
  fetchMovie({ commit }, id) {
    return new Promise((resolve, reject) => {
      resolve({ id })
    }).then(res => {
      commit('setMoive', { res })
    })
  },
  getUserInfo({ commit }) {
    return fetch({
      url: '/client/user_info',
      method: 'get'
    })
      .then((res) => {
        commit('setUserInfo', res)
      })
  },
  getUser({ commit }, id) {
    return new Promise((resolve, reject) => {
      resolve({ id })
    }).then(res => {
      commit('setMoive', { res })
    })
  }
}
