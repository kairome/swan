export interface ToDoItem {
  name: string,
  completed: boolean,
}

export interface ToDoListSettings {
  completedPosition: 'top' | 'bottom' | 'off',
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

export interface UpdateTodosPayload {
  id: string,
  lists: ToDoListItem[],
}
