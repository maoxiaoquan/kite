import http from '../../../utils/http'

export const create_admin_authority = (data, func) => {
  return (dispatch) => {
    http.post('/api/create_admin_authority', data).then((res) => {
      console.log('res', res)
      if (func)
        func(res)
    })
  }
}

function filterArray (result, pid) {
  let _array = []
  for (let i in result) {
    if (Number(result[i].authority_parent_id === pid)) {
      result[i].children = filterArray(result, result[i].authority_id)
      _array.push(result[i])
    }
  }
  return _array
}

export const get_admin_authority_list = (data, func) => {
  return (dispatch) => {
    http.get('/api/get_admin_authority_list', data).then((res) => {
      if (func)
        func(filterArray(res, 0))
      return dispatch({type: 'GET_ADMIN_AUTHORITY_LIST', data: filterArray(res, 0)})
    })
  }
}

