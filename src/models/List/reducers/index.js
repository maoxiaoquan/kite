const initState = {
  list: [
    1, 2, 4, 8, 5
  ],
  data: {},
}
function reducers(state = initState, action) {
  switch (action.type) {
    case 'GET_LIST_DATA':
      return {
        ...state,
        data: action.data,
      }
    default:
      return state
  }
}
export default reducers
