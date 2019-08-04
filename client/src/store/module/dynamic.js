import { fetch } from '@request'

const state = () => ({
  dynamicTopicIndex: [], // 首页侧栏导航话题
  dynamicTopicList: [], // 专题页所有话题列表
  indexDynamicList: [] // 首页动态列表
})

const mutations = {
  SET_DYNAMIC_TOPIC_INDEX (state, data) {
    // 设置首页侧栏导航话题
    state.dynamicTopicIndex = data
  },
  SET_DYNAMIC_TOPIC_LIST (state, data) {
    // 设置首页侧栏导航话题
    state.dynamicTopicIndex = data
  }
}

const actions = {
  CREATE_DYNAMIC ({ commit, dispatch, state }, parameter) {},
  GET_DYNAMIC_TOPIC_INDEX ({ commit, dispatch, state }, parameter) {
    // 获取首页侧栏导航话题
    return fetch({
      url: '/dynamic-topic/index',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_TOPIC_INDEX', result.data.all)
      return result
    })
  },
  GET_DYNAMIC_TOPIC_LIST ({ commit, dispatch, state }, parameter) {
    // 获取首页侧栏导航话题
    return fetch({
      url: '/dynamic-topic/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_TOPIC_LIST', result.data.all)
      return result
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
