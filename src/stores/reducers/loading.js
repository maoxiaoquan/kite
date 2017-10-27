const initState = {
  isLoading: false,
  isAppLogin: false,
};

function reducer(state = initState, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
