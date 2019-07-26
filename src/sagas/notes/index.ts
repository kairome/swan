import addNote from 'sagas/notes/addNote';
import changeNoteTitle from 'sagas/notes/changeNoteTitle';
import getNotes from 'sagas/notes/getNotes';
import updateToDos from 'sagas/notes/updateToDos';
import getCurrentNote from 'sagas/notes/getCurrentNote';
import removeNote from 'sagas/notes/removeNote';
import changeNoteText from 'sagas/notes/changeNoteText';
import updateListSettings from 'sagas/notes/updateListSettings';
import deleteToDoList from 'sagas/notes/deleteToDoList';
import addToDoList from 'sagas/notes/addToDoList';
import updateAllLists from 'sagas/notes/updateAllLists';
import setNoteSettings from 'sagas/notes/setNoteSettings';
import changeNoteArchiveStatus from 'sagas/notes/changeNoteArchiveStatus';

export default [
  addNote,
  changeNoteTitle,
  getNotes,
  updateToDos,
  getCurrentNote,
  removeNote,
  changeNoteText,
  updateListSettings,
  deleteToDoList,
  addToDoList,
  updateAllLists,
  setNoteSettings,
  changeNoteArchiveStatus,
];
