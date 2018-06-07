const initState = {
  admin_authority_list: [],
  admin_authority_source_list: [],
  count: '',
  current_authority_info: {}
}

function filterArray(result, pid) {
  let _array = []
  for (let i in result) {
    if (result[i].authority_parent_id === pid) {
      result[i].children = filterArray(result, result[i].authority_id)
      _array.push(result[i])
    }
  }
  return _array
}

function reducer(state = initState, action) {
  switch (action.type) {
    case 'GET_ADMIN_AUTHORITY_LIST':
      return {
        ...state,
        admin_authority_list: filterArray(action.data, ''),
        admin_authority_source_list: action.data
      }
    case 'SET_CURRENT_AUTHORITY_INFO':
      return {
        ...state,
        current_authority_info: action.data
      }
    default:
      return state
  }
}

export default reducer