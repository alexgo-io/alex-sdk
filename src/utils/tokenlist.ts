import { Currency } from '../currency';

export type TokenInfo = {
  type: 'fungibleToken';
  id: string;
  name: string;
  displayPrecision: number;
  icon: string;
  availableInSwap: boolean;
  contractAddress: string;
  decimals: number;
};

export function fetchTokenList(): Promise<TokenInfo[]> {
  return fetch('https://token-list.alexlab.co', {
    mode: 'cors',
  })
    .then((res) => res.json())
    .then((data) => data.tokens);
}

export async function fetchSwappableCurrency(): Promise<TokenInfo[]> {
  const tokens = await fetchTokenList();
  return tokens.filter(
    (x) =>
      x.availableInSwap && Object.values(Currency).includes(x.id as Currency)
  );
}
