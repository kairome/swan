import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { sync as writeAtomicSync } from 'write-file-atomic';
import { decrypt, encrypt } from './encryptUtils';

interface ChangeEncryptionPayload {
  key: string,
  newKey?: string,
  firstEncryption?: boolean,
}

const writeOptions = {
  encoding: 'utf8',
};

export const clearDbFilesData = (userDataPath: string) => {
  const dbFilesPath = path.join(userDataPath, 'nedb');
  const files = fs.readdirSync(dbFilesPath);
  const filteredFiles = _.filter(files, f => _.includes(f, '.json'));
  _.forEach(filteredFiles, (fileName) => {
    const filePath = path.join(dbFilesPath, fileName);
    writeAtomicSync(filePath, '', writeOptions);
  });
};

export const changeDbFilesEncryption = (userDataPath: string, payload: ChangeEncryptionPayload) => {
  const dbFilesPath = path.join(userDataPath, 'nedb');
  const files = fs.readdirSync(dbFilesPath);
  const filteredFiles = _.filter(files, f => _.includes(f, '.json'));
  _.forEach(filteredFiles, (fileName) => {
    const filePath = path.join(dbFilesPath, fileName);
    const file = fs.readFileSync(filePath).toString();
    const fileLines = file.trim().split('\n');

    if (!_.isEmpty(fileLines)) {
      const { key, newKey, firstEncryption } = payload;
      const newLines = _.map(fileLines, (fileLine) => {
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

      writeAtomicSync(filePath, newLines.join('\n'), writeOptions);
    }
  });
};

export const getDbFiles = (userDataPath: string) => {
  const dbFilesPath = path.join(userDataPath, 'nedb');
  const files = fs.readdirSync(dbFilesPath);
  const filteredFiles = _.filter(files, f => _.includes(f, '.json') && f !== 'user.json');
  return _.reduce(filteredFiles, (acc, fileName) => ({
    ...acc,
    [fileName]: fs.readFileSync(path.join(dbFilesPath, fileName), 'utf8'),
  }), {});
};
