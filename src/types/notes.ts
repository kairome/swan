export interface ToDoItem {
  name: string,
  completed: boolean,
}

export type CompletedPosition = 'top' | 'bottom' | 'off';

export interface ToDoListSettings {
  completedPosition: CompletedPosition,
  minimized: boolean,
}

export interface ToDoListItem {
  title: string,
  settings: ToDoListSettings,
  items: ToDoItem[],
}

export interface NoteContentSettings {
  hideTextEditor: boolean,
  hideLists: boolean,
}

export interface Note {
  title: string,
  text: string,
  _id: string,
  createdAt: Date,
  updatedAt: Date,
  folder: string,
  todoLists: ToDoListItem[],
  contentSettings: NoteContentSettings,
}

export type NoteCopyPayload = Omit<Note, '_id' | 'createdAt' | 'updatedAt'>;

export interface AddNotePayload {
  title: string,
  folder: string,
  copy?: NoteCopyPayload,
}

export interface UpdateNoteTextPayload {
  id: string,
  text: string,
}

export interface ChangeNoteTitlePayload {
  id: string,
  title: string,
  folderId?: string,
}

export interface AddToDoListPayload {
  noteId: string,
  list: ToDoListItem,
}

export interface UpdateToDoListPayload extends AddToDoListPayload {
  listIndex: number,
}

export interface UpdateAllListsPayload {
  noteId: string,
  lists: ToDoListItem[],
}

export interface UpdateListSettingsPayload {
  noteId: string,
  listIndex: number,
  settings: ToDoListSettings,
}

export type RemoveToDoListPayload = Omit<UpdateListSettingsPayload, 'settings'>;

export interface UpdateNoteContentSettingsPayload {
  noteId: string,
  contentSettings: NoteContentSettings,
}
