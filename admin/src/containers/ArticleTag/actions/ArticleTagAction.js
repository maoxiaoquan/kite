import http from '../../../utils/http'

export const get_article_tag_list = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_article_tag_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({ type: 'GET_ARTICLE_TAGS_LIST', data: res })
    })
  }
}

export const create_article_tag = (data, callback) => {
  return (dispatch) => {
    http.post('/api/create_article_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const update_article_tag = (data, callback) => {
  return () => {
    http.post('/api/update_article_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_article_tag = (data, callback) => {
  return () => {
    http.post('/api/delete_article_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}