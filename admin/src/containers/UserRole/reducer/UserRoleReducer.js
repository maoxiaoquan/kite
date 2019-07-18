const initState = {
  list: [],
  count: '',
  current_info: {},
  current_role_info: {},
  role_authority_list_all: []
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_USER_ROLE_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_USER_ROLE_INFO':
      return {
        ...state,
        current_info: action.data
      }
    case 'SET_CURRENT_USER_ROLE_INFO':
      return {
        ...state,
        current_role_info: action.data
      }
    case 'SET_USER_ROLE_AUTHORITY_LIST_ALL':
      return {
        ...state,
        role_authority_list_all: action.data
      }
    default:
      return state
  }
}

export default reducer
