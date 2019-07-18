import http from '../../../utils/http'

export const get_article_tag_list = (data, callback) => {
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

export const create_article_tag = (data, callback) => {
  return (dispatch) => {
    http.post('/article-tag/create', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const update_article_tag = (data, callback) => {
  return () => {
    http.post('/article-tag/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const delete_article_tag = (data, callback) => {
  return () => {
    http.post('/article-tag/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
