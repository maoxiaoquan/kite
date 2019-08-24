const initState = {
  list: [],
  count: '',
  current_info: {}
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_DYNAMIC_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'DYNAMIC_SET_CURRENT_INFO':
      return {
        ...state,
        current_info: action.data
      }
    default:
      return state
  }
}

export default reducer
