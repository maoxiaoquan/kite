const initState = {
  list: [],
  count: '',
  current_info: {}
}

function reducer(state = initState, action) {
  switch (action.type) {
    case 'GET_ADMIN_SYSTEM_LOG_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_ADMIN_SYSTEM_LOG_INFO':
      return {
        ...state,
        current_info: action.data
      }
    default:
      return state
  }
}

export default reducer