const initState = {
  notice: [],
  advertise: []
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'SET_WEBSITE_CONFIG_NOTICE':
      return {
        ...state,
        notice: action.data
      }
    case 'SET_WEBSITE_CONFIG_ADVERTISE':
      return {
        ...state,
        advertise: action.data
      }
    default:
      return state
  }
}

export default reducer
