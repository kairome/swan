import { AppUser } from 'types/user';

const DataStore = require('nedb-promises');
import { dbOptions } from 'data/utils';
import { Location } from 'history';

const db = DataStore.create(dbOptions('user.json'));

export const saveUserLocation = (location: Location) => {
  return db.update({ userName: 'guest'}, {
    $set: {
      location,
    },
  })
};

export const getUserLocation = () => {
  return db.findOne({ userName: 'guest' }).then((resp: AppUser) => resp.location);
};
