import { AddNotePayload, Note, ToDoListItem, ToDoListSettings } from 'types/notes';

const DataStore = require('nedb-promises');
import { dbOptions } from 'data/utils';

const db = DataStore.create(dbOptions('notes.json'));

export const getAllNotes = () => {
  return db.find({}).sort({ createdAt: -1 });
};

export const getNotesByFolder = (folderId: string) => {
  return db.find({ folder: folderId }).sort({ createdAt: -1 });
};

export const getNoteById = (id: string) => {
  return db.findOne({ _id: id });
};

export const insertNote = (note: AddNotePayload) => {
  return db.insert(note);
}

export const removeNoteById = (noteId: string) => {
  return db.remove({ _id: noteId }, {});
}

export const updateNoteTitle = (noteId: string, title: string) => {
  return db.update({ _id: noteId }, {
    $set: {
      title,
    },
  });
};

export const updateNoteDescription = (noteId: string, description: string) => {
  return db.update({ _id: noteId }, {
    $set: {
      description,
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

export const updateToDos = (noteId: string, listIndex: number, list: ToDoListItem) => {
  return db.update({ _id: noteId }, {
    $set: {
      [`todoLists.${listIndex}`]: list,
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

export const updateToDoListSettings = (noteId: string, listIndex: number, settings: ToDoListSettings) => {
  return db.update({ _id: noteId }, {
    $set: {
      [`todoLists.${listIndex}.settings`]: settings,
    },
  });
}

export const removeToDoList = (noteId: string, listIndex: number) => {
  return db.findOne({ _id: noteId }).then((resp: Note) => {
    const todos = [...resp.todoLists];
    todos.splice(listIndex, 1);
    return db.update({ _id: noteId }, {
      $set: {
        todoLists: todos,
      },
    });
  });
};
