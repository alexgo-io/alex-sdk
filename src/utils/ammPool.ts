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
    AMM_SWAP_POOL_WSTX_SUSDT = 'token-amm-swap-pool:token-wstx,token-susdt,1e8',

    AMM_SWAP_POOL_V1_1_WSTX_XBTC = 'token-amm-swap-pool-v1-1:token-wstx,token-wbtc,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_SUSDT = 'token-amm-swap-pool-v1-1:token-wstx,token-susdt,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_ALEX = 'token-amm-swap-pool-v1-1:token-wstx,age000-governance-token,1e8',
    AMM_SWAP_POOL_V1_1_ALEX_DIKO = 'token-amm-swap-pool-v1-1:age000-governance-token,token-wdiko,1e8',
    AMM_SWAP_POOL_V1_1_ALEX_ATALEXV2 = 'token-amm-swap-pool-v1-1:age000-governance-token,auto-alex-v2,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WVIBES = 'token-amm-swap-pool-v1-1:token-wstx,token-wvibes,1e8',
    AMM_SWAP_POOL_V1_1_ALEX_BRC20DB20 = 'token-amm-swap-pool-v1-1:age000-governance-token,brc20-db20,1e8',
    AMM_SWAP_POOL_V1_1_SUSDT_XUSD = 'token-amm-swap-pool-v1-1:token-susdt,token-wxusd,0.05e8',
    AMM_SWAP_POOL_V1_1_WSTX_LUNAR = 'token-amm-swap-pool-v1-1:token-wstx,token-slunr,1e8',
    AMM_SWAP_POOL_V1_1_SUSDT_CHAX = 'token-amm-swap-pool-v1-1:token-susdt,brc20-chax,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_ABTC = 'token-amm-swap-pool-v1-1:token-wstx,token-abtc,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WLEO = 'token-amm-swap-pool-v1-1:token-wstx,token-wleo,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WMEGA = 'token-amm-swap-pool-v1-1:token-wstx,token-wmega-v2,1e8',
    AMM_SWAP_POOL_V1_1_ABTC_BRC20ORDG = 'token-amm-swap-pool-v1-1:token-abtc,brc20-ordg,1e8',
    AMM_SWAP_POOL_V1_1_ABTC_BRC20ORMM = 'token-amm-swap-pool-v1-1:token-abtc,brc20-ormm,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WGUS = 'token-amm-swap-pool-v1-1:token-wstx,token-wgues,1e8',
    AMM_SWAP_POOL_V1_1_ABTC_BRC20ORNJ = 'token-amm-swap-pool-v1-1:token-abtc,brc20-ornj,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WLONG = 'token-amm-swap-pool-v1-1:token-wstx,token-wlong,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WWNOTHING = 'token-amm-swap-pool-v1-1:token-wstx,token-wnthng,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WAEWBTC = 'token-amm-swap-pool-v1-1:token-wstx,token-waewbtc,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WLQSTX = 'token-amm-swap-pool-v1-1:token-wstx,token-wlqstx,0.05e8',
    AMM_SWAP_POOL_V1_1_WSTX_WMAX = 'token-amm-swap-pool-v1-1:token-wstx,token-wmax,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WPLAY = 'token-amm-swap-pool-v1-1:token-wstx,token-wplay,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WAEUSDC = 'token-amm-swap-pool-v1-1:token-wstx,token-waeusdc,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WPEPE = 'token-amm-swap-pool-v1-1:token-wstx,token-wpepe,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WMICK = 'token-amm-swap-pool-v1-1:token-wstx,token-wmick,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WNOPE = 'token-amm-swap-pool-v1-1:token-wstx,token-wnope,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WFAST = 'token-amm-swap-pool-v1-1:token-wstx,token-wfast,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WFRODO = 'token-amm-swap-pool-v1-1:token-wstx,token-wfrodo,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_WPICSUM = 'token-amm-swap-pool-v1-1:token-wstx,token-wpicsum,1e8',
    AMM_SWAP_POOL_V1_1_ABTC_WBTC = 'token-amm-swap-pool-v1-1:token-abtc,token-wbtc,0.05e8',
    AMM_SWAP_POOL_V1_1_WSTX_WWIF = 'token-amm-swap-pool-v1-1:token-wstx,token-wwif,1e8',
    AMM_SWAP_POOL_V1_1_WSTX_STX20STXS = 'token-amm-swap-pool-v1-1:token-wstx,stx20-stxs,1e8',
    AMM_SWAP_POOL_V1_1_ABTC_BRC20DB20 = 'token-amm-swap-pool-v1-1:token-abtc,brc20-db20,1e8',
    AMM_SWAP_POOL_V1_1_ABTC_SSKO = 'token-amm-swap-pool-v1-1:token-abtc,token-ssko,1e8',
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
    Pool.AMM_SWAP_POOL_WSTX_SUSDT,
  ];

  export const ammV1_1Tokens = [
    Pool.AMM_SWAP_POOL_V1_1_WSTX_SUSDT,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_XBTC,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_ALEX,
    Pool.AMM_SWAP_POOL_V1_1_ALEX_DIKO,
    Pool.AMM_SWAP_POOL_V1_1_ALEX_ATALEXV2,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WVIBES,
    Pool.AMM_SWAP_POOL_V1_1_ALEX_BRC20DB20,
    Pool.AMM_SWAP_POOL_V1_1_SUSDT_XUSD,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_LUNAR,
    Pool.AMM_SWAP_POOL_V1_1_SUSDT_CHAX,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_ABTC,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WLEO,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WMEGA,
    Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORDG,
    Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORMM,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WGUS,
    Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORNJ,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WLONG,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WWNOTHING,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WAEWBTC,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WLQSTX,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WPLAY,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WMAX,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WAEUSDC,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WPEPE,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WMICK,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WNOPE,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WFAST,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WFRODO,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WPICSUM,
    Pool.AMM_SWAP_POOL_V1_1_ABTC_WBTC,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_WWIF,
    Pool.AMM_SWAP_POOL_V1_1_WSTX_STX20STXS,
    Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20DB20,
    Pool.AMM_SWAP_POOL_V1_1_ABTC_SSKO,
  ];

  export type PoolTokens = Pool;

  export const isPoolV1Token = (token: string): token is PoolTokens =>
    ammTokens.includes(token as any);

  export const isPoolV1_1Token = (token: string): token is PoolTokens =>
    ammV1_1Tokens.includes(token as any);

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
  ): [
    (
      | Currency.STX
      | Currency.ALEX
      | Currency.XUSD
      | Currency.sUSDT
      | Currency.aBTC
    ),
    AMMSwapPool.SwapTokens
  ] {
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
      case Pool.AMM_SWAP_POOL_WSTX_SUSDT:
        return [Currency.STX, Currency.sUSDT];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_XBTC:
        return [Currency.STX, Currency.XBTC];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_ALEX:
        return [Currency.STX, Currency.ALEX];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_SUSDT:
        return [Currency.STX, Currency.sUSDT];
      case Pool.AMM_SWAP_POOL_V1_1_ALEX_DIKO:
        return [Currency.ALEX, Currency.DIKO];
      case Pool.AMM_SWAP_POOL_V1_1_ALEX_ATALEXV2:
        return [Currency.ALEX, Currency.ATALEXV2];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WVIBES:
        return [Currency.STX, Currency.VIBES];
      case Pool.AMM_SWAP_POOL_V1_1_ALEX_BRC20DB20:
        return [Currency.ALEX, Currency.BRC20_DB20];
      case Pool.AMM_SWAP_POOL_V1_1_SUSDT_XUSD:
        return [Currency.sUSDT, Currency.XUSD];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_LUNAR:
        return [Currency.STX, Currency.sLUNR];
      case Pool.AMM_SWAP_POOL_V1_1_SUSDT_CHAX:
        return [Currency.sUSDT, Currency.BRC20_CHAX];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_ABTC:
        return [Currency.STX, Currency.aBTC];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WLEO:
        return [Currency.STX, Currency.LEO];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WMEGA:
        return [Currency.STX, Currency.MEGA];
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORDG:
        return [Currency.aBTC, Currency.BRC20_ORDG];
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORMM:
        return [Currency.aBTC, Currency.BRC20_ORMM];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WGUS:
        return [Currency.STX, Currency.GUS];
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORNJ:
        return [Currency.aBTC, Currency.BRC20_ORNJ];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WLONG:
        return [Currency.STX, Currency.LONG];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WWNOTHING:
        return [Currency.STX, Currency.WNOTHING];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WAEWBTC:
        return [Currency.STX, Currency.AEWBTC];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WLQSTX:
        return [Currency.STX, Currency.LQSTX];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WPLAY:
        return [Currency.STX, Currency.PLAY];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WMAX:
        return [Currency.STX, Currency.MAX];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WAEUSDC:
        return [Currency.STX, Currency.AEUSDC];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WPEPE:
        return [Currency.STX, Currency.PEPE];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WMICK:
        return [Currency.STX, Currency.MICK];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WNOPE:
        return [Currency.STX, Currency.NOPE];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WFAST:
        return [Currency.STX, Currency.FAST];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WFRODO:
        return [Currency.STX, Currency.FRODO];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WPICSUM:
        return [Currency.STX, Currency.PICSUM];
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_WBTC:
        return [Currency.aBTC, Currency.XBTC];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WWIF:
        return [Currency.STX, Currency.WIF];
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_STX20STXS:
        return [Currency.STX, Currency.STX20_STXS];
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20DB20:
        return [Currency.aBTC, Currency.BRC20_DB20];
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_SSKO:
        return [Currency.aBTC, Currency.sSKO];
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
      case Pool.AMM_SWAP_POOL_WSTX_SUSDT:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_XBTC:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_ALEX:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_SUSDT:
      case Pool.AMM_SWAP_POOL_V1_1_ALEX_DIKO:
      case Pool.AMM_SWAP_POOL_V1_1_ALEX_ATALEXV2:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WVIBES:
      case Pool.AMM_SWAP_POOL_V1_1_ALEX_BRC20DB20:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_LUNAR:
      case Pool.AMM_SWAP_POOL_V1_1_SUSDT_CHAX:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_ABTC:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WLEO:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WMEGA:
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORDG:
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORMM:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WGUS:
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20ORNJ:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WLONG:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WWNOTHING:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WAEWBTC:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WPLAY:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WMAX:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WAEUSDC:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WPEPE:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WMICK:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WNOPE:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WFAST:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WFRODO:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WPICSUM:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WWIF:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_STX20STXS:
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_BRC20DB20:
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_SSKO:
        return BigInt(1e8);
      case Pool.AMM_SWAP_POOL_V1_1_SUSDT_XUSD:
      case Pool.AMM_SWAP_POOL_V1_1_WSTX_WLQSTX:
      case Pool.AMM_SWAP_POOL_V1_1_ABTC_WBTC:
        return BigInt(0.05e8);
      default:
        assertNever(poolToken);
    }
  }
}
