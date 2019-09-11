import path from 'path';
import os from 'os';
import crypto from 'crypto-js';
import fs from 'fs';
import { sync as writeAtomicSync } from 'write-file-atomic';
import _ from 'lodash';
import { decrypt, encrypt } from './encryptUtils';

const getStoreEncKey = () => {
  const cpus = os.cpus().map(c => c.model).join('');
  const userId = `${cpus}-${os.hostname()}-${os.platform()}${os.arch()}`;
  return crypto.SHA256(userId).toString();
};

const createHashStore = (userDataPath: string) => {
  const dbFilesPath = path.join(userDataPath, 'nedb');
  const storePath = path.join(dbFilesPath, 'store');
  const writeOptions = { encoding: 'utf8' };

  if (!fs.existsSync(storePath)) {
    writeAtomicSync(storePath, '', writeOptions);
  }

  let storeFile = fs.readFileSync(storePath, 'utf8');

  storeFile = storeFile ? decrypt(storeFile, getStoreEncKey()) : storeFile;
  const isProtected = () => !_.isEmpty(storeFile);

  const setHash = (hash: string) => {
    storeFile = hash;
    const newHash = hash ? encrypt(hash, getStoreEncKey()) : hash;
    writeAtomicSync(storePath, newHash, writeOptions);
  };

  const getHash = () => storeFile;

  return {
    isProtected,
    setHash,
    getHash,
  };
};

export default createHashStore;
