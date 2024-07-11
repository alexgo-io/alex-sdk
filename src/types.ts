import { Currency } from './currency';
import {
  ClarityValue,
  FungiblePostCondition,
  STXPostCondition,
} from '@stacks/transactions';

/**
 * TokenInfo represents the details of a token that can be used in the AlexSDK.
 */
export type TokenInfo = {
  /**
   * The unique identifier of the currency.
   */
  id: Currency;

  /**
   * The display name of the token that ALEX maintains, usually the token symbol.
   */
  name: string;

  /**
   * The URL to the icon image of the token, maintained by ALEX.
   */
  icon: string;

  /**
   * The full asset id of the alex wrapped token in the format of "{deployer}.{contract}::{asset}".
   */
  wrapToken: string;

  /**
   * The number of decimal places for the wrapped token.
   */
  wrapTokenDecimals: number;

  /**
   * The full asset id of the underlying token in the format of "{deployer}.{contract}::{asset}".
   */
  underlyingToken: string;

  /**
   * The number of decimal places for the underlying token.
   */
  underlyingTokenDecimals: number;

  /**
   * A boolean flag indicating whether the token is a rebase token.
   * In a rebase token, getBalance is different from ft-balance
   * Also postcondition would need to be adjusted since amount is different from ft-events
   */
  isRebaseToken: boolean;
};

export type PoolData = {
  tokenX: Currency;
  tokenY: Currency;
  factor: bigint;
};

export type PriceData = {
  token: Currency;
  price: number;
};

export type AlexSDKResponse = {
  tokens: TokenInfo[];
  pools: PoolData[];
};

export type BackendAPIPriceResponse = PriceData[];

export type TxToBroadCast = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions: Array<FungiblePostCondition | STXPostCondition>;
};
