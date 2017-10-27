import { combineReducers } from 'redux';
import title from './title';
import loading from './loading';

const rootCombineReducer = window.rootCombineReducer = {
  title,
  loading,
};

const rootReducer = combineReducers(rootCombineReducer);

export default rootReducer;
