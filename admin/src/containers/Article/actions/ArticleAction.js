import http from '../../../utils/http'

export const getArticleList = (data, callback) => {
  return dispatch => {
    http.post('/article/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_ARTICLE_LIST',
        data: res
      })
    })
  }
}

export const editArticle = (data, callback) => {
  return () => {
    http.post('/article/edit', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const deleteArticle = (data, callback) => {
  return () => {
    http.post('/article/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const getArticleTagAll = (data, callback) => {
  return () => {
    http.get('/article-tag/all', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
