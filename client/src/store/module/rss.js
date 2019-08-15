import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  SET_RSS_DYNAMIC_TOPIC ({ commit, dispatch, state }, parameter) {
    // 订阅动态话题
    return fetch({
      url: '/subscribe/dynamic_topic',
      method: 'post',
      parameter: parameter
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
