const initState = {
  list: [
    1, 6, 8, 88, 6999,
  ],
  data: {},
};
function reducers(state = initState, action) {
  switch (action.type) {
    case 'GET_LIST_DATA':
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}
export default reducers;
