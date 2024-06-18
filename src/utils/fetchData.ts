import { Currency } from '../currency';
import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { configs } from '../config';
import { fromEntries, isNotNull } from './utils';
import { AlexSDKResponse, PriceData, TokenInfo } from '../types';

export async function getAlexSDKData(): Promise<AlexSDKResponse> {
  return fetch('https://alex-sdk-api.alexlab.co').then((r) => {
    if (r.ok) {
      return r.json();
    }
    throw new Error('Failed to fetch token mappings');
  });
}

export async function getPrices(mappings: TokenInfo[]): Promise<PriceData[]> {
  return fetch(`${configs.API_HOST}/v2/public/token-prices`)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw new Error('Failed to fetch token mappings');
    })
    .then((x: any) =>
      x.data
        .map((a: any): PriceData | null => {
          const token = mappings.find(
            (b) => b.underlyingToken.split('::')[0] === a.contract_id
          )?.id;
          if (token == null) {
            return null;
          }
          return {
            token,
            price: a.last_price_usd,
          };
        })
        .filter(isNotNull)
    );
}

export async function fetchBalanceForAccount(
  stxAddress: string,
  tokenMappings: TokenInfo[]
): Promise<Partial<{ [currency in Currency]: bigint }>> {
  const response: AddressBalanceResponse = await fetch(
    `${configs.STACKS_API_HOST}/extended/v1/address/${stxAddress}/balances`
  ).then((a) => a.json());
  return fromEntries(
    tokenMappings.map((a) => {
      if (a.id === Currency.STX) {
        return [a.id, BigInt(response.stx.balance) * BigInt(100)];
      }
      const fungibleToken =
        response.fungible_tokens[a.underlyingToken.split('::')[0]]?.balance;
      if (fungibleToken == null) {
        return [a.id, BigInt(0)];
      }
      return [
        a.id,
        (BigInt(fungibleToken) * BigInt(1e8)) /
          BigInt(10 ** a.underlyingTokenDecimals),
      ];
    })
  );
}
