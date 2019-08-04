const initState = {
  list: [],
  count: '',
  current_info: {}
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_DYNAMIC_TOPICS_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SET_DYNAMIC_TOPIC_INFO':
      return {
        ...state,
        current_info: action.data
      }
    default:
      return state
  }
}

export default reducer
