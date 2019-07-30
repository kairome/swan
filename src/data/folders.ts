import { FolderPayload } from 'types/folders';

import DataStore from 'nedb-promise';
import NeDBInstance from 'nedb-core';
import { dbOptions } from 'data/utils';

const dataStore = new NeDBInstance(dbOptions('folders.json'));
const db = DataStore.fromInstance(dataStore);

export const getAllFolders = () => db.cfind({}).sort({ createdAt: 1 }).exec();

export const getFolderById = (id: string) => db.findOne({ _id: id });

export const insertFolder = (folder: FolderPayload) => db.insert(folder);

export const updateFolderName = (id: string, name: string) => db.update({ _id: id }, {
  $set: {
    name,
  },
});

export const removeFolderById = (folderId: string) => db.remove({ _id: folderId }, {});
