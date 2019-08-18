import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import crypto from 'crypto-js';

interface ChangeEncryptionPayload {
  key: string,
  newKey?: string,
  firstEncryption?: boolean,
}

const encrypt = (text: string, key: string) => crypto.AES.encrypt(text, key).toString();

const decrypt = (text: string, key: string) => {
  try {
    return crypto.AES.decrypt(text, key).toString(crypto.enc.Utf8);
  } catch (e) {
    console.error('Decryption failed. ', e);
    return text;
  }
};

export const clearDbFilesData = (userDataPath: string) => {
  const dbFilesPath = path.join(userDataPath, 'nedb');
  const files = fs.readdirSync(dbFilesPath);
  const filteredFiles = _.filter(files, f => _.includes(f, '.json'));
  _.forEach(filteredFiles, fileName => {
    const filePath = path.join(dbFilesPath, fileName);
    fs.writeFileSync(filePath, '', 'utf8');
  });
};

export const changeDbFilesEncryption = (userDataPath: string, payload: ChangeEncryptionPayload) => {
  const dbFilesPath = path.join(userDataPath, 'nedb');
  const files = fs.readdirSync(dbFilesPath);
  const filteredFiles = _.filter(files, f => _.includes(f, '.json'));
  _.forEach(filteredFiles, fileName => {
    const filePath = path.join(dbFilesPath, fileName);
    const file = fs.readFileSync(filePath).toString();
    const fileLines = file.trim().split('\n');

    if (!_.isEmpty(fileLines)) {
      const { key, newKey, firstEncryption } = payload;
      const newLines = _.map(fileLines, fileLine => {
        try {
          if (firstEncryption) {
            return encrypt(fileLine, key);
          }

          const decrypted = decrypt(fileLine, key);
          if (newKey) {
            return encrypt(decrypted, newKey);
          }

          return decrypted;
        } catch (e) {
          return fileLine;
        }
      });

      fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    }
  });
};
