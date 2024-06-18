import { Currency } from './currency';

export type TokenInfo = {
  id: Currency;
  name: string;
  icon: string;
  wrapToken: string;
  wrapTokenDecimals: number;
  underlyingToken: string;
  underlyingTokenDecimals: number;
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
