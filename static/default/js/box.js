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
    create_user_article_topic: function () { /*创建用户专题*/
      return _Fetch.post('/create_user_article_topic', {
        user_article_topic_name: document.querySelector('.create-topic-input').value
      })
    },
    get_article: function (data) { //根据aid获取文章
      return _Fetch.get('/get_article', {params: data})
    },
    get_user_info: function (data) { //根据uid获取用户相关信息
      return _Fetch.get('/user_info', {params: data})
    },
    get_user_article_topic_all: function () { /*获取当前用户所有专题*/
      return _Fetch.get('/get_article_topic_all')
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
    }
  }

  window._server = _server

}(window)
