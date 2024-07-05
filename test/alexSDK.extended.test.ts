import { AlexSDK, Currency } from '../src';
import * as FeeHelper from '../src/helpers/FeeHelper';
import * as RouteHelper from '../src/helpers/RouteHelper';
import * as RateHelper from '../src/helpers/RateHelper';
import * as SwapHelper from '../src/helpers/SwapHelper';
import * as fetchData from '../src/utils/fetchData';
import { configs } from '../src/config';
import { PriceData } from '../src/types';

const sdk = new AlexSDK();

const tokenAlex = 'age000-governance-token' as Currency;
const tokenWUSDA = 'token-wusda' as Currency;

const dummyFee = BigInt(777);
jest.mock('../src/helpers/FeeHelper', () => ({
  getLiquidityProviderFee: jest.fn(async () => dummyFee),
}));
const dummyRoute = ['TokenA', 'TokenB', 'TokenC'];
jest.mock('../src/helpers/RouteHelper', () => ({
  getRoute: jest.fn(async () => dummyRoute),
}));
const dummyRate = BigInt(1001);
jest.mock('../src/helpers/RateHelper', () => ({
  getYAmountFromXAmount: jest.fn(async () => dummyRate),
}));
const dummyTx: SwapHelper.TxToBroadCast = {
  "contractName": "amm-pool-v2-01",
  "functionName": "swap-helper",
  "functionArgs": [],
  "contractAddress": "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM",
  "postConditions": []
};
jest.mock('../src/helpers/SwapHelper', () => ({
  runSpot: jest.fn(async () => dummyTx),
}));
const dummyPrices: PriceData[] = [
  {
    "token": "TokenA" as Currency,
    "price": 1.1,
  },
  {
    "token": "TokenB" as Currency,
    "price": 2.2,
  }
];
jest.mock('../src/utils/fetchData', () => {
  const originalModule = jest.requireActual('../src/utils/fetchData');
  return {
    __esModule: true,
    ...originalModule,
    getPrices: jest.fn(async () => dummyPrices),
  }
});

describe('AlexSDK - extended tests', () => {
  it('Verify response value of getFeeRate function', async () => {
    expect(jest.isMockFunction(FeeHelper.getLiquidityProviderFee)).toBeTruthy();
    const result = await sdk.getFeeRate(tokenAlex, Currency.STX);
    expect(result).toStrictEqual(dummyFee);
  });

  it('Verify response value of getRouter function', async () => {
    expect(jest.isMockFunction(RouteHelper.getRoute)).toBeTruthy();
    const result = await sdk.getRouter(Currency.STX, tokenWUSDA);
    expect(result).toStrictEqual(dummyRoute);
  });

  it('Verify response value of getAmountTo function', async () => {
    expect(jest.isMockFunction(RateHelper.getYAmountFromXAmount)).toBeTruthy();
    const result = await sdk.getAmountTo(
      Currency.STX,
      BigInt(2) * BigInt(1e8),
      tokenWUSDA
    );
    expect(result).toStrictEqual(dummyRate);
  });

  it('Verify response value of runSwap function', async () => {
    expect(jest.isMockFunction(SwapHelper.runSpot)).toBeTruthy();
    const result = await sdk.runSwap(
      configs.CONTRACT_DEPLOYER,
      tokenAlex,
      tokenWUSDA,
      BigInt(2) * BigInt(1e8),
      BigInt(0)
    );
    expect(result).toStrictEqual(dummyTx);
  });

  it('Verify response value of getLatestPrices function', async () => {
    expect(jest.isMockFunction(fetchData.getPrices)).toBeTruthy();
    const result = await sdk.getLatestPrices();
    const parsedDummyPrices = {
      "TokenA": 1.1,
      "TokenB": 2.2
    };
    expect(result).toStrictEqual(parsedDummyPrices);
  });
});

