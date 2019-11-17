const initState = {
  admin_user_list: [],
  count: '',
  current_user_info: {},
  admin_role_all: []
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_ADMIN_USER_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_ADMIN_CURRENT_USER_INFO':
      return {
        ...state,
        current_user_info: action.data
      }
    case 'SET_ADMIN_ROlE_ALL':
      return {
        ...state,
        admin_role_all: action.data
      }
    default:
      return state
  }
}

export default reducer
