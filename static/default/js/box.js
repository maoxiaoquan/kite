/*server func*/

const _Fetch = axios.create({
  baseURL: '/',
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
})

_Fetch.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  console.error(error)
  alert('服务器正忙，请稍后重试!')
})

function hasClass (obj, cls) {
  var obj_class = obj.className,//获取 class 内容.
    obj_class_lst = obj_class.split(/\s+/)//通过split空字符将cls转换成数组.
  for (var x in obj_class_lst) {
    if (obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
      return true
    }
  }
  return false
}

!function (window) {
  var _server = {
    create_user_article_topic: function (data) { /*创建用户专题*/
      return _Fetch.post('/create_user_article_topic', data)
    },
    get_article: function (data) { //根据aid获取文章
      return _Fetch.get('/get_article', {params: data})
    },
    get_user_info: function (data) { //根据uid获取用户相关信息
      return _Fetch.get('/user_info', {params: data})
    },
    post_update_user_info: function (data) { //根据uid更新用户相关信息
      return _Fetch.post('/update_user_info', data)
    },
    post_update_user_password: function (data) { //根据uid更新用户密码
      return _Fetch.post('/update_user_password', data)
    },
    get_user_article_topic_all: function () { /*获取当前用户所有专题*/
      return _Fetch.get('/get_article_topic_all')
    },
    update_user_article_topic: function (data) { /*更新用户所有文章专题*/
      return _Fetch.post('/update_user_article_topic', data)
    },
    delete_user_article_topic: function (data) { /*删除用户所有文章专题*/
      return _Fetch.post('/delete_user_article_topic', data)
    },
    get_article_tag_all: function () { /*获取所有文章标签*/
      return _Fetch.get('/get_article_tag_all')
    },
    post_article_writer: function (data) { /*编写文章*/
      return _Fetch.post('/article_writer', data)
    },
    get_index_article_list: function (data) { /*获取首页文章*/
      return _Fetch.get('/get_index_article', {params: data})
    },
    post_subscribe_tag: function (data) { /*订阅标签*/
      return _Fetch.post('/post_subscribe_tag', data)
    },
    post_user_attention: function (data) { /*用户关注用户*/
      return _Fetch.post('/post_user_attention', data)
    },
    post_user_like_article: function (data) { /*用户like文章*/
      return _Fetch.post('/user_like_article', data)
    },
    get_comment_list: function (data) { /*获取文章的评论*/
      return _Fetch.get('/get_comment', {params: data})
    },
    post_create_comment: function (data) { /*用户发表评论*/
      return _Fetch.post('/create_comment', data)
    },
    post_delete_comment: function (data) { // 删除评论
      return _Fetch.post('/delete_comment', data)
    },
    get_unread_message_count: function () { /*获取未读用户消息数量*/
      return _Fetch.get('/unread_message_count')
    },
    get_user_message: function (data) { /*获取用户消息*/
      return _Fetch.get('/user_message', {params: data})
    },
    post_delete_user_message: function (data) { // 删除用户消息
      return _Fetch.post('/delete_user_message', data)
    },
    post_upload_user_avatar: function (data) { // 上传用户头像
      return _Fetch.post('/upload_user_avatar', data, {headers: {'Content-Type': 'multipart/form-data'}})
    },
    post_reset_password_code: function (data) { // 发送重置密码验证码
      return _Fetch.post('/reset_password_code', data)
    },
    post_reset_password: function (data) { // 重置密码
      return _Fetch.post('/reset_password', data)
    }
  }

  window._server = _server

}(window)

var modal_template = ' <transition name="modal">' +
  '        <div class="modal-mask" v-if="show">' +
  '            <div class="modal-wrapper">' +
  '                <div class="modal-container">' +
  '                    <i class="iconfont icon-guanbijiantou" @click="close_model"></i>' +
  '                    <div class="box-modal-header">' +
  '                        <slot name="header">' +
  '                            提示' +
  '                        </slot>' +
  '                    </div>' +
  '                    <div class="box-modal-body">' +
  '                        <slot />' +
  '                    </div>' +
  '                    <div class="box-modal-footer">' +
  '                        <slot name="footer">' +
  '                            <button class="btn btn-primary modal-default-button" @click="close_model">' +
  '                                确认' +
  '                            </button>' +
  '                        </slot>' +
  '                    </div>' +
  '                </div>' +
  '            </div>' +
  '        </div>' +
  '    </transition>'

/* <child :foo.sync=”msg”></child> 就会被扩展为： <child :foo=”bar” @update:foo=”val => bar = val”>  （@是v-on的简写）*/

// register modal component
Vue.component('topic-modal', {
  props: ['show'],
  methods: {
    close_model: function () {
      this.$emit('update:show', false)
    }
  },
  template: modal_template
})
