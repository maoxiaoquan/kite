/* server func */

const _Fetch = axios.create({
  baseURL: '/',
  headers: {
    'x-requested-with': 'XMLHttpRequest',
  },
})

_Fetch.interceptors.response.use(response => response.data, (error) => {
  console.error(error)
  alert('服务器正忙，请稍后重试!')
})

function hasClass(obj, cls) {
  const obj_class = obj.className
  const // 获取 class 内容.
    obj_class_lst = obj_class.split(/\s+/)// 通过split空字符将cls转换成数组.
  for (const x in obj_class_lst) {
    if (obj_class_lst[x] == cls) { // 循环数组, 判断是否包含cls
      return true
    }
  }
  return false
}

!(function (window) {
  const _server = {
    create_user_article_topic(data) { /* 创建用户专题 */
      return _Fetch.post('/create_user_article_topic', data)
    },
    get_article(data) { // 根据aid获取文章
      return _Fetch.get('/get_article', { params: data })
    },
    get_user_info(data) { // 根据uid获取用户相关信息
      return _Fetch.get('/user_info', { params: data })
    },
    post_update_user_info(data) { // 根据uid更新用户相关信息
      return _Fetch.post('/update_user_info', data)
    },
    post_update_user_password(data) { // 根据uid更新用户密码
      return _Fetch.post('/update_user_password', data)
    },
    get_user_article_topic_all() { /* 获取当前用户所有专题 */
      return _Fetch.get('/get_article_topic_all')
    },
    update_user_article_topic(data) { /* 更新用户所有文章专题 */
      return _Fetch.post('/update_user_article_topic', data)
    },
    delete_user_article_topic(data) { /* 删除用户所有文章专题 */
      return _Fetch.post('/delete_user_article_topic', data)
    },
    get_article_tag_all() { /* 获取所有文章标签 */
      return _Fetch.get('/get_article_tag_all')
    },
    post_article_writer(data) { /* 编写文章 */
      return _Fetch.post('/article_writer', data)
    },
    get_index_article_list(data) { /* 获取首页文章 */
      return _Fetch.get('/get_index_article', { params: data })
    },
    post_subscribe_tag(data) { /* 订阅标签 */
      return _Fetch.post('/post_subscribe_tag', data)
    },
    post_user_attention(data) { /* 用户关注用户 */
      return _Fetch.post('/post_user_attention', data)
    },
    post_user_like_article(data) { /* 用户like文章 */
      return _Fetch.post('/user_like_article', data)
    },
    get_comment_list(data) { /* 获取文章的评论 */
      return _Fetch.get('/get_comment', { params: data })
    },
    post_create_comment(data) { /* 用户发表评论 */
      return _Fetch.post('/create_comment', data)
    },
    post_delete_comment(data) { // 删除评论
      return _Fetch.post('/delete_comment', data)
    },
    get_unread_message_count() { /* 获取未读用户消息数量 */
      return _Fetch.get('/unread_message_count')
    },
    get_user_message(data) { /* 获取用户消息 */
      return _Fetch.get('/user_message', { params: data })
    },
    post_delete_user_message(data) { // 删除用户消息
      return _Fetch.post('/delete_user_message', data)
    },
    post_upload_user_avatar(data) { // 上传用户头像
      return _Fetch.post('/upload_user_avatar', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    post_reset_password_code(data) { // 发送重置密码验证码
      return _Fetch.post('/reset_password_code', data)
    },
    post_reset_password(data) { // 重置密码
      return _Fetch.post('/reset_password', data)
    },
    post_upload_article_picture(data) { // 上传文章图片
      return _Fetch.post('/upload_article_picture', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    get_user_tag_all() { // 获取所有角色标签
      return _Fetch.get('/user_tag_all')
    },
    get_home_banner() { // 获取首页banner
      return _Fetch.get('/home_banner')
    },
  }

  window._server = _server
}(window))

const modal_template = ' <transition name="modal">'
  + '        <div class="modal-mask" v-if="show">'
  + '            <div class="modal-wrapper">'
  + '                <div class="modal-container">'
  + '                    <i class="iconfont icon-guanbijiantou" @click="close_model"></i>'
  + '                    <div class="box-modal-header">'
  + '                        <slot name="header">'
  + '                            提示'
  + '                        </slot>'
  + '                    </div>'
  + '                    <div class="box-modal-body">'
  + '                        <slot />'
  + '                    </div>'
  + '                    <div class="box-modal-footer">'
  + '                        <slot name="footer">'
  + '                            <button class="btn btn-primary modal-default-button" @click="close_model">'
  + '                                确认'
  + '                            </button>'
  + '                        </slot>'
  + '                    </div>'
  + '                </div>'
  + '            </div>'
  + '        </div>'
  + '    </transition>'

/* <child :foo.sync=”msg”></child> 就会被扩展为： <child :foo=”bar” @update:foo=”val => bar = val”>  （@是v-on的简写） */

// register modal component
Vue.component('box-modal', {
  props: {
    show: {
      default: false,
    },
  },
  methods: {
    close_model() {
      this.$emit('update:show', false)
    },
  },
  template: modal_template,
})

function addLoadEvent(func) {	//
  const oldonload = window.onload
  if (typeof window.onload !== 'function') {
    window.onload = func
  } else {
    window.onload = function () {
      oldonload()
      func()
    }
  }
}
