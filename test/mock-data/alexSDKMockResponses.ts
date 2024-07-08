import { AlexSDKResponse, PriceData, TokenInfo } from '../../src/types';
import { TxToBroadCast } from '../../src/helpers/SwapHelper';
import { Currency } from '../../src';

export const dummyFee = BigInt(777);

export const dummyRoute = ['TokenA', 'TokenB', 'TokenC'];

export const dummyRate = BigInt(1001);

export const dummyTx: TxToBroadCast = {
  'contractName': 'amm-pool-v2-01',
  'functionName': 'swap-helper',
  'functionArgs': [],
  'contractAddress': 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM',
  'postConditions': [],
};

export const dummyPrices: PriceData[] = [
  {
    'token': 'TokenA' as Currency,
    'price': 1.1,
  },
  {
    'token': 'TokenB' as Currency,
    'price': 2.2,
  },
];
export const parsedDummyPrices = {
  'TokenA': 1.1,
  'TokenB': 2.2,
};

export const dummyBalances = {
  'TokenA': BigInt(86794603901),
  'TokenB': BigInt(86794603902),
};

export const dummyCurrencies: TokenInfo[] = [
  {
    id: 'TokenA' as Currency,
    name: 'TKA',
    icon: '',
    wrapTokenDecimals: 8,
    wrapToken: '',
    underlyingToken: '',
    underlyingTokenDecimals: 6,
    isRebaseToken: false,
  },
  {
    id: 'TokenB' as Currency,
    name: 'TKB',
    icon: '',
    wrapTokenDecimals: 8,
    wrapToken: '',
    underlyingToken: '',
    underlyingTokenDecimals: 6,
    isRebaseToken: false,
  },
];
export const dummyAlexSDKData: AlexSDKResponse = {
  'tokens': dummyCurrencies,
  'pools': [],
};