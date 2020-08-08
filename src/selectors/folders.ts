import { createSelector } from 'reselect';
import { rootSelector } from 'selectors/common';

export const getFolders = createSelector(
  rootSelector,
  state => state.folders.list,
);

export const getCurrentFolder = createSelector(
  rootSelector,
  state => state.folders.current,
);
