import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      is_login_show: false, // 登录弹窗是否显示
      is_register_show: false, // 注册弹窗是否显示
      is_reset_password_show: false, // 找回密码弹窗是否显示
      personal_info: {}, // 登录后的用户个人信息
      article_column: [], // 获取文章专栏
      c_column_us_name: '', // 当前 文章专栏
      home_banner: [], // home banner
      article_tag: [], // 获取文章标签
      articleList: { // 所有文章列表
        indexArticleList: [] // 首页 专栏页 文章列表
      }
    },
    actions,
    mutations
  })
}
