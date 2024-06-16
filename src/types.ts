import { Currency } from './currency';

export type TokenMapping = {
  token: Currency;
  token_decimals: 8;
  token_asset: string;
  wrapped_token: string;
  wrapped_token_decimals: number;
  wrapped_token_asset: string;
};

export type PoolData = {
  token_x: Currency;
  token_y: Currency;
  factor: bigint;
};

export type PriceData = {
  token: Currency;
  price: number
}