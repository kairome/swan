import { FolderItem, FolderPayload } from 'types/folders';

import DataStore from 'nedb-promise';
import NeDBInstance from 'nedb-core';
import dbOptions, { handleOnLoadError } from 'data/options';
import _ from 'lodash';

import { ipcRenderer } from 'electron';

const dataStore = new NeDBInstance(dbOptions('folders.json'));
const db = DataStore.fromInstance(dataStore);

ipcRenderer.on('load-app', () => {
  dataStore.loadDatabase(handleOnLoadError);
});

export const getAllFolders = () => db.cfind({}).sort({ order: 1 }).exec();

export const getFolderById = (id: string) => db.findOne({ _id: id });

export const insertFolder = (folder: FolderPayload) => db.insert(folder);
export const updateFolderItems = (folders: FolderItem[]) => {
  _.forEach(folders, (folder) => db.update({ _id: folder._id }, folder, { upsert: true }));
};

export const updateFolderName = (id: string, name: string) => db.update({ _id: id }, {
  $set: {
    name,
  },
});

export const removeFolderById = (folderId: string) => db.remove({ _id: folderId }, {});
