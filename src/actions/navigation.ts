import { createReducer, createAction } from 'redux-act';
import { LoaderPayload } from 'types/entities';

export const toggleNavigation = createAction('TOGGLE_NAVIGATION');
export const toggleLoader = createAction<LoaderPayload>('TOGGLE_LOADER');

interface NavReducer {
  show: boolean,
  loader: LoaderPayload,
}

const reducer = createReducer<NavReducer>({}, {
  show: true,
  loader: {},
});

reducer.on(toggleNavigation, state => ({
  ...state,
  show: !state.show,
}));

reducer.on(toggleLoader, (state, loader) => ({ ...state, loader }));

export default reducer;
