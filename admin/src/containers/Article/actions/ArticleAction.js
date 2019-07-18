import http from '../../../utils/http'

export const get_article_list = (data, callback) => {
  return (dispatch) => {
    http.post('/article/list', data)
      .then((res) => {
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

export const edit_user = (data, callback) => {
  return () => {
    http.post('/article/edit', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const delete_article = (data, callback) => {
  return () => {
    http.post('/article/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
