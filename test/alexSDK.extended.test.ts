import { AlexSDK, Currency } from '../src';
import * as FeeHelper from '../src/helpers/FeeHelper';
import * as RouteHelper from '../src/helpers/RouteHelper';
import * as RateHelper from '../src/helpers/RateHelper';
import { configs } from '../src/config';

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

  // it('Verify response value of runSwap function', async () => {
  //   const result = await sdk.runSwap(
  //     configs.CONTRACT_DEPLOYER,
  //     tokenAlex,
  //     tokenWUSDA,
  //     BigInt(2) * BigInt(1e8),
  //     BigInt(0)
  //   );
  //   console.log(result)
  // });
});

