import { configs } from '../src/config';
import { AlexSDK, Currency } from '../src';
import Ajv from 'ajv';
import { createGenerator } from 'ts-json-schema-generator';
import path from 'node:path';
import { getAlexSDKData, getPrices } from '../src/utils/fetchData';
import { TxToBroadCast } from '../src/helpers/SwapHelper';

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

const checkSwapResult = (result: TxToBroadCast) => {
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
};

expect.extend({ toMatchType: runtimeTypescriptMatcher });

const tokenAlex = 'age000-governance-token' as Currency;
const tokenDiko = 'token-wdiko' as Currency;
const tokenWmick = 'token-wmick' as Currency;
const tokenSSL = 'token-ssl-all-AESDE' as Currency;
const tokenBRC20ORMM = 'brc20-ormm' as Currency;
const wrongTokenAlex = '' as Currency;

const routeLength1 = { from: tokenAlex, to: Currency.STX };
const routeLength2 = { from: tokenWmick, to: tokenDiko };
const routeLength3 = { from: tokenSSL, to: tokenDiko };
const routeLength4 = { from: tokenWmick, to: tokenBRC20ORMM };
const alternativeRoutes = [routeLength2, routeLength3, routeLength4];

const sdk = new AlexSDK();
const CLARITY_MAX_UNSIGNED_INT = BigInt(
  '340282366920938463463374607431768211455'
);

describe('AlexSDK', () => {
  it('Verify response of getFeeRate function (custom route)', async () => {
    const customRoute = await sdk.getRoute(routeLength1.from, routeLength1.to);
    const result = await sdk.getFeeRate(
      routeLength1.from,
      routeLength1.to,
      customRoute
    );
    expect(typeof result).toBe('bigint');
    expect(result >= BigInt(0)).toBeTruthy();
  }, 10000);

  it('Verify response of getFeeRate function (alternative routes)', async () => {
    for (const route of alternativeRoutes) {
      const result = await sdk.getFeeRate(route.from, route.to);
      expect(typeof result).toBe('bigint');
      expect(result >= BigInt(0)).toBeTruthy();
    }
  }, 40000);

  it('Attempt to Get Fee Rate with wrong tokens', async () => {
    await expect(
      sdk.getFeeRate(wrongTokenAlex, wrongTokenAlex)
    ).rejects.toThrow('No AMM pools in route');
  }, 10000);

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
  }, 10000);

  it('Attempt to Get Route with wrong tokens', async () => {
    await expect(sdk.getRoute(wrongTokenAlex, wrongTokenAlex)).rejects.toThrow(
      "Can't find route"
    );
  }, 10000);

  it('Verify response of Get Rate function (custom route)', async () => {
    const customRoute = await sdk.getRoute(routeLength1.from, routeLength1.to);
    const result = await sdk.getAmountTo(
      routeLength1.from,
      BigInt(10000000) * BigInt(1e8),
      routeLength1.to,
      customRoute
    );
    expect(typeof result).toBe('bigint');
    expect(result > BigInt(0)).toBeTruthy();
  }, 10000);

  it('Verify response of Get Rate function (alternative routes)', async () => {
    for (const route of alternativeRoutes) {
      const result = await sdk.getAmountTo(
        route.from,
        BigInt(10000000) * BigInt(1e8),
        route.to
      );
      expect(typeof result).toBe('bigint');
      expect(result > BigInt(0)).toBeTruthy();
    }
  }, 40000);

  it('Attempt to Get Rate with a wrong From token', async () => {
    await expect(
      sdk.getAmountTo(wrongTokenAlex, BigInt(2) * BigInt(1e8), tokenDiko)
    ).rejects.toThrow('No AMM pool found for the given route');
  }, 10000);

  it('Attempt to Get Rate with negative From amount', async () => {
    await expect(
      sdk.getAmountTo(Currency.STX, BigInt(-111), tokenDiko)
    ).rejects.toThrow(
      'Cannot construct unsigned clarity integer from negative value'
    );
  }, 10000);

  it('Attempt to Get Rate with an overflowing From amount (parseReadOnlyResponse)', async () => {
    await expect(
      sdk.getAmountTo(Currency.STX, BigInt(999999223372036854775807), tokenDiko)
    ).rejects.toThrow('ArithmeticOverflow');
  }, 10000);

  it('Attempt to Get Rate with an overflowing From amount (decoders)', async () => {
    await expect(
      sdk.getAmountTo(Currency.STX, BigInt(99999223372036854775807), tokenDiko)
    ).rejects.toThrow('ClarityError: 2011');
  }, 10000);

  it('Verify response of runSwap function (custom route)', async () => {
    const customRoute = await sdk.getRoute(routeLength1.from, routeLength1.to);
    const result = await sdk.runSwap(
      configs.CONTRACT_DEPLOYER,
      routeLength1.from,
      routeLength1.to,
      BigInt(2) * BigInt(1e8),
      BigInt(0),
      customRoute
    );
    checkSwapResult(result);
  }, 10000);

  it('Verify response of runSwap function (alternative routes)', async () => {
    for (const route of alternativeRoutes) {
      const result = await sdk.runSwap(
        configs.CONTRACT_DEPLOYER,
        route.from,
        route.to,
        BigInt(2) * BigInt(1e8),
        BigInt(0)
      );
      checkSwapResult(result);
    }
  }, 40000);

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
  }, 10000);

  it('Attempt to run swap with wrong token', async () => {
    await expect(
      sdk.runSwap(
        'SP25DP4A9EXT42KC40QDMYQPMQCT1P0R5234GWEGS',
        Currency.STX,
        wrongTokenAlex,
        BigInt(100),
        BigInt(0)
      )
    ).rejects.toThrow("Can't find AMM route");
  }, 10000);

  it('Attempt to runSwap with an invalid minDy value', async () => {
    const wrongValue = CLARITY_MAX_UNSIGNED_INT + BigInt(1);
    await expect(
      sdk.runSwap(
        configs.CONTRACT_DEPLOYER,
        Currency.STX,
        tokenDiko,
        BigInt(0),
        wrongValue
      )
    ).rejects.toThrow(
      `Cannot construct unsigned clarity integer greater than ${CLARITY_MAX_UNSIGNED_INT}`
    );
  }, 10000);

  it('Verify response of getLatestPrices function', async () => {
    const result = await sdk.getLatestPrices();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    Object.values(result).forEach((value) => {
      expect(typeof value).toBe('number');
      expect(isNaN(Number(value))).toBe(false);
    });
  }, 10000);

  it('Verify response of getBalances function', async () => {
    const stxAddress = 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT';
    const balances = await sdk.getBalances(stxAddress);
    expect(balances).toBeDefined();
    expect(typeof balances).toBe('object');
    Object.keys(balances).forEach((currency) => {
      if (Object.values(Currency).includes(currency as Currency)) {
        expect(typeof balances[currency as Currency]).toBe('bigint');
      }
    });
  }, 10000);

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

  it('Attempt to get balances with invalid address', async () => {
    // TODO: Implement principal address verification in the SDK methods.
    const wrongAddress = 'ABC';
    await expect(sdk.getBalances(wrongAddress)).rejects.toThrow(
      "Cannot read properties of undefined (reading 'balance')"
    );
  }, 10000);

  it('getAlexSDKData response', async () => {
    const response = await getAlexSDKData();
    expect(response).toMatchType('AlexSDKResponse');
  });

  it('getPrices response', async () => {
    const sdk = new AlexSDK();
    const tokens = await sdk.fetchSwappableCurrency();
    expect(await getPrices(tokens)).toMatchType('BackendAPIPriceResponse');
  });

  it('Verify response of getWayPoints function', async () => {
    const route = await sdk.getRoute(tokenAlex, Currency.STX);
    const result = await sdk.getWayPoints(route);
    expect(result[0].id).toBe(tokenAlex);
    expect(result[1].id).toBe(Currency.STX);
    result.forEach((token) => {
      expect(typeof token.name).toBe('string');
      expect(typeof token.icon).toBe('string');
      expect(typeof token.wrapToken).toBe('string');
      expect(typeof token.underlyingToken).toBe('string');
      expect(typeof token.underlyingTokenDecimals).toBe('number');
      expect(token.wrapTokenDecimals).toBe(8);
      expect(token.isRebaseToken).toBe(false);
    });
  }, 10000);
});
