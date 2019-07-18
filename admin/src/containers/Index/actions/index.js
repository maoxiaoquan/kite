import http from '../../../utils/http'

export const get_admin_index_statistics = (data, callback) => {
  return (dispatch) => {
    http.get('/admin-index/statistics', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'SET_ADMIN_COUNT',
          data: res
        })
      })
  }
}
