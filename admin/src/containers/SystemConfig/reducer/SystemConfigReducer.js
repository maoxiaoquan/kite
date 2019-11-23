const initState = {
  info: {
    email: {},
    website: {}
  }
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'SET_SYSTEM_CONFIG_INFO':
      return {
        ...state,
        info: action.data
      }
    default:
      return state
  }
}

export default reducer
