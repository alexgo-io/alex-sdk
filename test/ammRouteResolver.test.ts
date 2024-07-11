import {
  AMMRouteSegment,
  resolveAmmRoute,
} from '../src/utils/ammRouteResolver';
import { PoolData } from '../src/types';
import { Currency } from '../src';

namespace TestCurrency {
  export const W_USDA = 'token-wusda' as Currency;
  export const W_XUSD = 'token-wxusd' as Currency;
  export const W_STX = 'token-wstx' as Currency;
  export const W_BANANA = 'token-wban' as Currency;
  export const W_XBTC = 'token-wbtc' as Currency;
  export const BRC20_DB20 = 'brc20-db20' as Currency;
}

const TestPool = {
  AMM_SWAP_POOL_WXUSD_WUSDA: toPoolData('token-wxusd,token-wusda,0.0001e8'),
  AMM_SWAP_POOL_ALEX_WBAN: toPoolData('age000-governance-token,token-wban,1e8'),
  AMM_SWAP_POOL_WSTX_ALEX: toPoolData('token-wstx,age000-governance-token,1e8'),
  AMM_SWAP_POOL_WSTX_XBTC: toPoolData('token-wstx,token-wbtc,1e8'),
  AMM_SWAP_POOL_ALEX_WUSDA: toPoolData(
    'age000-governance-token,token-wusda,1e8'
  ),
  AMM_SWAP_POOL_V1_1_WSTX_XBTC: toPoolData('token-wstx,token-wbtc,1e8'),
  AMM_SWAP_POOL_V1_1_WSTX_ABTC: toPoolData('token-wstx,token-abtc,1e8'),
  AMM_SWAP_POOL_V1_1_ABTC_WBTC: toPoolData('token-abtc,token-wbtc,0.05e8'),
  AMM_SWAP_POOL_V1_1_ABTC_BRC20DB20: toPoolData('token-abtc,brc20-db20,1e8'),
};

describe('resolveAmmRoute', function () {
  it('should match if there is an exact match', function () {
    expect(
      resolveAmmRoute(TestCurrency.W_USDA, TestCurrency.W_XUSD, [
        TestPool.AMM_SWAP_POOL_WXUSD_WUSDA,
      ])
    ).toEqual<AMMRouteSegment[]>([
      {
        pool: TestPool.AMM_SWAP_POOL_WXUSD_WUSDA,
        neighbour: TestCurrency.W_XUSD,
      },
    ]);
    expect(
      resolveAmmRoute(TestCurrency.W_XUSD, TestCurrency.W_USDA, [
        TestPool.AMM_SWAP_POOL_WXUSD_WUSDA,
      ]).map((a) => a.pool)
    ).toEqual([TestPool.AMM_SWAP_POOL_WXUSD_WUSDA]);
  });

  it('should match with l2', function () {
    expect(
      resolveAmmRoute(TestCurrency.W_STX, TestCurrency.W_BANANA, [
        TestPool.AMM_SWAP_POOL_ALEX_WBAN,
        TestPool.AMM_SWAP_POOL_WXUSD_WUSDA,
        TestPool.AMM_SWAP_POOL_WSTX_ALEX,
      ]).map((a) => a.pool)
    ).toEqual([
      TestPool.AMM_SWAP_POOL_WSTX_ALEX,
      TestPool.AMM_SWAP_POOL_ALEX_WBAN,
    ]);
    expect(
      resolveAmmRoute(TestCurrency.W_BANANA, TestCurrency.W_STX, [
        TestPool.AMM_SWAP_POOL_ALEX_WBAN,
        TestPool.AMM_SWAP_POOL_WXUSD_WUSDA,
        TestPool.AMM_SWAP_POOL_WSTX_ALEX,
      ]).map((a) => a.pool)
    ).toEqual([
      TestPool.AMM_SWAP_POOL_ALEX_WBAN,
      TestPool.AMM_SWAP_POOL_WSTX_ALEX,
    ]);
  });

  it('should match with l3', function () {
    expect(
      resolveAmmRoute(TestCurrency.W_XBTC, TestCurrency.W_BANANA, [
        TestPool.AMM_SWAP_POOL_WXUSD_WUSDA,
        TestPool.AMM_SWAP_POOL_WSTX_ALEX,
        TestPool.AMM_SWAP_POOL_WSTX_XBTC,
        TestPool.AMM_SWAP_POOL_ALEX_WBAN,
        TestPool.AMM_SWAP_POOL_ALEX_WUSDA,
      ]).map((a) => a.pool)
    ).toEqual([
      TestPool.AMM_SWAP_POOL_WSTX_XBTC,
      TestPool.AMM_SWAP_POOL_WSTX_ALEX,
      TestPool.AMM_SWAP_POOL_ALEX_WBAN,
    ]);
  });

  it('should find the shortest path', function () {
    expect(
      resolveAmmRoute(TestCurrency.W_STX, TestCurrency.BRC20_DB20, [
        TestPool.AMM_SWAP_POOL_V1_1_WSTX_XBTC,
        TestPool.AMM_SWAP_POOL_V1_1_WSTX_ABTC,
        TestPool.AMM_SWAP_POOL_V1_1_ABTC_WBTC,
        TestPool.AMM_SWAP_POOL_V1_1_ABTC_BRC20DB20,
      ]).map((a) => a.pool)
    ).toEqual([
      TestPool.AMM_SWAP_POOL_V1_1_WSTX_ABTC,
      TestPool.AMM_SWAP_POOL_V1_1_ABTC_BRC20DB20,
    ]);
  });
});

function toPoolData(pool: string): PoolData {
  const [tokenX, tokenY, factor] = pool.split(',');
  return {
    tokenX: tokenX as Currency,
    tokenY: tokenY as Currency,
    factor: BigInt(Number(factor) * 1e8),
  };
}
