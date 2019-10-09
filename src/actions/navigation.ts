import { createReducer, createAction } from 'redux-act';
import { LoaderPayload } from 'types/entities';

export const toggleNavigation = createAction('TOGGLE_NAVIGATION');
export const toggleLoader = createAction<LoaderPayload>('TOGGLE_LOADER');
export const toggleAppLock = createAction<boolean>('TOGGLE_APP_LOCK');

interface NavReducer {
  show: boolean,
  loader: LoaderPayload,
  lockApp: boolean,
}

const reducer = createReducer<NavReducer>({}, {
  show: true,
  loader: {},
  lockApp: false,
});

reducer.on(toggleNavigation, state => ({
  ...state,
  show: !state.show,
}));

reducer.on(toggleLoader, (state, loader) => ({ ...state, loader }));

reducer.on(toggleAppLock, (state, lockApp) => ({ ...state, lockApp }));

export default reducer;
