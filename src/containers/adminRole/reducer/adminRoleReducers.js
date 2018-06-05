const initState = {
  admin_role_list: [],
  count: '',
  current_role_info: {}
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_ADMIN_ROLE_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_CURRENT_ROLE_INFO':
      return {
        ...state,
        current_role_info: action.data
      }
    default:
      return state
  }
}

export default reducer