const initState = {
  asideList: '',
  user: {},
  website: {}
}

function title (state = initState, action) {
  switch (action.type) {
    case 'SET_ASIDE_LIST':
      return {
        ...state,
        asideList: action.AuthorityNameId
      }
    case 'SET_CURRENT_USER_INFO':
      return {
        ...state,
        user: action.admin_user_info,
        website: action.website
      }
    default:
      return state
  }
}

export default title
