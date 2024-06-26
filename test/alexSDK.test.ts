import { configs } from '../src/config';
import { AlexSDK, Currency } from '../src';

const tokenAlex = 'age000-governance-token' as Currency;
const tokenDiko = 'token-wdiko' as Currency;

describe('AlexSDK', () => {
  it('Get Fee Rate', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getFeeRate(tokenAlex, Currency.STX);
    console.log(result);
  });
  it('Get Route', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getRouter(Currency.STX, tokenDiko);
    console.log(result);
  });
  it('Get Rate', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getAmountTo(
      Currency.STX,
      BigInt(2) * BigInt(1e8),
      tokenDiko
    );
    console.log(result);
  });
  it('Get Tx', async () => {
    const sdk = new AlexSDK();
    const router = await sdk.getRouter(Currency.STX, tokenDiko);
    const result = await sdk.runSwap(
      configs.CONTRACT_DEPLOYER,
      Currency.STX,
      tokenDiko,
      BigInt(2) * BigInt(1e8),
      BigInt(0)
    );
    console.log(result);
  });
});
