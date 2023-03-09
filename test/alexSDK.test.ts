import { AlexSDK, Currency } from '../src';

describe('AlexSDK', () => {
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
});
