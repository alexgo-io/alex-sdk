import { AlexSDK, Currency } from '../src';
import { CONTRACT_DEPLOYER } from '../src/config';

describe.skip('AlexSDK', () => {
  it('Get fee', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getFee(Currency.ALEX, Currency.STX);
    console.log(result);
  });
  it('Get Route', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getRouter(Currency.STX, Currency.DIKO);
    console.log(result);
  });
  it('Get Rate', async () => {
    const sdk = new AlexSDK();
    const result = await sdk.getRate(
      Currency.STX,
      BigInt(2) * BigInt(1e8),
      Currency.DIKO
    );
    console.log(result);
  });
  it('Get Tx', async () => {
    const sdk = new AlexSDK();
    const router = await sdk.getRouter(Currency.STX, Currency.DIKO);
    const result = await sdk.runSwap(
      CONTRACT_DEPLOYER,
      Currency.STX,
      Currency.DIKO,
      BigInt(2) * BigInt(1e8),
      BigInt(0),
      router
    );
    console.log(result);
  });
});
