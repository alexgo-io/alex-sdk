import { Currency } from '../currency';
import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { configs } from '../config';
import { fromEntries, isNotNull } from './utils';
import { AlexSDKResponse, PriceData, TokenInfo } from '../types';
import { callReadOnlyFunction } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import {
  principalCV,
  responseSimpleT,
  uintT,
  unwrapResponse,
} from 'clarity-codegen';

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
          if (a.contract_id === 'STX') {
            return {
              token: Currency.STX,
              price: a.last_price_usd,
            };
          }
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
    await Promise.all(
      tokenMappings.map(async (a) => {
        if (a.isRebaseToken) {
          // call readonly functions to get the correct balance
          const [contractAddr, contractName] = a.underlyingToken
            .split('::')[0]
            .split('.');
          const response = await callReadOnlyFunction({
            senderAddress: stxAddress,
            contractAddress: contractAddr,
            contractName: contractName,
            functionName: 'get-balance',
            functionArgs: [principalCV(stxAddress)],
            network: new StacksMainnet({
              url: configs.READONLY_CALL_API_HOST,
            }),
          });
          const amount = unwrapResponse(
            responseSimpleT(uintT).decode(response)
          );
          return [
            a.id,
            (BigInt(amount) * BigInt(1e8)) /
              BigInt(10 ** a.underlyingTokenDecimals),
          ];
        }
        if (a.id === Currency.STX) {
          return [a.id, BigInt(response.stx.balance) * BigInt(100)];
        }
        const fungibleToken =
          response.fungible_tokens[a.underlyingToken]?.balance;
        if (fungibleToken == null) {
          return [a.id, BigInt(0)];
        }
        return [
          a.id,
          (BigInt(fungibleToken) * BigInt(1e8)) /
            BigInt(10 ** a.underlyingTokenDecimals),
        ];
      })
    )
  );
}
