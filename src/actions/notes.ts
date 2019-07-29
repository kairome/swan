import { createReducer, createAction } from 'redux-act';
import {
  AddNotePayload,
  ChangeNoteTitlePayload,
  Note, RemoveToDoListPayload,
  AddToDoListPayload,
  UpdateListSettingsPayload,
  UpdateNoteTextPayload,
  UpdateToDoListPayload,
  UpdateAllListsPayload,
  UpdateNoteContentSettingsPayload,
  NoteFilter,
  ArchiveNotePayload,
  RemoveNotePayload,
  MoveNotesPayload,
} from 'types/notes';

export const fetchNotes = createAction<NoteFilter>('FETCH_NOTES');
export const saveNotes = createAction<Note[]>('SAVE_NOTES');

export const addNote = createAction<AddNotePayload>('ADD_NOTE');
export const changeNoteTitle = createAction<ChangeNoteTitlePayload>('CHANGE_NOTE_TITLE');

export const fetchCurrentNote = createAction<string>('SET_CURRENT_NOTE');
export const saveCurrentNote = createAction<Note>('SAVE_CURRENT_NOTE');
export const resetCurrentNote = createAction('RESET_CURRENT_NOTE');

export const changeNoteText = createAction<UpdateNoteTextPayload>('CHANGE_NOTE_TEXT');
export const removeNote = createAction<RemoveNotePayload>('REMOVE_NOTE');
export const removeAllFolderNotes = createAction<string>('REMOVE_ALL_FOLDER_NOTES');

export const addToDoList = createAction<AddToDoListPayload>('ADD_TO_DO_LIST');
export const updateToDoList = createAction<UpdateToDoListPayload>('UPDATE_TO_DO_LIST');
export const updateListSettings = createAction<UpdateListSettingsPayload>('UPDATE_LIST_SETTINGS');
export const deleteToDoList = createAction<RemoveToDoListPayload>('DELETE_TO_DO_LIST');
export const updateAllLists = createAction<UpdateAllListsPayload>('UPDATE_ALL_TO_DO_LISTS');

export const setNoteContentSettings = createAction<UpdateNoteContentSettingsPayload>('SET_NOTE_CONTENT_SETTINGS');
export const changeNoteArchiveStatus = createAction<ArchiveNotePayload>('CHANGE_NOTE_ARCHIVE_STATUS');

export const moveNotesToFolder = createAction<MoveNotesPayload>('MOVE_NOTES_TO_FOLDER');

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
  isArchived: false,
  contentSettings: {
    hideTextEditor: false,
    hideLists: false,
  },
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

reducer.on(saveNotes, (state, list) => {
  return {
    ...state,
    list,
  };
});

export default reducer;
