import { FolderPayload } from 'types/folders';

const DataStore = require('nedb-promises');
import { dbOptions } from 'data/utils';

const db = DataStore.create(dbOptions('folders.json'));

export const getAllFolders = () => {
  return db.find({}).sort({ createdAt: -1 });
};

export const getFolderById = (id: string) => {
  return db.findOne({ _id: id });
}

export const insertFolder = (folder: FolderPayload) => {
  return db.insert(folder);
}

export const updateFolderName = (id: string, name: string) => {
  return db.update({ _id: id }, {
    $set: {
      name,
    },
  });
}

