import { createReducer, createAction } from 'redux-act';

export const toggleNavigation = createAction('TOGGLE_NAVIGATION');

interface NavReducer {
  show: boolean;
}

const reducer = createReducer<NavReducer>({}, {
  show: true,
});

reducer.on(toggleNavigation, state => ({
  ...state,
  show: !state.show,
}));

export default reducer;
