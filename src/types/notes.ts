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

export interface Note {
  title: string,
  text: string,
  _id: string,
  createdAt: Date,
  updatedAt: Date,
  folder: string,
  todoLists: ToDoListItem[],
  description: string,
}

export interface AddNotePayload {
  title: string,
  folder: string,
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

export interface ChangeNoteDescriptionPayload {
  id: string,
  description: string,
  folderId?: string,
}

export interface AddToDoListPayload {
  noteId: string,
  list: ToDoListItem,
}

export interface UpdateToDoListPayload extends AddToDoListPayload {
  listIndex: number,
}

export interface UpdateListSettingsPayload {
  noteId: string,
  listIndex: number,
  settings: ToDoListSettings,
}

export type RemoveToDoListPayload = Omit<UpdateListSettingsPayload, 'settings'>;
