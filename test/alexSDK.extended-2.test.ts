import { AlexSDK, Currency } from '../src';
import fetchMock from 'fetch-mock';
import { configs } from '../src/config';

const sdk = new AlexSDK();

const tokenAlex = 'age000-governance-token' as Currency;
const tokenWUSDA = 'token-wusda' as Currency;

describe('AlexSDK - extended tests 2', () => {
  it('Attempt to Get Fee with incorrect Alex SDK Data', async () => {
    fetchMock.mock('https://alex-sdk-api.alexlab.co', 500);
    await expect(sdk.getFeeRate(tokenAlex, Currency.STX)).rejects.toThrow('Failed to fetch token mappings');
  },10000);

  it('Attempt to Get Router with incorrect Alex SDK Data', async () => {
    await expect(sdk.getRouter(tokenAlex, Currency.STX)).rejects.toThrow('Failed to fetch token mappings');
  },10000);

  it('Attempt to Get Amount with incorrect Alex SDK Data', async () => {
    await expect(sdk.getAmountTo(
      Currency.STX,
      BigInt(2) * BigInt(1e8),
      tokenWUSDA
    )).rejects.toThrow('Failed to fetch token mappings'); 
  },10000);

  it('Attempt to Run Swap with incorrect Alex SDK Data', async () => {
    await expect(sdk.runSwap(
      configs.CONTRACT_DEPLOYER,
      tokenAlex,
      tokenWUSDA,
      BigInt(2) * BigInt(1e8),
      BigInt(0)
    )).rejects.toThrow('Failed to fetch token mappings');   
  },10000);

  it('Attempt to Get Latest Prices with incorrect Alex SDK Data', async () => {
    await expect(sdk.getLatestPrices()).rejects.toThrow('Failed to fetch token mappings');
  },10000);

  it('Attempt to Get Balances with incorrect Alex SDK Data', async () => {
    const stxAddress = 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT';
    await expect(sdk.getBalances(stxAddress)).rejects.toThrow('Failed to fetch token mappings');
  },10000);

  it('Attempt to Fetch Swappable Currency with incorrect Alex SDK Data', async () => {
    await expect(sdk.fetchSwappableCurrency()).rejects.toThrow('Failed to fetch token mappings');
  },10000);
});

