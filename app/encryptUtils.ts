import crypto from 'crypto-js';

export const encrypt = (text: string, key: string) => crypto.AES.encrypt(text, key).toString();

export const decrypt = (text: string, key: string) => {
  try {
    return crypto.AES.decrypt(text, key).toString(crypto.enc.Utf8);
  } catch (e) {
    console.error('Decryption failed. ', e);
    return text;
  }
};
