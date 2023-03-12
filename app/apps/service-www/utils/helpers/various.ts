import {CLUSTERS, DEFAULT_CLUSTER} from './constants';
import {NftRobot} from '../types';
import isEmpty from 'lodash/isEmpty';

export function getCluster(name: string): string {
  for (const cluster of CLUSTERS) {
    if (cluster.name === name) {
      return cluster.url;
    }
  }
  return DEFAULT_CLUSTER.url;
}

export const getUnixTs = () => {
  return new Date().getTime() / 1000;
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface PartIn {
  trait_type: string;
  value: string;
}

export function convertPart(partIn: PartIn) {
  let url = '/service-www/bot';
  let category = '';
  if (partIn.trait_type.startsWith('Wheel')) {
    url = url + '/wheel';
    category = 'Wheel';
  } else {
    url = url + '/' + partIn.trait_type.toLowerCase();
    category = partIn.trait_type[0].toUpperCase() + partIn.trait_type.slice(1);
  }
  const [type, ...name] = partIn.value.split(' ');
  let namePart = name.join(' ');
  const typePart = type;
  switch (type) {
  case 'Common':
    name.push('1');
    break;
  case 'Uncommon':
    name.push('2');
    break;
  case 'Rare':
    name.push('3');
    break;
  case 'Epic':
    name.push('4');
    break;
  case 'Mysthical':
  case 'Mythical':
    name.push('5');
    break;
  case 'Legendary':
    name.push('6');
    break;
  }
  url = url + '/' + name.join('_').toLowerCase() + '.png';

  switch (namePart) {
  case 'Infinity Gauntlet':
    namePart = 'God Gauntlet';
    break;
  case 'Gyratory Forklift':
    namePart = 'Forklift';
    break;
  case 'Butcher Chainsaw':
    namePart = 'Brutal Chainsaw';
    break;
  case 'Reverse Booster':
    namePart = 'Back Booster';
    break;
  case 'Sonic Explosive':
    namePart = 'Sonic Bomb';
    break;
  default:
    break;
  }

  return {
    name: namePart,
    type: typePart,
    imgUrl: url,
    category: category,
  };
}

export function getURLImagePart(part: NftRobot): string {
  let path = '/service-www/bot';
  path = path + '/' + part?.metadata?.attributes[0]?.value.toLowerCase();
  path =
    path +
    '/' +
    part?.metadata?.attributes[2]?.value.toLowerCase().split(' ').join('_');
  switch (part?.metadata?.attributes[1].value) {
  case 'Common':
    path = path + '_' + '1' + '.png';
    break;
  case 'Uncommon':
    path = path + '_' + '2' + '.png';
    break;
  case 'Rare':
    path = path + '_' + '3' + '.png';
    break;
  case 'Epic':
    path = path + '_' + '4' + '.png';
    break;
  case 'Mythical':
    path = path + '_' + '5' + '.png';
    break;
  case 'Legendary':
    path = path + '_' + '6' + '.png';
    break;
  }
  return path;
}

export async function fetchSolPrice(): Promise<number> {
  const price = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
  );
  const result = await price.json();
  return parseInt(result.solana.usd);
}