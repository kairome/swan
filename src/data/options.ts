import { remote, ipcRenderer } from 'electron';
import crypto from 'crypto-js';

const isJson = (doc: string) => {
  try {
    const item = JSON.parse(doc);
    return typeof item === 'object' && item !== null;
  } catch (e) {
    return false;
  }
};

let key = '';
ipcRenderer.on('hash-ready', (event: any, arg: string) => {
  key = arg;
});

const dbOptions = (dbName: string) => ({
  filename: `${remote.app.getPath('userData')}/nedb/${dbName}`,
  timestampData: true,
  afterSerialization: (doc: string) => {
    if (key && isJson(doc)) {
      return crypto.AES.encrypt(doc, key).toString();
    }
    return doc;
  },
  beforeDeserialization: (doc: string) => {
    try {
      if (key) {
        const decrypted = crypto.AES.decrypt(doc, key).toString(crypto.enc.Utf8);
        if (isJson(decrypted)) {
          return decrypted;
        }
      }
      return doc;
    } catch (e) {
      return doc;
    }
  },
});

export default dbOptions;
