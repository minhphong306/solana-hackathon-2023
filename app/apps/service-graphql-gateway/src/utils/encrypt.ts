import crypto from "crypto";
import {Buffer} from "buffer";


export const encrypt = (text: string, algorithm = 'aes-128-ecb', secretKey = process.env["ENCRYPT_PASSWORD_SECRET_KEY"]) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, null);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return encrypted.toString('base64');
};

export const decrypt = (hash: string, algorithm = 'aes-128-ecb', secretKey = process.env.ENCRYPT_PASSWORD_SECRET_KEY) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, null);
  try {
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'base64')), decipher.final()]);
    return decrpyted.toString('utf-8');
  } catch (e) {

    return null;
  }
};
