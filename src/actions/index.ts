import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from 'utils/history';

import navigation from './navigation';
import folders from './folders';
import notes from './notes';
import interactive from './interactive';

const reducer = combineReducers({
  navigation,
  folders,
  notes,
  interactive,
  router: connectRouter(history),
});

export default reducer;
