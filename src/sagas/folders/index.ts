import getAllFolders from 'sagas/folders/getAllFolders';
import addFolder from 'sagas/folders/addFolder';
import getCurrentFolder from 'sagas/folders/getCurrentFolder';
import renameFolder from 'sagas/folders/renameFolder';

export default [
  getAllFolders,
  addFolder,
  getCurrentFolder,
  renameFolder,
];
