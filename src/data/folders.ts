import { FolderPayload } from 'types/folders';

import DataStore from 'nedb-promise';
import NeDBInstance from 'nedb-core';
import { dbOptions } from 'data/utils';

const dataStore = new NeDBInstance(dbOptions('folders.json'));
const db = DataStore.fromInstance(dataStore);

export const getAllFolders = () => {
  return db.cfind({}).sort({ createdAt: 1 }).exec();
};

export const getFolderById = (id: string) => {
  return db.findOne({ _id: id });
};

export const insertFolder = (folder: FolderPayload) => {
  return db.insert(folder);
};

export const updateFolderName = (id: string, name: string) => {
  return db.update({ _id: id }, {
    $set: {
      name,
    },
  });
};

export const removeFolderById = (folderId: string) => {
  return db.remove({ _id: folderId }, {});
};

