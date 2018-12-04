const initState = {
  user_list: [],
  count: '',
  current_user_info: {}
}

function reducer(state = initState, action) {
  switch (action.type) {
    case 'GET_USER_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_CURRENT_USER_INFO':
      return {
        ...state,
        current_user_info: action.data
      }
    default:
      return state
  }
}

export default reducer