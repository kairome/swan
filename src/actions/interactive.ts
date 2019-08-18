import { createReducer, createAction } from 'redux-act';
import { InteractiveMoveNotesPayload } from 'types/interactive';

export const toggleMoveNotes = createAction('TOGGLE_MOVE_NOTES');
export const setNotesToMove = createAction<InteractiveMoveNotesPayload>('SET_NOTES_TO_MOVE');
export const resetNotesToMove = createAction('RESET_NOTES_TO_MOVE');

interface NavReducer {
  enableMoveNotes: boolean,
  notesToMove: string[],
  moveFrom: string,
}

const reducer = createReducer<NavReducer>({}, {
  enableMoveNotes: false,
  notesToMove: [],
  moveFrom: '',
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

export default reducer;
