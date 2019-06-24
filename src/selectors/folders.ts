import { createSelector } from 'reselect';
import { rootSelector } from 'selectors/common';

export const getFoldersSelector = createSelector(
  rootSelector,
  (state) => state.folders.list,
);

export const getCurrentFolderSelector = createSelector(
  rootSelector,
  (state) => state.folders.current,
);
