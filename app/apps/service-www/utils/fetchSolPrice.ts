import { get } from 'dot-prop';
import fetch from 'isomorphic-fetch';

export default async function fetchSolPrice() {
  const price = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
  );
  const result = await price.json();
  return parseInt(get(result, 'solana.usd', '0'));
}
