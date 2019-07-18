import http from '../../../utils/http'

export const get_avatar_review_list = (data, callback) => {
  return (dispatch) => {
    http.get('/user/avatar-review-list', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'GET_AVATAR_REVIEW_LIST',
          data: res
        })
      })
  }
}

export const edit_avatar_review = (data, callback) => {
  return () => {
    http.post('/user/avatar-review-set', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
