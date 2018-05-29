const initState = {
  admin_authority_list: [],
  count: ''
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_ADMIN_AUTHORITY_LIST':
      return {
        ...state,
        admin_authority_list: action.data
      }
    default:
      return state
  }
}

export default reducer