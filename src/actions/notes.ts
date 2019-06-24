import { createReducer, createAction } from 'redux-act';
import {
  AddNotePayload,
  ChangeNoteDescriptionPayload,
  ChangeNoteTitlePayload,
  Note,
  UpdateTodosPayload
} from 'types/notes';

export const fetchFolderNotes = createAction<string>('FETCH_FOLDER_NOTES');
export const saveFolderNotes = createAction<Note[]>('SAVE_FOLDER_NOTES');
export const addNote = createAction<AddNotePayload>('ADD_NOTE');
export const changeNoteTitle = createAction<ChangeNoteTitlePayload>('CHANGE_NOTE_TITLE');
export const fetchCurrentNote = createAction<string>('SET_CURRENT_NOTE');
export const saveCurrentNote = createAction<Note>('SAVE_CURRENT_NOTE');
export const resetCurrentNote = createAction('RESET_CURRENT_NOTE');
export const saveToDoLists = createAction<UpdateTodosPayload>('SAVE_NOTE_TODOS');
export const removeNote = createAction<string>('REMOVE_NOTE');
export const changeNoteDescription = createAction<ChangeNoteDescriptionPayload>('CHANGE_NOTE_DESCRIPTION');

interface NotesReducer {
  current: Note,
  list: Note[],
}

const defaultCurrentNote = {
  _id: '',
  title: '',
  text: '',
  folder: '',
  todoLists: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  description: '',
};

const reducer = createReducer<NotesReducer>({}, {
  current: defaultCurrentNote,
  list: [],
});

reducer.on(saveCurrentNote, (state, current) => {
  return {
    ...state,
    current,
  };
});

reducer.on(resetCurrentNote, (state) => {
  return {
    ...state,
    current: defaultCurrentNote,
  };
});

reducer.on(saveFolderNotes, (state, list) => {
  return {
    ...state,
    list,
  };
});

export default reducer;
