import isString from 'lodash/isString';
import {getATATokenWallet} from '../../containers/ClaimToken/constants';

describe('Test claim token', () => {
  test('create ATA success', async () => {
    const ata = await getATATokenWallet('5iQCVNCkvuep5mRC1RojjAu5zbqrh9Rg2PQPhm9zWd9d', 'EMzz8g2iheJnE54SVV97xUQq3Fmf5w1pJ7B9rEF24HuB');
    expect(isString(ata.toBase58())).toEqual(true);
  });

  test('create ATA failed', async () => {
    try {
      const ata = await getATATokenWallet('5iQCVNCkvuep5mRC1RojjAu5zbqrh9Rg2PQPhm9zW', 'EMzz8g2iheJnE54SVV97xUQq3Fmf5w1pJ7B9rEF24HuB');
      console.log(ata, 'ata');
    } catch (e) {
      expect(isString(e.message)).toEqual(true);
    }
  });
});
