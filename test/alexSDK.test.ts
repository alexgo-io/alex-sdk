import { configs } from '../src/config';
import { AlexSDK, Currency, STXCurrency } from '../src';

const tokenAlex = 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex' as Currency;
const tokenDiko = 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wdiko' as Currency

describe('AlexSDK', () => {
  it('Get fee', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getFeeRate(tokenAlex, STXCurrency);
    console.log(result);
  });
  it('Get Route', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getRouter(STXCurrency, tokenDiko);
    console.log(result);
  });
  it('Get Rate', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getAmountTo(
      STXCurrency,
      BigInt(2) * BigInt(1e8),
      tokenDiko
    );
    console.log(result);
  });
  it('Get Tx', async () => {
    const sdk = new AlexSDK();
    const router = await sdk.getRouter(STXCurrency, tokenDiko);
    const result = await sdk.runSwap(
      configs.CONTRACT_DEPLOYER,
      STXCurrency,
      tokenDiko,
      BigInt(2) * BigInt(1e8),
      BigInt(0),
    );
    console.log(result);
  });
});
