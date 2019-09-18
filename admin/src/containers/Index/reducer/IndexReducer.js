const initState = {
  count: '',
  new_article: [],
  new_user: [],
  new_comment: []
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'SET_ADMIN_COUNT':
      return {
        ...state,
        count: action.data.count,
        new_article: action.data.new_article,
        new_user: action.data.new_user,
        new_comment: action.data.new_comment
      }
    default:
      return state
  }
}

export default reducer
