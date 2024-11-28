import {
  addressToString,
  FungibleConditionCode,
  parsePrincipalString,
  type FungibleComparator,
  type FungiblePostCondition,
  type StxPostCondition,
} from '@stacks/transactions';
import { Currency } from '../currency';
import type { TokenInfo } from '../types';

const fungibleConditionCodeToComparator = (
  code: FungibleConditionCode
): FungibleComparator => {
  const mapping: Record<FungibleConditionCode, FungibleComparator> = {
    [FungibleConditionCode.Equal]: 'eq',
    [FungibleConditionCode.Greater]: 'gt',
    [FungibleConditionCode.GreaterEqual]: 'gte',
    [FungibleConditionCode.Less]: 'lt',
    [FungibleConditionCode.LessEqual]: 'lte',
  };
  return mapping[code];
};

export const transferFactory =
  (tokenMapping: TokenInfo[]) =>
  (
    senderAddress: string,
    currency: Currency,
    amount: bigint,
    conditionCode: FungibleConditionCode = FungibleConditionCode.Equal
  ): FungiblePostCondition | StxPostCondition => {
    const mapping = tokenMapping.find((m) => m.id === currency);
    if (!mapping) {
      throw new Error('Token mapping not found');
    }
    const scale = BigInt(10 ** mapping.underlyingTokenDecimals);
    const nativeAmount = (amount * BigInt(scale)) / BigInt(1e8);

    // validate sender address
    addressToString(parsePrincipalString(senderAddress).address);

    if (currency === Currency.STX) {
      return {
        type: 'stx-postcondition',
        address: senderAddress,
        condition: fungibleConditionCodeToComparator(conditionCode),
        amount: nativeAmount,
      };
    }

    // For rebase tokens, use GreaterEqual with amount 0
    const finalConditionCode = mapping.isRebaseToken
      ? FungibleConditionCode.GreaterEqual
      : conditionCode;
    const finalAmount = mapping.isRebaseToken ? BigInt(0) : nativeAmount;

    return {
      type: 'ft-postcondition',
      address: senderAddress,
      condition: fungibleConditionCodeToComparator(finalConditionCode),
      amount: finalAmount,
      asset: mapping.underlyingToken as `${string}.${string}::${string}`,
    };
  };
