const initState = {
  title:{},
}

function title(state = initState, action) {
  switch (action.type) {
    case 'TITLE':
      return {
        ...state,
        data: action.data,
      }
    default:
      return state
  }
}

export default title