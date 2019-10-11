const initState = {
  list: [],
  count: '',
  current_info: {}
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_BOOKS_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'BOOKS_SET_CURRENT_INFO':
      return {
        ...state,
        current_info: action.data
      }
    default:
      return state
  }
}

export default reducer
