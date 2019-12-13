import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  BUY ({ commit, dispatch, state }, parameter) {
    // 购买物品
    return fetch({
      url: '/shop/buy',
      method: 'post',
      parameter: parameter
    })
  },
  GET_ORDER_LIST ({ commit, dispatch, state }, parameter) {
    // 购买物品 订单列表
    return fetch({
      url: '/shop/list',
      method: 'get',
      parameter: { params: parameter }
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
