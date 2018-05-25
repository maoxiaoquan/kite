const initState = {
  admin_role_list: [],
  count: ''
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_ADMIN_ROLE_LIST':
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export default reducer