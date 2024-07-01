import { configs } from '../src/config';
import { AlexSDK, Currency } from '../src';

const tokenAlex = 'age000-governance-token' as Currency;
const tokenDiko = 'token-wdiko' as Currency;
const sdk = new AlexSDK();

describe('AlexSDK', () => {
  it('Get fee', async () => {
    const result = await sdk.getFeeRate(tokenAlex, Currency.STX);
    expect(typeof result).toBe('bigint');
    expect(result >= BigInt(0)).toBeTruthy();
    // console.log(result);
  });
  it('Get Route', async () => {
    const result = await sdk.getRouter(Currency.STX, tokenDiko);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBe(Currency.STX);
    expect(result[result.length - 1]).toBe(tokenDiko);
    expect(result.length).toBeLessThanOrEqual(5);
    result.forEach(currency => {
      expect(typeof currency).toBe('string');
    });
    // console.log(result);
  });
  it('Get Rate', async () => {
    const result = await sdk.getAmountTo(
      Currency.STX,
      BigInt(2) * BigInt(1e8),
      tokenDiko
    );
    expect(typeof result).toBe('bigint'); 
    expect(result > BigInt(0)).toBeTruthy(); 
    // console.log(result);
  });
  it('Get Tx', async () => {
    const router = await sdk.getRouter(Currency.STX, tokenDiko);
    const result = await sdk.runSwap(
      configs.CONTRACT_DEPLOYER,
      Currency.STX,
      tokenDiko,
      BigInt(2) * BigInt(1e8),
      BigInt(0)
    );

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('contractAddress');
    expect(result).toHaveProperty('contractName');
    expect(result).toHaveProperty('functionName');
    expect(result).toHaveProperty('functionArgs');
    expect(result).toHaveProperty('postConditions');
    expect(result.contractAddress).toBe(configs.CONTRACT_DEPLOYER);
    expect(result.contractName).toBe('amm-pool-v2-01');
    expect(['swap-helper', 'swap-helper-a', 'swap-helper-b', 'swap-helper-c']).toContain(result.functionName);
    expect(Array.isArray(result.functionArgs)).toBeTruthy();
    expect(Array.isArray(result.postConditions)).toBeTruthy();
    // console.log(result);
  });
});

