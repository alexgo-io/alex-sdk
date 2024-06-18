import {
  createFungiblePostCondition,
  createSTXPostCondition,
  FungibleConditionCode,
  FungiblePostCondition,
  STXPostCondition,
} from '@stacks/transactions';
import { Currency } from '../currency';
import { TokenInfo } from '../types';

export const transferFactory =
  (tokenMapping: TokenInfo[]) =>
  (
    senderAddress: string,
    currency: Currency,
    amount: bigint,
    compare: FungibleConditionCode = FungibleConditionCode.Equal
  ): FungiblePostCondition | STXPostCondition => {
    const mapping = tokenMapping.find((m) => m.id === currency);
    if (!mapping) {
      throw new Error('Token mapping not found');
    }
    const scale = BigInt(10 ** mapping.underlyingTokenDecimals);
    let nativeAmount = (amount * BigInt(scale)) / BigInt(1e8);
    if (currency === Currency.STX) {
      return createSTXPostCondition(senderAddress, compare, nativeAmount);
    }
    if (mapping.isRebaseToken) {
      // Currently the rebase token's ft-amount is different from actual amount
      // We have to fallback to a weak PostCondition for them
      compare = FungibleConditionCode.GreaterEqual;
      nativeAmount = BigInt(0);
    }
    return createFungiblePostCondition(
      senderAddress,
      compare,
      nativeAmount,
      mapping.underlyingToken
    );
  };
