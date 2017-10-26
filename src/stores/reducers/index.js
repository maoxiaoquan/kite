const initState = {
  list_index: [
    1, 2, 4, 6666, 6
  ],
  data: {},
}
function reducers(state = initState, action) {
  switch (action.type) {
    case 'GET_INDEX_DATA':
      return {
        ...state,
        data: action.data,
      }
    default:
      return state
  }
}
export default reducers
