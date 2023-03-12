import React from 'react';
import fetchSolPrice from '../utils/fetchSolPrice';
import {createAssociatedTokenAccountInstruction} from '../utils/helpers/instructions';
import {getMetadata, getMasterEdition, getCandyMachineCreator, getTokenWallet} from '../utils/helpers/accounts';
import * as anchor from '@project-serum/anchor';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';


describe('Test Function', () => {
  test('Fetch price sol >=0', async () => {
    const priceSol = await fetchSolPrice();
    expect(priceSol).toBeGreaterThanOrEqual(0);
  });
  test('Fetch price sol is number', async () => {
    const priceSol = await fetchSolPrice();
    expect(isNumber(priceSol)).toEqual(true);
  });
  test('get metadata is object data', async () => {
    const getData = await getMetadata(new anchor.web3.PublicKey('EP1tmMTfsSMeVZ31ymw3XShjwn2U7QgVizUtWkvm27K'));
    expect(isObject(getData)).toEqual(true);
  });
  test('getMasterEdition is object data', async () => {
    const getData = await getMasterEdition(new anchor.web3.PublicKey('EP1tmMTfsSMeVZ31ymw3XShjwn2U7QgVizUtWkvm27K'));
    expect(isObject(getData)).toEqual(true);
  });
  test('getCandyMachineCreator is object data', async () => {
    const getData = await getCandyMachineCreator(new anchor.web3.PublicKey('G564V5WCZF1ZFxmQAuyyBFqirrb5bG7Ey4LSwEmqLRDi'));
    expect(isObject(getData)).toEqual(true);
  });
  test('getTokenWallet is object data', async () => {
    const getData = await getTokenWallet(new anchor.web3.PublicKey('BsoLKuu9p14AkEbA8v5A69Cx12oDj3UuNQS7qRvdFbSG'), new anchor.web3.PublicKey('EP1tmMTfsSMeVZ31ymw3XShjwn2U7QgVizUtWkvm27K'));
    expect(isObject(getData)).toEqual(true);
  });
  test('createAssociatedTokenAccountInstruction is object data', async () => {
    const userTokenAccountAddress = await getTokenWallet(new anchor.web3.PublicKey('BsoLKuu9p14AkEbA8v5A69Cx12oDj3UuNQS7qRvdFbSG'), new anchor.web3.PublicKey('EP1tmMTfsSMeVZ31ymw3XShjwn2U7QgVizUtWkvm27K'));
    const getData = await createAssociatedTokenAccountInstruction(
      userTokenAccountAddress,
      new anchor.web3.PublicKey('BsoLKuu9p14AkEbA8v5A69Cx12oDj3UuNQS7qRvdFbSG'),
      new anchor.web3.PublicKey('BsoLKuu9p14AkEbA8v5A69Cx12oDj3UuNQS7qRvdFbSG'),
      new anchor.web3.PublicKey('EP1tmMTfsSMeVZ31ymw3XShjwn2U7QgVizUtWkvm27K'),
    );
    expect(isObject(getData)).toEqual(true);
  });
});
