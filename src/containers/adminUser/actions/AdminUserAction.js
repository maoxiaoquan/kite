import http from '../../../utils/http'

export const get_admin_user_list = (data, func) => {
  return (dispatch) => {
    http.get('/api/get_admin_user_list', data).then((res) => {
      if (func)
        func(res)
      return dispatch({type: 'GET_ADMIN_USER_LIST', data: res})
    })
  }
}
