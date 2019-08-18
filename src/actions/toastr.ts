import { createReducer, createAction } from 'redux-act';
import { ToastrItem, ToastrOptions } from 'types/toastr';
import { generateId } from 'utils/helpers';
import _ from 'lodash';

export const dispatchToastr = createAction<ToastrOptions>('DISPATCH_TOASTR');
export const clearToastr = createAction<string>('CLEAR_TOASTR');

interface ToastrReducer {
  toastrs: ToastrItem[],
}

const reducer = createReducer<ToastrReducer>({}, {
  toastrs: [],
});

reducer.on(dispatchToastr, (state, toastr) => {
  const newToastr = {
    ...toastr,
    delay: toastr.delay !== undefined ? toastr.delay : 3,
    id: generateId(),
  };
  return {
    ...state,
    toastrs: [
      ...state.toastrs,
      newToastr,
    ],
  };
});

reducer.on(clearToastr, (state, id) => {
  const toastrs = _.filter(state.toastrs, t => t.id !== id);
  return {
    ...state,
    toastrs,
  };
});

export default reducer;
