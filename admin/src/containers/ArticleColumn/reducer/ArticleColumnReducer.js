const initState = {
  list: [],
  count: '',
  current_info: {}
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_ARTICLE_COLUMN_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_ARTICLE_COLUMN_INFO':
      return {
        ...state,
        current_info: action.data
      }
    default:
      return state
  }
}

export default reducer