import Vue from 'vue'

export default {
  setMoive(state, { res }) {
    Vue.set(state, 'movie', res)
  },
  setUserInfo(state, res) {
    state.user_info = res
  }
}
