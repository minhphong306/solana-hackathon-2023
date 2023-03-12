import { emailValidation, passwordValidation } from '@mp-workspace/util';

describe('Test function validator email', () => {
  test('Email is number', () => {
    expect(emailValidation(123123)).toEqual(false);
  });
  test('Email is null', () => {
    expect(emailValidation(null)).toEqual(false);
  });
  test('Email is empty', () => {
    expect(emailValidation('')).toEqual(false);
  });
  test('Email is missing @', () => {
    expect(emailValidation('dunggmail.com')).toEqual(false);
  });
  test('Email is missing .', () => {
    expect(emailValidation('dung@gmail')).toEqual(false);
  });
  test('Email is correct', () => {
    expect(emailValidation('dung@gmail.com')).toEqual(true);
  });
  test('Email is correct', () => {
    expect(emailValidation('doanchithanh.arena@gmail.com')).toEqual(true);
  });
  test('Email is correct', () => {
    expect(emailValidation('doanchithanh.arena@gmail.com.vn')).toEqual(true);
  });
});

describe('Test function validator password', () => {
  test('password is number', () => {
    expect(passwordValidation(123123)).toEqual(false);
  });
  test('password is null', () => {
    expect(passwordValidation(null)).toEqual(false);
  });
  test('password is empty', () => {
    expect(passwordValidation('')).toEqual(false);
  });
  test('password is only lowercase letter', () => {
    expect(passwordValidation('dungdeptrai')).toEqual(false);
  });
  test('password is only uppercase letter', () => {
    expect(passwordValidation('DUNGDEPTRAI')).toEqual(false);
  });
  test('password no special character', () => {
    expect(passwordValidation('Dungdeptrai123')).toEqual(false);
  });
  test('password letter < 8 ', () => {
    expect(passwordValidation('Dungde')).toEqual(false);
  });
  test('check many special characters', () => {
    expect(passwordValidation('z)9V74>DZcG@6e2-')).toEqual(true);
  });
  test('it should return true', () => {
    expect(passwordValidation('SuckmyD1ck#123')).toEqual(true);
  });
  test('Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special characte', () => {
    expect(passwordValidation('Dungdeptrai123!')).toEqual(true);
  });
});
