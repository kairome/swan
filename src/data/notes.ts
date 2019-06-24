import { AddNotePayload, ToDoListItem } from 'types/notes';

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

export const updateToDoLists = (noteId: string, todoLists: ToDoListItem[]) => {
  return db.update({ _id: noteId }, {
    $set: {
      todoLists,
    },
  });
};
