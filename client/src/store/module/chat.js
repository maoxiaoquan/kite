import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  JOIN_PRIVATE_CHAT({ commit, dispatch, state }, parameter) {
    // 加入私聊
    return fetch({
      url: '/chat/join-private-chat',
      method: 'post',
      parameter: { params: parameter }
    })
  },
  GET_PRIVATE_CHAT_LIST({ commit, dispatch, state }, parameter) {
    // 获取私聊列表
    return fetch({
      url: '/chat/get-private-chat-list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  SEND_PRIVATE_CHAT_MESSAGE({ commit, dispatch, state }, parameter) {
    // 发送私聊消息
    return fetch({
      url: '/chat/send-private-chat-msg',
      method: 'post',
      parameter
    })
  },
  DELETE_PRIVATE_CHAT({ commit, dispatch, state }, parameter) {
    // 删除私聊
    return fetch({
      url: '/chat/delete-private-chat',
      method: 'post',
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
