import { Connection, programs } from '@metaplex/js';
import * as solanaWeb3 from '@solana/web3.js';
import { isObject } from 'lodash';
import getMetadataPublicKey from './getMetadataPublicKey';
import { TOKEN_PROGRAM_ID } from './helpers/constants';
import { logAllItemsInPage } from './logAllItemsInPage';
import { NftRobot } from './types';

const {
  metadata: { Metadata }
} = programs;

export const fetchNftTokenAddressList = async (
  connection: Connection,
  userPublicKey: solanaWeb3.PublicKey
): Promise<solanaWeb3.PublicKey[]> => {
  const hashListJson = await (async function () {
    if (process.env.NODE_ENV !== 'production') {
      const hashList = await import('../public/list-robot-mainnet-beta.json');
      return hashList.default;
    } else {
      const hashList = await import('../public/list-robot-devnet.json');
      return hashList.default;
    }
  })();

  try {
    const accounts = await connection.getParsedTokenAccountsByOwner(
      userPublicKey,
      {
        programId: new solanaWeb3.PublicKey(TOKEN_PROGRAM_ID),
      }
    );
    const NftTokenAddressList = [];
    const filerByOwner = await FilterPart(connection, userPublicKey);
    filerByOwner.map((value, key) => {
      hashListJson.map((valueJson, keyJson) => {
        if (valueJson.index === value['index']) {
          NftTokenAddressList.push({
            type: 2, // swap incomplete
            publickey: new solanaWeb3.PublicKey(valueJson.address),
          });
        }
      });
    });
    accounts.value.map((account) => {
      if (
        hashListJson
          .map((e) => {
            return e.address;
          })
          .indexOf(account.account.data.parsed.info.mint) >= 0
      ) {
        if (
          account?.account?.data?.parsed?.info?.mint &&
          parseInt(
            account?.account?.data?.parsed?.info?.tokenAmount?.amount
          ) !== 0
        ) {
          NftTokenAddressList.push({
            type: 1,
            publickey: new solanaWeb3.PublicKey(
              account?.account?.data?.parsed?.info?.mint
            ),
          });
        }
      }
    });
    return NftTokenAddressList;
  } catch {
    return [];
  }
};

export const fetchMetadataUserTokens = async (
  connection: Connection,
  userPublicKey: solanaWeb3.PublicKey
): Promise<any[]> => {
  try {
    const nftTokenAddressList = await fetchNftTokenAddressList(
      connection,
      userPublicKey
    );
    const metadataList = [];
    await Promise.all(
      nftTokenAddressList.map(async (nftTokenAddress) => {
        try {
          const metadataPublicKey = await getMetadataPublicKey(
            nftTokenAddress['publickey']
          );
          const metaData = await Metadata.load(connection, metadataPublicKey);
          if (isObject(metaData)) {
            const ata = await connection.getTokenLargestAccounts(
              nftTokenAddress['publickey']
            );
            const metaDataFromArweave = await (
              await fetch(metaData.data.data.uri)
            ).json();
            metaDataFromArweave.properties.creators =
              metaData.data.data.creators;
            metadataList.push({
              publicKey: nftTokenAddress['publickey'],
              metadata: metaDataFromArweave,
              ataAddress: ata.value[0].address,
              type: nftTokenAddress['type'],
            });
          }
        } catch (e) {
          return;
        }
      })
    );
    return metadataList;
  } catch {
    return [];
  }
};

export const fetchToken = async (
  connection: Connection,
  robotTokenAddress: solanaWeb3.PublicKey
): Promise<NftRobot | null> => {
  try {
    const metadataPublicKey = await getMetadataPublicKey(robotTokenAddress);
    const metaData = await Metadata.load(connection, metadataPublicKey);
    if (isObject(metaData)) {
      const metaDataFromArweave = await (
        await fetch(metaData.data.data.uri)
      ).json();
      metaDataFromArweave.properties.creators = metaData.data.data.creators;
      const ata = await connection.getTokenLargestAccounts(robotTokenAddress);
      return {
        publicKey: robotTokenAddress,
        metadata: metaDataFromArweave,
        ataAddress: ata.value[0].address,
      };
    }
  } catch (e) {
    return;
  }
};

export const paginate = (array, page_size: number, page_number: number) => {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};

export const FilterPart = async (
  connection: solanaWeb3.Connection,
  userPublicKey: solanaWeb3.PublicKey
): Promise<solanaWeb3.PublicKey[]> => {
  const getAllItems = await logAllItemsInPage(connection);
  const filerByOwner = getAllItems.filter(
    (value) =>
      value.owner === userPublicKey.toString() &&
      (value.opened_body == 1 ||
        value.opened_gadget == 1 ||
        value.opened_weapon == 1 ||
        value.opened_wheel1 == 1 ||
        value.opened_wheel2 == 1) &&
      value.opened_body +
        value.opened_gadget +
        value.opened_weapon +
        value.opened_wheel1 +
        value.opened_wheel2 <
        4
  );

  return filerByOwner;
};