import http from '../../../utils/http'

export const getArticleBlogList = (data, callback) => {
  return dispatch => {
    http.get('/article-blog/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_ARTICLE_BLOG_LIST',
        data: res
      })
    })
  }
}

export const updateArticleBlog = (data, callback) => {
  return () => {
    http.post('/article-blog/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
