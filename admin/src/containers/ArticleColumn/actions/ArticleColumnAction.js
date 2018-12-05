import http from '../../../utils/http'

export const get_article_column_list = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_article_column_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({ type: 'GET_ARTICLE_COLUMN_LIST', data: res })
    })
  }
}

export const create_article_column = (data, callback) => {
  return (dispatch) => {
    http.post('/api/create_article_column', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const update_article_column = (data, callback) => {
  return () => {
    http.post('/api/update_article_column', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_article_column = (data, callback) => {
  return () => {
    http.post('/api/delete_article_column', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const get_article_tag_all = (data, callback) => {
  return () => {
    http.get('/api/get_article_tag_all', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}