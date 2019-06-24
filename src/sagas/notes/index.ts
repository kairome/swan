import addNote from 'sagas/notes/addNote';
import changeNoteTitle from 'sagas/notes/changeNoteTitle';
import getFolderNotes from 'sagas/notes/getFolderNotes';
import updateToDos from 'sagas/notes/updateToDos';
import getCurrentNote from 'sagas/notes/getCurrentNote';
import removeNote from 'sagas/notes/removeNote';
import changeNoteDescription from 'sagas/notes/changeNoteDescription';

export default [
  addNote,
  changeNoteTitle,
  getFolderNotes,
  updateToDos,
  getCurrentNote,
  removeNote,
  changeNoteDescription,
];
