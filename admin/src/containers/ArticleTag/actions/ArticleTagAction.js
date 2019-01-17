import http from '../../../utils/http'

export const get_article_tag_list = (data, callback) => {
  return (dispatch) => {
    http.get('/get_article_tag_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({ type: 'GET_ARTICLE_TAGS_LIST', data: res })
    })
  }
}

export const create_article_tag = (data, callback) => {
  return (dispatch) => {
    http.post('/create_article_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const update_article_tag = (data, callback) => {
  return () => {
    http.post('/update_article_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_article_tag = (data, callback) => {
  return () => {
    http.post('/delete_article_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}
