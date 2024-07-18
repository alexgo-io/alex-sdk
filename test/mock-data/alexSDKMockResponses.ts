import {
  AlexSDKResponse,
  PoolData,
  PriceData,
  TokenInfo,
} from '../../src/types';
import { TxToBroadCast } from '../../src/helpers/SwapHelper';
import { Currency } from '../../src';
import { AMMRouteSegment } from '../../src/utils/ammRouteResolver';
import { configs } from '../../src/config';

const validDeployer = configs.CONTRACT_DEPLOYER;
export const DUMMY_DEPLOYER = 'SP111111111111111111111111111111111111111';

export const dummyFee = BigInt(777);

export const dummyTokenA = 'TokenA' as Currency;
export const dummyTokenB = 'TokenB' as Currency;
export const dummyTokenC = 'TokenC' as Currency;

export const dummyFactorA = BigInt(670000000);
export const dummyFactorB = BigInt(680000000);
export const dummyAmmRoute: AMMRouteSegment[] = [
  {
    neighbour: dummyTokenC,
    pool: {
      tokenX: dummyTokenA,
      tokenY: dummyTokenC,
      factor: dummyFactorA,
    },
  },
  {
    neighbour: dummyTokenB,
    pool: {
      tokenX: dummyTokenC,
      tokenY: dummyTokenB,
      factor: dummyFactorB,
    },
  },
];

export const dummyRate = BigInt(1001);

export const dummyTx: TxToBroadCast = {
  contractName: 'amm-pool-v2-01',
  functionName: 'swap-helper',
  functionArgs: [],
  contractAddress: validDeployer,
  postConditions: [],
};

export const dummyPrices: PriceData[] = [
  {
    token: dummyTokenA,
    price: 1.1,
  },
  {
    token: dummyTokenB,
    price: 2.2,
  },
];
export const parsedDummyPrices = {
  TokenA: 1.1,
  TokenB: 2.2,
};

export const dummyBalances = {
  TokenA: BigInt(86794603901),
  TokenB: BigInt(86794603902),
};

export const dummyCurrencies: TokenInfo[] = [
  {
    id: dummyTokenA,
    name: 'TKA',
    icon: '',
    wrapTokenDecimals: 8,
    wrapToken: `${validDeployer}.token-a::tka`,
    underlyingToken: `${validDeployer}.token-a::tka`,
    underlyingTokenDecimals: 6,
    isRebaseToken: true,
  },
  {
    id: dummyTokenB,
    name: 'TKB',
    icon: '',
    wrapTokenDecimals: 8,
    wrapToken: `${validDeployer}.token-b::tkb`,
    underlyingToken: `${validDeployer}.token-b::tkb`,
    underlyingTokenDecimals: 6,
    isRebaseToken: false,
  },
  {
    id: dummyTokenC,
    name: 'TKC',
    icon: '',
    wrapTokenDecimals: 8,
    wrapToken: `${validDeployer}.token-c::tkc`,
    underlyingToken: `${validDeployer}.token-c::tkc`,
    underlyingTokenDecimals: 6,
    isRebaseToken: false,
  },
];

export const dummyPools: PoolData[] = [
  {
    tokenX: dummyTokenA,
    tokenY: dummyTokenC,
    factor: BigInt(5000000),
  },
  {
    tokenX: dummyTokenC,
    tokenY: dummyTokenB,
    factor: BigInt(5000000),
  },
];

export const dummyAlexSDKData: AlexSDKResponse = {
  tokens: dummyCurrencies,
  pools: [],
};
