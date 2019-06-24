import { remote } from 'electron';

export const dbOptions = (dbName: string) => {
  return {
    filename: `${remote.app.getPath('userData')}/nedb/${dbName}`,
    autoload: true,
    timestampData: true,
  };
};
