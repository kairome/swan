import DataStore from 'nedb-promise';
import NeDBInstance from 'nedb-core';
import { dbOptions } from 'data/utils';

import {
  NewNotePayload,
  NoteContentSettings,
  NoteFilter,
  ToDoItem,
  ToDoListItem,
  ToDoListSettings
} from 'types/notes';


const dataStore = new NeDBInstance(dbOptions('notes.json'));
const db = DataStore.fromInstance(dataStore);

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

export const getNoteById = (id: string) => {
  return db.findOne({ _id: id });
};

export const insertNote = (note: NewNotePayload) => {
  return db.insert(note);
}

export const removeNoteById = (noteId: string) => {
  return db.remove({ _id: noteId }, {});
}

export const removeNotesByFolder = (folderId: string) => {
  return db.remove({ folder: folderId }, { multi: true });
}

export const updateNoteTitle = (noteId: string, title: string) => {
  return db.update({ _id: noteId }, {
    $set: {
      title,
    },
  });
};

export const updateNoteText = (noteId: string, text: string) => {
  return db.update({ _id: noteId }, {
    $set: {
      text,
    },
  });
};

export const updateNoteArchiveStatus = (noteId: string, isArchived: boolean) => {
  return db.update({ _id: noteId }, {
    $set: {
      isArchived,
    },
  });
};

export const updateAllNotesFolder = (moveFrom: string, moveTo: string) => {
  return db.update({ folder: moveFrom }, {
    $set: {
      folder: moveTo,
    },
  }, { multi: true });
};

export const updateNotesFolder = (moveFrom: string, moveTo: string, noteIds: string[]) => {
  return db.update({ _id: { $in: noteIds }, folder: moveFrom }, {
    $set: {
      folder: moveTo,
    },
  }, { multi: true });
};

export const updateListToDos = (listId: string, items: ToDoItem[]) => {
  return db.update({ 'todoLists.id': listId }, {
    $set: {
      'todoLists.$.items': items,
    },
  });
};

export const updateListTitle = (listId: string, title: string) => {
  return db.update({ 'todoLists.id': listId }, {
    $set: {
      'todoLists.$.title': title,
    },
  });
};

export const updateToDoLists = (noteId: string, todoLists: ToDoListItem[]) => {
  return db.update({ _id: noteId }, {
    $set: {
      todoLists,
    },
  });
};

export const addNoteToDoList = (noteId: string, list: ToDoListItem) => {
  return db.update({ _id: noteId }, {
    $push: {
      todoLists: list,
    },
  });
};

export const updateToDoListSettings = (listId: string, settings: ToDoListSettings) => {
  return db.update({ 'todoLists.id': listId }, {
    $set: {
      'todoLists.$.settings': settings,
    },
  });
}

export const updateNoteContentSettings = (noteId: string, contentSettings: NoteContentSettings) => {
  return db.update({ _id: noteId }, {
    $set: {
      contentSettings,
    },
  });
};

export const removeToDoList = (noteId: string, listId: string) => {
  return db.update({ _id: noteId }, {
    $pull: {
      todoLists: { id: listId },
    },
  });
};
