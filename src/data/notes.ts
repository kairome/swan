import DataStore from 'nedb-promise';
import NeDBInstance from 'nedb-core';
import dbOptions, { handleOnLoadError } from 'data/options';

import {
  NewNotePayload,
  NoteContentSettings,
  NoteFilter,
  ToDoItem,
  ToDoListItem,
  ToDoListSettings,
} from 'types/notes';
import { ipcRenderer } from 'electron';


const dataStore = new NeDBInstance(dbOptions('notes.json'));
const db = DataStore.fromInstance(dataStore);

ipcRenderer.on('load-app', () => {
  dataStore.loadDatabase(handleOnLoadError);
});

interface NoteQuery {
  folder?: string,
  isArchived?: boolean,
}

export const getAllNotes = (filter: NoteFilter) => {
  const dbQuery: NoteQuery = {
    isArchived: false,
  };

  const { folderId, isArchived } = filter;
  if (folderId !== undefined) {
    dbQuery.folder = folderId;
  }

  if (isArchived !== undefined) {
    dbQuery.isArchived = isArchived;
  }

  return db.cfind(dbQuery).sort({ createdAt: -1 }).exec();
};

export const getNoteById = (id: string) => db.findOne({ _id: id });

export const insertNote = (note: NewNotePayload) => db.insert(note);

export const removeNoteById = (noteId: string) => db.remove({ _id: noteId }, {});

export const removeNotesByFolder = (folderId: string) => db.remove({ folder: folderId }, { multi: true });

export const updateNoteTitle = (noteId: string, title: string) => db.update({ _id: noteId }, {
  $set: {
    title,
  },
});

export const updateNoteText = (noteId: string, text: string) => db.update({ _id: noteId }, {
  $set: {
    text,
  },
});

export const updateNoteArchiveStatus = (noteId: string, isArchived: boolean) => db.update({ _id: noteId }, {
  $set: {
    isArchived,
  },
});

export const updateAllNotesFolder = (moveFrom: string, moveTo: string) => db.update({ folder: moveFrom }, {
  $set: {
    folder: moveTo,
  },
}, { multi: true });

export const updateNotesFolder = (moveFrom: string, moveTo: string, noteIds: string[]) => db.update(
  {
    _id: { $in: noteIds },
    folder: moveFrom,
  }, {
    $set: {
      folder: moveTo,
    },
  },
  {
    multi: true,
  },
);

export const updateListToDos = (listId: string, items: ToDoItem[]) => db.update({ 'todoLists.id': listId }, {
  $set: {
    'todoLists.$.items': items,
  },
});

export const updateListTitle = (listId: string, title: string) => db.update({ 'todoLists.id': listId }, {
  $set: {
    'todoLists.$.title': title,
  },
});

export const updateToDoLists = (noteId: string, todoLists: ToDoListItem[]) => db.update({ _id: noteId }, {
  $set: {
    todoLists,
  },
});

export const addNoteToDoList = (noteId: string, list: ToDoListItem) => db.update({ _id: noteId }, {
  $push: {
    todoLists: list,
  },
});

export const updateToDoListSettings = (listId: string, settings: ToDoListSettings) =>
  db.update({ 'todoLists.id': listId }, {
    $set: {
      'todoLists.$.settings': settings,
    },
  });

export const updateNoteContentSettings = (noteId: string, contentSettings: NoteContentSettings) =>
  db.update({ _id: noteId }, {
    $set: {
      contentSettings,
    },
  });

export const removeToDoList = (noteId: string, listId: string) => db.update({ _id: noteId }, {
  $pull: {
    todoLists: { id: listId },
  },
});
