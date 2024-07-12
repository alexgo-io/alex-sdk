import { AlexSDK, Currency, TokenInfo } from '../src';
import fetchMock from 'fetch-mock';
import { configs } from '../src/config';
import { fetchBalanceForAccount, getPrices } from '../src/utils/fetchData';
import { transferFactory } from '../src/utils/postConditions';

const sdk = new AlexSDK();

const tokenAlex = 'age000-governance-token' as Currency;
const tokenWUSDA = 'token-wusda' as Currency;

const tokenMappings: TokenInfo[] = [
  {
    id: 'token-x' as Currency,
    name: 'Token x',
    icon: 'icon-x',
    wrapToken: 'wrap-token-x',
    wrapTokenDecimals: 8,
    underlyingToken: 'underlying-token-x',
    underlyingTokenDecimals: 8,
    isRebaseToken: false,
  },
];

const stxAddress = 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT';

describe('AlexSDK - mock externals', () => {
  beforeEach(() => {
    fetchMock.get('https://alex-sdk-api.alexlab.co', 500);
  });
  afterEach(() => {
    fetchMock.restore();
  });

  it('Attempt to Get Latest Prices with incorrect Alex SDK Data', async () => {
    await expect(sdk.getLatestPrices()).rejects.toThrow(
      'Failed to fetch token mappings',
    );
  }, 10000);
  it('Attempt to Get Fee with incorrect Alex SDK Data', async () => {
    await expect(sdk.getFeeRate(tokenAlex, Currency.STX)).rejects.toThrow(
      'Failed to fetch token mappings',
    );
  }, 10000);

  it('Attempt to Get Router with incorrect Alex SDK Data', async () => {
    await expect(sdk.getRouter(tokenAlex, Currency.STX)).rejects.toThrow(
      'Failed to fetch token mappings',
    );
  }, 10000);

  it('Attempt to Get Amount with incorrect Alex SDK Data', async () => {
    await expect(
      sdk.getAmountTo(Currency.STX, BigInt(2) * BigInt(1e8), tokenWUSDA),
    ).rejects.toThrow('Failed to fetch token mappings');
  }, 10000);

  it('Attempt to Run Swap with incorrect Alex SDK Data', async () => {
    await expect(
      sdk.runSwap(
        configs.CONTRACT_DEPLOYER,
        tokenAlex,
        tokenWUSDA,
        BigInt(2) * BigInt(1e8),
        BigInt(0),
      ),
    ).rejects.toThrow('Failed to fetch token mappings');
  }, 10000);

  it('Attempt to Get Latest Prices with incorrect Alex SDK Data', async () => {
    await expect(sdk.getLatestPrices()).rejects.toThrow(
      'Failed to fetch token mappings',
    );
  }, 10000);

  it('Attempt to Get Balances with incorrect Alex SDK Data', async () => {
    const stxAddress = 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT';
    await expect(sdk.getBalances(stxAddress)).rejects.toThrow(
      'Failed to fetch token mappings',
    );
  }, 10000);

  it('Attempt to Fetch Swappable Currency with incorrect Alex SDK Data', async () => {
    await expect(sdk.fetchSwappableCurrency()).rejects.toThrow(
      'Failed to fetch token mappings',
    );
  }, 10000);
});

describe('AlexSDK - mock externals - API_HOST', () => {
  beforeEach(() => {
    fetchMock.get(`${configs.API_HOST}/v2/public/token-prices`, {
      status: 500,
      body: 'Internal Server Error',
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('Attempt to get token prices with incorrect data', async () => {
    await expect(getPrices(tokenMappings)).rejects.toThrow('Failed to fetch token mappings');
    expect(fetchMock.calls(`${configs.API_HOST}/v2/public/token-prices`).length).toBe(1);
  }, 10000);
});

describe('Transfer Factory', () => {
  it('Throws error in Transfer Factory', () => {
    const transfer = transferFactory(tokenMappings);
    expect(() => transfer(stxAddress, tokenAlex, BigInt(1000))).toThrow('Token mapping not found');
  });
});

describe('AlexSDK - mock externals - STACKS_API_HOST', () => {
  beforeEach(() => {
    fetchMock.get(`${configs.STACKS_API_HOST}/extended/v1/address/${stxAddress}/balances`, {
      status: 500,
      body: 'Internal Server Error',
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('Attempt to Get Balances with incorrect data', async () => {
    await expect(fetchBalanceForAccount(stxAddress, tokenMappings)).rejects.
            toThrow(new
            SyntaxError('Unexpected token \'I\', "Internal S"... is not valid JSON'));
  }, 10000);
});
