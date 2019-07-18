const initState = {
  list: [],
  count: '',
  current_info: {}
}

function reducer(state = initState, action) {
  switch (action.type) {
    case 'GET_COMMENT_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_COMMENT_INFO':
      return {
        ...state,
        current_info: action.data
      }
    default:
      return state
  }
}

export default reducer