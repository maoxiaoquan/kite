import http from '../../../utils/http'

export const create_user_authority = (data, callback) => {
  return (dispatch) => {
    http.post('/user-authority/create', data)
      .then((res) => {
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

export const get_user_authority_list = (data, callback) => {
  return (dispatch) => {
    http.get('/user-authority/list', data)
      .then((res) => {
        if (callback) {
          callback(filterArray(res, ''))
        }
        return dispatch({
          type: 'GET_USER_AUTHORITY_LIST',
          data: res
        })
      })
  }
}

export const delete_user_authority = (data, callback) => {
  return (dispatch) => {
    http.post('/user-authority/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const update_user_authority = (data, callback) => {
  return (dispatch) => {
    http.post('/user-authority/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
