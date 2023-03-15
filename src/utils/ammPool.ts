import { AMMSwapRoute, resolveAmmRoute } from './ammRouteResolver';
import { bridgeHelperResolver } from './bridgeHelperResolver';
import { assertNever } from './utils';
import { Currency } from '../currency';

export namespace AMMSwapPool {
  export enum Pool {
    // AMM_SWAP_POOL
    AMM_SWAP_POOL_WXUSD_WUSDA = 'token-amm-swap-pool:token-wxusd,token-wusda,0.0001e8',
    AMM_SWAP_POOL_WXUSD_WUSDA_2 = 'token-amm-swap-pool:token-wxusd,token-wusda,0.005e8',
    // not yet available
    // AMM_SWAP_POOL_WSTX_ALEX = 'token-amm-swap-pool:token-wstx,age000-governance-token,1e8',
    // AMM_SWAP_POOL_WSTX_XBTC = 'token-amm-swap-pool:token-wstx,token-wbtc,1e8',
    // AMM_SWAP_POOL_ALEX_WBAN = 'token-amm-swap-pool:age000-governance-token,token-wban,1e8',
    // AMM_SWAP_POOL_ALEX_WUSDA = 'token-amm-swap-pool:age000-governance-token,token-wusda,1e8',
    AMM_SWAP_POOL_ALEX_WDIKO = 'token-amm-swap-pool:age000-governance-token,token-wdiko,1e8',
    AMM_SWAP_POOL_WSTX_WCORGI = 'token-amm-swap-pool:token-wstx,token-wcorgi,1e8',
  }

  export type SwapTokens = Currency;

  export const getRoute = (
    tokenX: Currency,
    tokenY: Currency,
    ammPools: PoolTokens[]
  ): AMMSwapRoute[] =>
    resolveAmmRoute(
      tokenX,
      tokenY,
      // AMM_SWAP_POOL_WXUSD_WUSDA is deprecated now, don't use it if we have AMM_SWAP_POOL_WXUSD_WUSDA_2 is available
      ammPools.includes(Pool.AMM_SWAP_POOL_WXUSD_WUSDA_2)
        ? ammPools.filter((a) => a !== Pool.AMM_SWAP_POOL_WXUSD_WUSDA)
        : ammPools
    );

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  export const reachableInAMM: typeof bridgeHelperResolver = (...args) =>
    bridgeHelperResolver(...args);

  export const ammTokens = [
    Pool.AMM_SWAP_POOL_WXUSD_WUSDA,
    Pool.AMM_SWAP_POOL_WXUSD_WUSDA_2,
    Pool.AMM_SWAP_POOL_ALEX_WDIKO,
    Pool.AMM_SWAP_POOL_WSTX_WCORGI,
  ];

  export type PoolTokens = (typeof ammTokens)[number];
  export const isPoolToken = (token: string): token is PoolTokens =>
    ammTokens.includes(token as PoolTokens);

  export const fromXY = (
    x: Currency,
    y: Currency,
    factor: number
  ): PoolTokens => {
    if (x === Currency.XUSD && y === Currency.USDA && factor === 0.0001e8) {
      return Pool.AMM_SWAP_POOL_WXUSD_WUSDA;
    }
    throw new Error(`Invalid AMM token: ${x} ${y}`);
  };

  export function breakDown(
    poolToken: AMMSwapPool.PoolTokens
  ): [Currency.STX | Currency.ALEX | Currency.XUSD, AMMSwapPool.SwapTokens] {
    switch (poolToken) {
      case Pool.AMM_SWAP_POOL_WXUSD_WUSDA:
      case Pool.AMM_SWAP_POOL_WXUSD_WUSDA_2:
        return [Currency.XUSD, Currency.USDA];
      // case Pool.AMM_SWAP_POOL_WSTX_ALEX:
      //   return [Currency.STX, Currency.ALEX];
      // case Pool.AMM_SWAP_POOL_WSTX_XBTC:
      //   return [Currency.STX, Currency.XBTC];
      // case Pool.AMM_SWAP_POOL_ALEX_WBAN:
      //   return [Currency.ALEX, Currency.BANANA];
      // case Pool.AMM_SWAP_POOL_ALEX_WUSDA:
      //   return [Currency.ALEX, Currency.USDA];
      case Pool.AMM_SWAP_POOL_ALEX_WDIKO:
        return [Currency.ALEX, Currency.DIKO];
      case Pool.AMM_SWAP_POOL_WSTX_WCORGI:
        return [Currency.STX, Currency.CORGI];
      default:
        assertNever(poolToken);
    }
  }

  export function getFactor(poolToken: PoolTokens): bigint {
    switch (poolToken) {
      case Pool.AMM_SWAP_POOL_WXUSD_WUSDA:
        return BigInt(0.0001e8);
      case Pool.AMM_SWAP_POOL_WXUSD_WUSDA_2:
        return BigInt(0.005e8);
      // case Pool.AMM_SWAP_POOL_WSTX_ALEX:
      // case Pool.AMM_SWAP_POOL_WSTX_XBTC:
      // case Pool.AMM_SWAP_POOL_ALEX_WBAN:
      // case Pool.AMM_SWAP_POOL_ALEX_WUSDA:
      case Pool.AMM_SWAP_POOL_ALEX_WDIKO:
      case Pool.AMM_SWAP_POOL_WSTX_WCORGI:
        return BigInt(1e8);
      default:
        assertNever(poolToken);
    }
  }
}
