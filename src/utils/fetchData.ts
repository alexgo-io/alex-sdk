import { AlexSDKError, AlexErrorType } from '../errors'
import { Currency } from '../currency';
import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { configs } from '../config';
import { fromEntries, isNotNull } from './utils';
import type {
  AlexSDKResponse,
  BackendAPIPriceResponse,
  PriceData,
  TokenInfo,
} from '../types';
import { fetchCallReadOnlyFunction } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import {
  principalCV,
  responseSimpleT,
  uintT,
  unwrapResponse,
} from 'clarity-codegen';

type RawPriceEntry = { contract_id: string; last_price_usd: number }
type RawPricesResponse = { data: RawPriceEntry[] }

export async function getAlexSDKData(): Promise<AlexSDKResponse> {
  return fetch(configs.SDK_API_HOST)
    .then((r): Promise<AlexSDKResponse> => {
      if (r.ok) {
        return r.json();
      }
      throw new AlexSDKError(AlexErrorType.FetchFailed, 'SDK Data Fetch Failed', r.status, `Failed to fetch SDK data: HTTP ${r.status}`);
    })
    .then((x) => {
      for (const a of x.pools) {
        a.poolId = BigInt(a.poolId);
        a.factor = BigInt(a.factor);
      }
      return x;
    });
}

export async function getPrices(
  mappings: TokenInfo[]
): Promise<BackendAPIPriceResponse> {
  return fetch(`${configs.BACKEND_API_HOST}/v2/public/token-prices`)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw new AlexSDKError(AlexErrorType.FetchFailed, 'Token Prices Fetch Failed', r.status, `Failed to fetch token prices: HTTP ${r.status}`);
    })
    .then((x: RawPricesResponse) =>
      x.data
        .map((a: RawPriceEntry): PriceData | null => {
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
  const response = await fetch(
    `${configs.STACKS_API_HOST}/extended/v1/address/${stxAddress}/balances`
  );
  if (!response.ok) {
    throw new AlexSDKError(AlexErrorType.FetchFailed, 'Account Balances Fetch Failed', response.status, `Failed to fetch account balances: HTTP ${response.status}`);
  }
  const balanceData: AddressBalanceResponse = await response.json();
  return fromEntries(
    await Promise.all(
      tokenMappings.map(async (a) => {
        if (a.isRebaseToken) {
          // call readonly functions to get the correct balance
          const [contractAddr, contractName] = a.underlyingToken
            .split('::')[0]
            .split('.');
          const response = await fetchCallReadOnlyFunction({
            senderAddress: stxAddress,
            contractAddress: contractAddr,
            contractName: contractName,
            functionName: 'get-balance',
            functionArgs: [principalCV(stxAddress)],
            network: {
              ...STACKS_MAINNET,
              client: {
                ...STACKS_MAINNET.client,
                baseUrl: configs.READONLY_CALL_API_HOST,
              },
            },
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
          return [a.id, BigInt(balanceData.stx.balance) * BigInt(100)];
        }
        const fungibleToken =
          balanceData.fungible_tokens[a.underlyingToken]?.balance;
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
