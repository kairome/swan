import { createReducer, createAction } from 'redux-act';
import { FolderItem, RenameFolderPayload } from 'types/folders';

export const fetchFolders = createAction('FETCH_FOLDERS');
export const saveAllFolders = createAction<FolderItem[]>('SAVE_ALL_FOLDERS');
export const createFolder = createAction<string>('CREATE_FOLDER');

export const fetchCurrentFolder = createAction<string>('SET_CURRENT_FOLDER');
export const saveCurrentFolder = createAction<FolderItem>('SAVE_CURRENT_FOLDER');
export const resetCurrentFolder = createAction('RESET_CURRENT_FOLDER');

export const renameFolder = createAction<RenameFolderPayload>('RENAME_FOLDER');
export const removeFolder = createAction<string>('REMOVE_FOLDER');

interface FoldersReducer {
  list: FolderItem[],
  current: FolderItem,
}

const defaultFolder = {
  _id: '',
  name: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const reducer = createReducer<FoldersReducer>({}, {
  list: [],
  current: defaultFolder,
});

reducer.on(saveAllFolders, (state, list) => {
  return {
    ...state,
    list,
  };
});

reducer.on(saveCurrentFolder, (state, current) => {
  return {
    ...state,
    current,
  };
});

reducer.on(resetCurrentFolder, (state) => {
  return {
    ...state,
    current: defaultFolder,
  };
});

export default reducer;
