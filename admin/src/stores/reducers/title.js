const initState = {
  title: ''
};

function title(state = initState, action) {
  switch (action.type) {
    case 'TITLE':
      return Object.assign({}, state, { title: action.title });
    default:
      return state;
  }
}

export default title;
