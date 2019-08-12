import { AppUser } from 'types/user';

import DataStore from 'nedb-promise';
import dbOptions from 'data/options';
import { Location } from 'history';
import NeDBInstance from 'nedb-core';
import { ipcRenderer } from 'electron';

const dataStore = new NeDBInstance(dbOptions('user.json'));
const db = DataStore.fromInstance(dataStore);

ipcRenderer.on('load-app', () => {
  db.loadDatabase();
});


export const saveUserLocation = (location: Location) => db.update({ userName: 'guest' }, {
  $set: {
    location,
  },
});

export const getUserLocation = () =>
  db.findOne({ userName: 'guest' }).then((resp?: AppUser) => (resp ? resp.location : '/home'));
