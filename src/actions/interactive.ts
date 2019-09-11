import { createReducer, createAction } from 'redux-act';
import { InteractiveMoveNotesPayload } from 'types/interactive';

export const toggleMoveNotes = createAction('TOGGLE_MOVE_NOTES');
export const setNotesToMove = createAction<InteractiveMoveNotesPayload>('SET_NOTES_TO_MOVE');
export const resetNotesToMove = createAction('RESET_NOTES_TO_MOVE');
export const showDbLoadError = createAction('SHOW_DB_LOAD_ERROR');
export const toggleSyncMismatchModal = createAction('TOGGLE_SYNC_MISMATCH_MODAL');

interface NavReducer {
  enableMoveNotes: boolean,
  notesToMove: string[],
  moveFrom: string,
  dbLoadError: boolean,
  syncMismatch: boolean,
}

const reducer = createReducer<NavReducer>({}, {
  enableMoveNotes: false,
  notesToMove: [],
  moveFrom: '',
  dbLoadError: false,
  syncMismatch: false,
});

reducer.on(toggleMoveNotes, state => ({
  ...state,
  enableMoveNotes: !state.enableMoveNotes,
}));

reducer.on(setNotesToMove, (state, payload) => ({
  ...state,
  enableMoveNotes: true,
  notesToMove: payload.noteIds,
  moveFrom: payload.moveFrom,
}));

reducer.on(resetNotesToMove, state => ({
  ...state,
  enableMoveNotes: false,
  notesToMove: [],
}));

reducer.on(showDbLoadError, state => ({
  ...state,
  dbLoadError: true,
}));

reducer.on(toggleSyncMismatchModal, state => ({
  ...state,
  syncMismatch: !state.syncMismatch,
}));

export default reducer;
