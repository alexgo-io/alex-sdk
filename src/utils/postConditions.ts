import {
  createFungiblePostCondition,
  createSTXPostCondition,
  FungibleConditionCode,
  FungiblePostCondition,
  STXPostCondition,
} from '@stacks/transactions';
import { CONTRACT_DEPLOYER } from '../config';
import { getCurrencyNativeAddress, getCurrencyNativeScale } from './currencyUtils';
import { Currency } from '../index';

export const AlexVault = `${CONTRACT_DEPLOYER}.alex-vault`;

export function transfer(
  senderAddress: string,
  currency: Currency,
  amount: bigint,
  compare: FungibleConditionCode = FungibleConditionCode.Equal
): FungiblePostCondition | STXPostCondition {
  const scale = getCurrencyNativeScale(currency);
  const nativeAmount = (amount * BigInt(scale)) / BigInt(1e8);
  if (currency === Currency.STX) {
    return createSTXPostCondition(senderAddress, compare, nativeAmount);
  }
  const assetIdentifier = getCurrencyNativeAddress(currency);
  return createFungiblePostCondition(
    senderAddress,
    compare,
    nativeAmount,
    assetIdentifier
  );
}
