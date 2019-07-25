import { createReducer, createAction } from 'redux-act';
import { FolderItem, RenameFolderPayload } from 'types/folders';

export const fetchFolders = createAction('FETCH_FOLDERS');
export const saveAllFolders = createAction<FolderItem[]>('SAVE_ALL_FOLDERS');
export const createFolder = createAction<string>('CREATE_FOLDER');

export const fetchCurrentFolder = createAction<string>('SET_CURRENT_FOLDER');
export const saveCurrentFolder = createAction<FolderItem>('SAVE_CURRENT_FOLDER');

export const renameFolder = createAction<RenameFolderPayload>('RENAME_FOLDER');

interface FoldersReducer {
  list: FolderItem[],
  current: FolderItem,
}

const reducer = createReducer<FoldersReducer>({}, {
  list: [],
  current: {
    _id: '',
    name: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
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

export default reducer;
