import http from '../../../utils/http'

export const get_article_list = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_article_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({ type: 'GET_ARTICLE_LIST', data: res })
    })
  }
}

export const edit_user = (data, callback) => {
  return () => {
    http.post('/api/edit_article', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_article = (data, callback) => {
  return () => {
    http.post('/api/delete_article', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}