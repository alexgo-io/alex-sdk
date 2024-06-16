import { PoolData, PriceData, TokenMapping } from '../types';
import { createCurrency, Currency, STXCurrency } from '../currency';
import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { configs } from '../config';
import { fromEntries, isNotNull } from './utils';

export async function getMappingData(): Promise<TokenMapping[]> {
  return fetch(`${configs.API_HOST}/v2/public/token-mappings`)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw new Error('Failed to fetch token mappings');
    })
    .then((r: any) => r.data);
}

export async function getPoolData(): Promise<PoolData[]> {
  return fetch(`${configs.API_HOST}/v2/public/pools`)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw new Error('Failed to fetch token mappings');
    })
    .then((x: any) =>
      x.data.map(
        (a: any): PoolData => ({
          factor: BigInt(Math.round(a.factor * 1e8)),
          token_x: a.token_x,
          token_y: a.token_y,
        })
      )
    );
}
export async function getPrices(mappings: TokenMapping[]): Promise<PriceData[]> {
  return fetch(`${configs.API_HOST}/v2/public/token-prices`)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw new Error('Failed to fetch token mappings');
    })
    .then((x: any) =>
      x.data.map(
        (a: any): PriceData | null => {
          const token = mappings.find(b => b.wrapped_token === a.contract_id)?.token;
          if (token == null) {
            return null
          }
          return ({
            token,
            price: a.last_price_usd,
          });
        }
      ).filter(isNotNull)
    );
}

export async function fetchBalanceForAccount(
  stxAddress: string,
  tokenMappings: TokenMapping[]
): Promise<Partial<{ [currency in Currency]: bigint }>> {
  const response: AddressBalanceResponse = await fetch(
    `${configs.STACKS_API_HOST}/extended/v1/address/${stxAddress}/balances`
  ).then((a) => a.json());
  return fromEntries(
    tokenMappings.map((a) => {
      if (a.token === STXCurrency) {
        return [a.token, BigInt(response.stx.balance) * BigInt(100)];
      }
      const fungibleToken = response.fungible_tokens[a.wrapped_token]?.balance;
      if (fungibleToken == null) {
        return [a.token, BigInt(0)];
      }
      return [
        a.token,
        (BigInt(fungibleToken) * BigInt(1e8)) /
          BigInt(10 ** a.wrapped_token_decimals),
      ];
    })
  );
}
