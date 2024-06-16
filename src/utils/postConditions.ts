import {
  createFungiblePostCondition,
  createSTXPostCondition,
  FungibleConditionCode,
  FungiblePostCondition,
  STXPostCondition,
} from '@stacks/transactions';
import { Currency, STXCurrency } from '../currency';
import { TokenMapping } from '../types';

export const transferFactory =
  (tokenMapping: TokenMapping[]) =>
  (
    senderAddress: string,
    currency: Currency,
    amount: bigint,
    compare: FungibleConditionCode = FungibleConditionCode.Equal
  ): FungiblePostCondition | STXPostCondition => {
    const mapping = tokenMapping.find((m) => m.token === currency);
    if (!mapping) {
      throw new Error('Token mapping not found');
    }
    const scale = BigInt(10 ** mapping.wrapped_token_decimals);
    const nativeAmount = (amount * BigInt(scale)) / BigInt(1e8);
    if (currency === STXCurrency) {
      return createSTXPostCondition(senderAddress, compare, nativeAmount);
    }
    const assetIdentifier = `${mapping.wrapped_token}::${mapping.wrapped_token_asset}`;
    return createFungiblePostCondition(
      senderAddress,
      compare,
      nativeAmount,
      assetIdentifier
    );
  };
