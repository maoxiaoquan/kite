const initState = {
  admin_role_list: [],
  count: '',
  authority_form: {}
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'GET_ADMIN_ROLE_LIST':
      return {
        ...state,
        ...action.data
      }
    case 'SER_AUTHORITY_FORM':
      return {
        ...state,
        authority_form: action.data
      }
    default:
      return state
  }
}

export default reducer