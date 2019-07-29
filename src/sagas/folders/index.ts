import getAllFolders from 'sagas/folders/getAllFolders';
import addFolder from 'sagas/folders/addFolder';
import getCurrentFolder from 'sagas/folders/getCurrentFolder';
import renameFolder from 'sagas/folders/renameFolder';
import removeFolder from 'sagas/folders/removeFolder';

export default [
  getAllFolders,
  addFolder,
  getCurrentFolder,
  renameFolder,
  removeFolder,
];
