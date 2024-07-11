import { AlexSDK, Currency } from '../src';
import * as FeeHelper from '../src/helpers/FeeHelper';
import * as RouteHelper from '../src/helpers/RouteHelper';
import * as RateHelper from '../src/helpers/RateHelper';
import * as SwapHelper from '../src/helpers/SwapHelper';
import * as fetchData from '../src/utils/fetchData';
import * as ammRouteResolver from '../src/utils/ammRouteResolver';
import { configs } from '../src/config';
import {
  dummyAlexSDKData, dummyAmmRoute,
  dummyBalances,
  dummyCurrencies,
  dummyFee,
  dummyPrices,
  dummyRate,
  dummyRoute,
  dummyTx,
  parsedDummyPrices,
  dummyTokenA,
  dummyTokenB, dummyFactorA, dummyFactorB,
} from './mock-data/alexSDKMockResponses';
import { cvToValue, FungibleConditionCode } from '@stacks/transactions';

const sdk = new AlexSDK();

const tokenAlex = 'age000-governance-token' as Currency;
const tokenWUSDA = 'token-wusda' as Currency;

// Mocked helpers and utilities for testing SDK functions
jest.mock('../src/helpers/FeeHelper', () => ({
  getLiquidityProviderFee: jest.fn(async () => dummyFee),
}));
jest.mock('../src/helpers/RouteHelper', () => ({
  getRoute: jest.fn(async () => dummyRoute),
}));
jest.mock('../src/helpers/RateHelper', () => ({
  getYAmountFromXAmount: jest.fn(async () => dummyRate),
}));
jest.mock('../src/helpers/SwapHelper', () => {
  const originalModule = jest.requireActual('../src/helpers/SwapHelper');
  return {
    runSpot: jest.fn(async (deployer, ...args) =>
    {
      if (deployer !== configs.CONTRACT_DEPLOYER) {
        return dummyTx;
      }
      return await originalModule.runSpot(deployer, ...args);
    }),
  }
});
jest.mock('../src/utils/fetchData', () => {
  const originalModule = jest.requireActual('../src/utils/fetchData');
  return {
    __esModule: true,
    ...originalModule,
    getPrices: jest.fn(async () => dummyPrices),
    fetchBalanceForAccount: jest.fn(async () => dummyBalances),
    getAlexSDKData: jest.fn(async () => dummyAlexSDKData)
  }
});
jest.mock('../src/utils/ammRouteResolver', () => ({
  resolveAmmRoute: jest.fn(() => dummyAmmRoute),
}));

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
      'SP111111111111111111111111111111111111111',
      tokenAlex,
      tokenWUSDA,
      BigInt(1),
      BigInt(0)
    );
    expect(result).toStrictEqual(dummyTx);
  });

  it('Verify response value of runSwap function (tx construct + rebase)', async () => {
    expect(jest.isMockFunction(SwapHelper.runSpot)).toBeTruthy();
    expect(jest.isMockFunction(ammRouteResolver.resolveAmmRoute)).toBeTruthy();
    const amount = BigInt(2) * BigInt(1e8);
    const result = await sdk.runSwap(
      configs.CONTRACT_DEPLOYER,
      dummyTokenA,
      dummyTokenB,
      amount,
      BigInt(0)
    );
    expect(cvToValue(result.functionArgs[3])).toStrictEqual(dummyFactorA);
    expect(cvToValue(result.functionArgs[4])).toStrictEqual(dummyFactorB);
    expect(cvToValue(result.functionArgs[5])).toStrictEqual(amount);
    expect(result.postConditions[0].conditionCode).toStrictEqual(FungibleConditionCode.GreaterEqual);
    expect(result.postConditions[0].amount).toStrictEqual(BigInt(0));
  });

  it('Verify response value of getLatestPrices function', async () => {
    expect(jest.isMockFunction(fetchData.getPrices)).toBeTruthy();
    const result = await sdk.getLatestPrices();
    expect(result).toStrictEqual(parsedDummyPrices);
  });

  it('Verify response value of getBalances function', async () => {
    expect(jest.isMockFunction(fetchData.fetchBalanceForAccount)).toBeTruthy();
    const stxAddress = 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT';
    const result = await sdk.getBalances(stxAddress);
    expect(result).toStrictEqual(dummyBalances);
  });

  it('Verify response value of fetchSwappableCurrency function', async () => {
    expect(jest.isMockFunction(fetchData.getAlexSDKData)).toBeTruthy();
    const result = await sdk.fetchSwappableCurrency();
    expect(result).toStrictEqual(dummyCurrencies);
  });
});

