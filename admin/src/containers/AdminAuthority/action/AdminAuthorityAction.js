import http from '../../../utils/http'

export const createAdminAuthority = (data, callback) => {
  return dispatch => {
    http.post('/admin-authority/create', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

function filterArray (result, pid) {
  let _array = []
  for (let i in result) {
    if (result[i].authority_parent_id === pid) {
      result[i].children = filterArray(result, result[i].authority_id)
      _array.push(result[i])
    }
  }
  return _array
}

export const getAdminAuthorityList = (data, callback) => {
  return dispatch => {
    http.get('/admin-authority/list', data).then(res => {
      if (callback) {
        callback(filterArray(res, ''))
      }
      return dispatch({
        type: 'GET_ADMIN_AUTHORITY_LIST',
        data: res
      })
    })
  }
}

export const deleteAdminAuthority = (data, callback) => {
  return dispatch => {
    http.post('/admin-authority/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const updateAdminAuthority = (data, callback) => {
  return dispatch => {
    http.post('/admin-authority/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
