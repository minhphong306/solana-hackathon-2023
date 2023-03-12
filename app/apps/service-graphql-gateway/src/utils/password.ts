import {getRandomInt} from "./random";

const specialChars = '!@#$%^&*(';
const numbers = '0123456789';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';

export const generateStrongPassword = (len: number, prefixString: string) => {
  const lowerChar = lowercase[getRandomInt(0, lowercase.length-1)];
  const upperChar = uppercase[getRandomInt(0, uppercase.length-1)];
  const numberChar = numbers[getRandomInt(0, numbers.length-1)];
  const specialChar = specialChars[getRandomInt(0, specialChars.length-1)];

  let password = `${prefixString}${lowerChar}${upperChar}${numberChar}${specialChar}`;

  const missingLen = len - password.length;

  if (missingLen > 0) {
    for (let i = 0; i < missingLen; i++) {
      password = `${password}${lowercase[getRandomInt(0, lowercase.length - 1)]}`;
    }
  }

  return password;
};
