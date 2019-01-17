import http from '../../utils/http'

export const get_admin_user_info = (data, callback) => {
  return (dispatch) => {
    http.post('/get_admin_user_info', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
