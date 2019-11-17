const initState = {
  articleBlogCount: {},
  articleCommentCount: {},
  articleCount: {},
  count: {},
  dynamicCommentCount: {},
  dynamicCount: {},
  new_article: [],
  new_comment: [],
  new_user: []
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'SET_ADMIN_COUNT':
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export default reducer
