import type { Currency } from '../currency';
import type {
  PoolData,
  DetailedAMMRoutes,
  StacksAssetContractAddress,
} from '../types';
import {
  type AMMRouteSegment,
  resolveAmmRoutes,
} from '../utils/ammRouteResolver';
import { deserializeAssetIdentifier } from '../types';
import { announceAtLeastOne, hasLength } from '../utils/arrayHelper';
import type { TokenInfo } from '../types';
import { getYAmountFromXAmount } from './RateHelper';

export async function getAllPossibleRoute(
  from: Currency,
  to: Currency,
  pools: PoolData[]
): Promise<AMMRouteSegment[][]> {
  return resolveAmmRoutes(from, to, pools);
}

export async function getDetailedRoute(
  context: {
    ammPools: PoolData[];
    tokenInfoMappings: Record<Currency, TokenInfo>;
    getContractId: (currency: Currency) => string;
  },
  route: AMMRouteSegment[],
  fromAmount: bigint
): Promise<undefined | DetailedAMMRoutes> {
  const detailRoute = await Promise.all(
    route.map(
      async (
        segment
      ): Promise<
        | undefined
        | (DetailedAMMRoutes['swapPools'][number] & {
            fromCurrency: Currency;
            fromTokenAddress: StacksAssetContractAddress;
          })
      > => {
        const fromTokenInfo = context.tokenInfoMappings[segment.from];
        const toTokenInfo = context.tokenInfoMappings[segment.neighbour];
        if (fromTokenInfo == null || toTokenInfo == null) {
          return undefined;
        }

        const fromTokenAddress = deserializeAssetIdentifier(
          fromTokenInfo.wrapToken
        );
        const toTokenAddress = deserializeAssetIdentifier(
          toTokenInfo.wrapToken
        );
        if (fromTokenAddress == null || toTokenAddress == null) {
          return undefined;
        }

        return {
          fromCurrency: segment.from,
          fromTokenAddress,
          toCurrency: segment.neighbour,
          toTokenAddress,
          poolId: segment.pool.poolId,
          pool: segment.pool,
        };
      }
    )
  );

  if (detailRoute.some((x) => x == null)) return undefined;
  const _detailRoute = detailRoute as NonNullable<
    (typeof detailRoute)[number]
  >[];

  if (hasLength(_detailRoute, 0)) return undefined;

  const firstSegment = _detailRoute[0];
  const lastSegment = _detailRoute[_detailRoute.length - 1];

  const toAmount =
    fromAmount === BigInt(0)
      ? BigInt(0)
      : await getYAmountFromXAmount(
          firstSegment.fromCurrency,
          lastSegment.toCurrency,
          fromAmount,
          context.ammPools,
          context.getContractId,
          route
        ).catch(() => BigInt(0));

  return {
    fromCurrency: firstSegment.fromCurrency,
    fromTokenAddress: firstSegment.fromTokenAddress,
    swapPools: announceAtLeastOne(
      _detailRoute.map((segment) => ({
        toCurrency: segment.toCurrency,
        toTokenAddress: segment.toTokenAddress,
        poolId: segment.poolId,
        pool: segment.pool,
      }))
    ),
    fromAmount,
    toAmount,
  };
}
