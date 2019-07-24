import http from '../../../utils/http'

export const getArticleTagList = (data, callback) => {
  return (dispatch) => {
    http.get('/article-tag/list', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'GET_ARTICLE_TAGS_LIST',
          data: res
        })
      })
  }
}

export const createArticleTag = (data, callback) => {
  return (dispatch) => {
    http.post('/article-tag/create', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const updateArticleTag = (data, callback) => {
  return () => {
    http.post('/article-tag/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const deleteArticleTag = (data, callback) => {
  return () => {
    http.post('/article-tag/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
