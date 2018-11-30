const initState = {
  count: '',
  new_article: [],
  new_user: []
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'SET_ADMIN_COUNT':
      return {
        ...state,
        count: action.data.count,
        new_article: action.data.new_article,
        new_user: action.data.new_user
      }
    default:
      return state
  }
}

export default reducer
