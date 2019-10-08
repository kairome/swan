import { createSelector } from 'reselect';
import { rootSelector } from 'selectors/common';

export const getCurrentNoteSelector = createSelector(
  rootSelector,
  state => state.notes.current,
);

export const getNotesLength = createSelector(
  rootSelector,
  state => state.notes.list.length,
);
