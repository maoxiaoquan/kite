import http from '../../../utils/http'

export const getUserRoleList = (data, callback) => {
  return (dispatch) => {
    http.get('/user-role/list', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'GET_USER_ROLE_LIST',
          data: res
        })
      })
  }
}

export const getUserRoleAll = (data, callback) => {
  return (dispatch) => {
    http.get('/user-role/all', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const createUserRole = (data, callback) => {
  return (dispatch) => {
    http.post('/user-role/create', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const updateUserRole = (data, callback) => {
  return () => {
    http.post('/user-role/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const deleteUserRole = (data, callback) => {
  return () => {
    http.post('/user-role/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const setUserRoleAuthority = (data, func) => {
  return (dispatch) => {
    http.post('/user-role-authority/set', data)
      .then((res) => {
        if (func) {
          func(res)
        }
      })
  }
}
