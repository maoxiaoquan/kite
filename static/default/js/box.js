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

!function (window) {
  var _server = {
    create_user_article_topic: function () { /*创建用户专题*/
      return _Fetch.post('/create_user_article_topic', {
        user_article_topic_name: document.querySelector('.create-topic-input').value
      })
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
    }
  }

  window._server = _server
}(window)
