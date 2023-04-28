import { Currency } from '../currency';
import { configs } from '../config';
import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

export function getCurrencyNativeScale(currency: Currency) {
  if (currency === Currency.STX) {
    return 1e6;
  }
  return configs.NATIVE_TOKEN_MAPPING[currency].decimals;
}

export function getCurrencyNativeAddress(currency: Currency) {
  if (currency === Currency.STX) {
    throw new Error('STX is not a token');
  }
  return configs.NATIVE_TOKEN_MAPPING[currency].assetIdentifier;
}

export function findCurrencyByNativeAddress(
  address: string
): Currency | undefined {
  return Object.values(Currency)
    .filter((a) => a !== Currency.STX)
    .find(
      (a) =>
        getCurrencyNativeAddress(a).split('::')[0] === address.split('::')[0]
    );
}

export async function fetchBalanceForAccount(
  stxAddress: string
): Promise<{ [currency in Currency]: bigint }> {
  const response: AddressBalanceResponse = await fetch(
    `${configs.API_HOST}/extended/v1/address/${stxAddress}/balances`
  ).then((a) => a.json());
  const allCurrencies = Object.values(Currency);
  const balances = allCurrencies.map((a) => {
    if (a === Currency.STX) return BigInt(response.stx.balance) * BigInt(100);
    const fungibleToken =
      response.fungible_tokens[getCurrencyNativeAddress(a)]?.balance;
    if (fungibleToken == null) {
      return BigInt(0);
    }
    return (
      (BigInt(fungibleToken) * BigInt(1e8)) / BigInt(getCurrencyNativeScale(a))
    );
  });
  return Object.fromEntries(
    allCurrencies.map((a, i) => [a, balances[i]])
  ) as any;
}
