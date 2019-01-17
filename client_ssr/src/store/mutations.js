import Vue from 'vue'

export default {
  SET_IS_LOGIN (state, data) { // 登录弹窗控制
    state.is_login_show = data
  },
  SET_IS_REGISTER (state, data) { // 注册弹窗控制
    state.is_register_show = data
  },
  SET_IS_RESET_PASSWORD (state, data) { // 找回密码弹窗控制
    state.is_reset_password_show = data
  },
  SET_PERSONAL_INFO (state, data) { // 设置登录后的个人信息
    state.personal_info = data
  },
  SET_ARTICLE_COLUMN (state, data) { // 设置获取的文章专栏
    state.article_column = data.list
  },
  SET_CURRENT_ARTICLE_COLUMN (state, data) { // 设置当前切换的文章专栏
    state.c_column_us_name = data
  },
  SET_HOME_BANNER (state, data) { // home banner
    state.home_banner = data.banner
  },
  SET_ARTICLE_TAG (state, data) { // 设置获取的文章标签
    state.article_tag = data.list
  },
  SET_INDEX_ARTICLE_LIST (state, data) { // 首页 专栏页 文章列表
    state.articleList.indexArticleList = data
  }
}
