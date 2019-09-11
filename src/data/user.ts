import { AppUser, UserSyncData } from 'types/user';

import DataStore from 'nedb-promise';
import dbOptions, { handleOnLoadError } from 'data/options';
import { Location } from 'history';
import NeDBInstance from 'nedb-core';
import { ipcRenderer } from 'electron';

const dataStore = new NeDBInstance(dbOptions('user.json'));
const db = DataStore.fromInstance(dataStore);

ipcRenderer.on('load-app', () => {
  dataStore.loadDatabase(handleOnLoadError);
});

db.findOne({}).then((resp?: AppUser) => {
  if (!resp) {
    db.insert({});
  }
});

export const saveUserLocation = (location: Location) => db.update({}, {
  $set: {
    location,
  },
});

export const getUserLocation = () => db.findOne({}).then((resp?: AppUser) => (resp ? resp.location : '/home'));

export const getUserSyncData = () => db.findOne({}).then((resp?: AppUser) => (resp && resp.sync ? resp.sync : null));

export const saveUserSyncData = (sync: UserSyncData | null) => {
  db.update({}, {
    $set: {
      sync,
    },
  });
};

export const updateUserAccessToken = (token: string) => {
  db.update({}, {
    $set: {
      'sync.googleCredentials.access_token': token,
    },
  });
};

export const updateUserSyncFrequency = (frequency: number) => {
  db.update({}, {
    $set: {
      'sync.syncFrequency': frequency,
    },
  });
};

export const updateUserFirstSync = (firstTime: boolean) => {
  db.update({}, {
    $set: {
      'sync.firstTime': firstTime,
    },
  });
};
