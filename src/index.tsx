import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  AnyAction, applyMiddleware, createStore, Dispatch, Middleware,
} from 'redux';
import reducers from 'actions';
import history from 'utils/history';
import App from 'App';
import icons from 'utils/icons';
import reduxSaga from 'redux-saga';
import { createLogger } from 'redux-logger';

// data
import { saveUserLocation, getUserLocation } from 'data/user';

import 'css/global.css';
import 'css/darkTheme.css';
import 'css/lightTheme.css';

import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { Location } from 'history';
import sagas from './sagas';

const sagaMiddleware = reduxSaga();
const saveUserLocationMiddleware = () => (next: Dispatch) => (action: AnyAction) => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    saveUserLocation(action.payload.location);
  }

  next(action);
};
const middlewares: Middleware[] = [
  sagaMiddleware,
  routerMiddleware(history),
  saveUserLocationMiddleware,

];

getUserLocation().then((location?: Location) => {
  if (location !== undefined) {
    history.push({ ...location });
  }
});

if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger({ collapsed: true }));
}

const initStore = createStore(
  reducers,
  {},
  applyMiddleware(...middlewares),
);

export const store = {
  ...initStore,
  runSaga: sagaMiddleware.run(sagas),
};

icons();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app'),
);
