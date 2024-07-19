import { AlexSDK, Currency } from '../src';
import * as ammRouteResolver from '../src/utils/ammRouteResolver';
import { assertNever } from '../src/utils/utils';
import { configs } from '../src/config';

const sdk = new AlexSDK();

const tokenAlex = 'age000-governance-token' as Currency;
const tokenWUSDA = 'token-wusda' as Currency;

const dummyRoute = ['TokenA', 'TokenB', 'TokenC', 'TokenD', 'TokenE', 'TokenF'];
jest.mock('../src/utils/ammRouteResolver', () => ({
  resolveAmmRoute: jest.fn(async () => dummyRoute),
}));

describe('AlexSDK - mock exceptions', () => {
  it('Attempt to Get Fee Rate with more than 4 pools in route', async () => {
    expect(jest.isMockFunction(ammRouteResolver.resolveAmmRoute)).toBeTruthy();
    await expect(sdk.getFeeRate(tokenAlex, Currency.STX)).rejects.toThrow(
      'Too many AMM pools in route'
    );
  }, 10000);

  it('Attempt to getAmountTo with more than 4 pools in route', async () => {
    await expect(
      sdk.getAmountTo(Currency.STX, BigInt(2) * BigInt(1e8), tokenWUSDA)
    ).rejects.toThrow('Too many AMM pools in route');
  }, 10000);

  it('Attempt to run swap with more than 4 pools in route', async () => {
    await expect(
      sdk.runSwap(
        configs.CONTRACT_DEPLOYER,
        tokenAlex,
        tokenWUSDA,
        BigInt(2) * BigInt(1e8),
        BigInt(0)
      )
    ).rejects.toThrow('Too many AMM pools in route');
  }, 10000);

  it('Attempt assertNever to throw unexpected object', () => {
    const unexpectedObject = '' as never;
    expect(() => assertNever(unexpectedObject)).toThrowError(
      'Unexpected object: ' + unexpectedObject
    );
  });
});
