import { fetch } from '@request'
import { gqlfetch } from '@fetch'
const state = () => ({})

const mutations = {}

const actions = {
  GET_TEST ({ commit, dispatch, state }, parameter) {
    return gqlfetch({
      parameter: `
          query {
            articleList { 
              list {
                aid
                title
              }
            }
          }
        `
    })
  },
  GET_USER_INFO ({ commit, dispatch, state }, params) {
    return gqlfetch({
      parameter: `
          query {
            userInfo(uid: ${params.uid}) { 
              uid
              nickname
              avatar
              profession
              company
              articleCount
              dynamicCount
            }
            recommendArticle {
              aid
              title
              thumb_count
              comment_count
            }
          }
        `
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
