import http from '../../../utils/http'

export const getArticleColumnList = (data, callback) => {
  return (dispatch) => {
    http.get('/article-column/list', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'GET_ARTICLE_COLUMN_LIST',
          data: res
        })
      })
  }
}

export const createArticleColumn = (data, callback) => {
  return (dispatch) => {
    http.post('/article-column/create', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const updateArticleColumn = (data, callback) => {
  return () => {
    http.post('/article-column/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const deleteArticleColumn = (data, callback) => {
  return () => {
    http.post('/article-column/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const getArticleTagAll = (data, callback) => {
  return () => {
    http.get('/article-tag/all', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
