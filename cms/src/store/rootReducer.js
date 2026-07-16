import { combineReducers } from 'redux';
import theme from './theme/themeSlice';
import auth from './auth';
import base from './base';
import forum from './forum';

const rootReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    theme,
    auth,
    base,
    forum,
    ...asyncReducers,
  });
  return combinedReducer(state, action);
};

export default rootReducer;
