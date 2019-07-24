import http from '../../../utils/http'

export const createAdminRole = (data, func) => {
  return dispatch => {
    http.post('/admin-role/create', data).then(res => {
      if (func) {
        func(res)
      }
    })
  }
}

export const getAdminRoleList = (data, func) => {
  return dispatch => {
    http.get('/admin-role/list', data).then(res => {
      if (func) {
        func(res)
      }
      return dispatch({
        type: 'GET_ADMIN_ROLE_LIST',
        data: res
      })
    })
  }
}

export const editAdminRole = (data, func) => {
  return dispatch => {
    http.post('/admin-role/edit', data).then(res => {
      if (func) {
        func(res)
      }
    })
  }
}

export const setAdminRoleAuthority = (data, func) => {
  return dispatch => {
    http.post('/admin-role-authority/set', data).then(res => {
      if (func) {
        func(res)
      }
    })
  }
}

/* 删除角色 */
export const deleteAdminRole = (data, func) => {
  return dispatch => {
    http.post('/admin-role/delete', data).then(res => {
      if (func) {
        func(res)
      }
    })
  }
}
