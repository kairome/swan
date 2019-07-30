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
  id: string,
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
  isArchived: boolean,
}

export type NoteCopyPayload = Omit<Note, '_id' | 'createdAt' | 'updatedAt'>;
export type NewNotePayload = NoteCopyPayload;

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
  noteArchived?: boolean,
  folderId?: string,
}

export interface AddToDoListPayload {
  noteId: string,
  list: ToDoListItem,
}

export interface UpdateToDoListItemsPayload {
  noteId: string,
  listId: string,
  items: ToDoItem[],
}

export interface UpdateToDoListTitlePayload {
  noteId: string,
  listId: string,
  title: string,
}

export interface UpdateAllListsPayload {
  noteId: string,
  lists: ToDoListItem[],
}

export interface UpdateListSettingsPayload {
  noteId: string,
  listId: string,
  settings: ToDoListSettings,
}

export type RemoveToDoListPayload = Omit<UpdateListSettingsPayload, 'settings'>;

export interface UpdateNoteContentSettingsPayload {
  noteId: string,
  contentSettings: NoteContentSettings,
}

export interface NoteFilter {
  folderId?: string,
  isArchived?: boolean,
}

export interface ArchiveNotePayload {
  noteId: string,
  folderId: string,
  isArchived: boolean,
  inList?: boolean,
}

export type RemoveNotePayload = ArchiveNotePayload;

export interface MoveNotesPayload {
  moveFrom: string,
  moveTo: string,
  noteIds: string[],
}
