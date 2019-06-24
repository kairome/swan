import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import navigation from './navigation';
import folders from './folders';
import notes from './notes';
import history from 'utils/history';


const reducer = combineReducers({
  navigation,
  folders,
  notes,
  router: connectRouter(history),
});

export default reducer;
