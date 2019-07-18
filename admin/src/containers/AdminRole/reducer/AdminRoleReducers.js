const initState = {
  admin_role_list: [],
  role_authority_list_all: [],
  count: '',
  current_role_info: {}
}

function reducer(state = initState, action) {
  switch (action.type) {
    case 'GET_ADMIN_ROLE_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_CURRENT_ADMIN_ROLE_INFO':
      return {
        ...state,
        current_role_info: action.data
      }
    case 'SET_ADMIN_ROLE_AUTHORITY_LIST_ALL':
      return {
        ...state,
        role_authority_list_all: action.data
      }
    default:
      return state
  }
}

export default reducer
