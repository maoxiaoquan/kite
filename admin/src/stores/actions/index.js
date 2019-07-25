import http from '../../utils/http'

export const getAdminUserInfo = (data, callback) => {
  return dispatch => {
    http.post('/admin-user/info', data).then(result => {
      if (callback) {
        callback(result)
      }
      dispatch({
        type: 'SET_CURRENT_USER_INFO',
        admin_user_info: result.admin_user_info,
        website: result.website
      })
      return dispatch({
        type: 'SET_ASIDE_LIST',
        all_authority_name_id: result.all_authority_name_id
      })
    })
  }
}
