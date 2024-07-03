import { AlexSDK, Currency, TokenInfo } from '../src';
import * as FeeHelper from '../src/helpers/FeeHelper';

const sdk = new AlexSDK();

const tokenAlex = 'age000-governance-token' as Currency;

jest.mock('../src/helpers/FeeHelper', () => ({
  getLiquidityProviderFee: jest.fn(async () => BigInt(777)),
}));

describe('AlexSDK - extended tests', () => {
  it('Verify response value of getFeeRate function', async () => {
    expect(jest.isMockFunction(FeeHelper.getLiquidityProviderFee)).toBeTruthy();
    const result = await sdk.getFeeRate(tokenAlex, Currency.STX);
    expect(result).toBe(BigInt(777));
  });
});

