import { configs } from '../src/config';
import { AlexSDK, Currency } from '../src';
import Ajv from 'ajv';
import { createGenerator } from 'ts-json-schema-generator';
import path from 'node:path';
import { getAlexSDKData, getPrices } from '../src/utils/fetchData';

const runtimeTypescriptMatcher = (received: any, typeName: string) => {
  const validator = new Ajv().compile(
    createGenerator({
      type: typeName,
      path: path.resolve(__dirname, '../src/types.ts'),
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    }).createSchema(typeName)
  );
  const pass = validator(received);
  return {
    pass,
    message: () =>
      `expected ${received} does not match type ${typeName}: \n${JSON.stringify(
        validator.errors,
        null,
        2
      )}`,
  };
};

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchType(typeName: string): R;
    }
  }
}

expect.extend({ toMatchType: runtimeTypescriptMatcher });

const tokenAlex = 'age000-governance-token' as Currency;
const tokenDiko = 'token-wdiko' as Currency;
const wrongTokenAlex = '' as Currency;

const sdk = new AlexSDK();

describe('AlexSDK', () => {
  it('Verify response of getFeeRate function', async () => {
    const result = await sdk.getFeeRate(tokenAlex, Currency.STX);
    expect(typeof result).toBe('bigint');
    expect(result >= BigInt(0)).toBeTruthy();
  });

  it('Attempt to Get Fee Rate with wrong tokens', async () => {
    await expect(
      sdk.getFeeRate(wrongTokenAlex, wrongTokenAlex)
    ).rejects.toThrow('No AMM pools in route');
  });

  it('Verify response of getRoute function', async () => {
    const result = await sdk.getRoute(Currency.STX, tokenDiko);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].pool.tokenX).toBe(Currency.STX);
    expect(result[result.length - 1].pool.tokenY).toBe(tokenDiko);
    expect(result.length).toBeLessThanOrEqual(5);
    expect(typeof result[0].pool.tokenX).toBe('string');
    result.forEach((routeSegment) => {
      expect(typeof routeSegment.pool.tokenY).toBe('string');
    });
  });

  it('Attempt to Get Route with wrong tokens', async () => {
    await expect(sdk.getRoute(wrongTokenAlex, wrongTokenAlex)).rejects.toThrow(
      "Can't find route"
    );
  });

  it('Verify response of getAmountTo function', async () => {
    const result = await sdk.getAmountTo(
      Currency.STX,
      BigInt(2) * BigInt(1e8),
      tokenDiko
    );
    expect(typeof result).toBe('bigint');
    expect(result > BigInt(0)).toBeTruthy();
  });

  it('Attempt to Get Rate with a wrong From token', async () => {
    await expect(
      sdk.getAmountTo(wrongTokenAlex, BigInt(2) * BigInt(1e8), tokenDiko)
    ).rejects.toThrow('No AMM pool found for the given route');
  });

  it('Attempt to Get Rate with negative From amount', async () => {
    await expect(
      sdk.getAmountTo(Currency.STX, BigInt(-111), tokenDiko)
    ).rejects.toThrow(
      'Cannot construct unsigned clarity integer from negative value'
    );
  });

  it('Attempt to Get Rate with an overflowing From amount (parseReadOnlyResponse)', async () => {
    await expect(
      sdk.getAmountTo(Currency.STX, BigInt(999999223372036854775807), tokenDiko)
    ).rejects.toThrow('ArithmeticOverflow');
  });

  it('Attempt to Get Rate with an overflowing From amount (decoders)', async () => {
    await expect(
      sdk.getAmountTo(Currency.STX, BigInt(99999223372036854775807), tokenDiko)
    ).rejects.toThrow('ClarityError: 2011');
  });

  it('Verify response of runSwap function', async () => {
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
    expect([
      'swap-helper',
      'swap-helper-a',
      'swap-helper-b',
      'swap-helper-c',
    ]).toContain(result.functionName);
    expect(Array.isArray(result.functionArgs)).toBeTruthy();
    expect(Array.isArray(result.postConditions)).toBeTruthy();
  });

  it('Attempt to Get Tx with an invalid stx address (checksum mismatch)', async () => {
    await expect(
      sdk.runSwap(
        'SP25DP4A9EXT42KC40QDMYQPMQCT1P0R5234GWEGS',
        Currency.STX,
        tokenDiko,
        BigInt(100),
        BigInt(0)
      )
    ).rejects.toThrow('Invalid c32check string: checksum mismatch');
  });

  it('Verify response of getLatestPrices function', async () => {
    const result = await sdk.getLatestPrices();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    Object.values(result).forEach((value) => {
      expect(typeof value).toBe('number');
      expect(isNaN(Number(value))).toBe(false);
    });
  });

  it('Verify response of getBalances function', async () => {
    const stxAddress = 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT';
    const balances = await sdk.getBalances(stxAddress);
    expect(balances).toBeDefined();
    expect(typeof balances).toBe('object');
    Object.keys(balances).forEach((currency) => {
      expect(typeof balances[currency as Currency]).toBe('bigint');
    });
  });

  it('getAlexSDKData response', async () => {
    const response = await getAlexSDKData();
    expect(response).toMatchType('AlexSDKResponse');
  });

  it('getPrices response', async () => {
    const sdk = new AlexSDK();
    const tokens = await sdk.fetchSwappableCurrency();
    expect(await getPrices(tokens)).toMatchType('BackendAPIPriceResponse');
  });
});
