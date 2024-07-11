import { isNotNull } from './utils';
import { Currency } from '../currency';
import { PoolData } from '../types';

export type AMMRouteSegment = {
  neighbour: Currency;
  pool: PoolData;
};

export type AMMRoute = AMMRouteSegment[];

function neighbours(token: Currency, pools: PoolData[]): AMMRouteSegment[] {
  return pools
    .map((pool) => {
      if (pool.tokenX === token) return { neighbour: pool.tokenY, pool };
      if (pool.tokenY === token) return { neighbour: pool.tokenX, pool };
      return null;
    })
    .filter(isNotNull);
}

export function resolveAmmRoute(
  tokenX: Currency,
  tokenY: Currency,
  pools: PoolData[]
): AMMRouteSegment[] {
  if (pools.length === 0) {
    return [];
  }
  const visited: { [key: string]: AMMRouteSegment[] } = {
    [tokenX]: [],
  };
  // contract only support up to 4 segments
  for (let i = 0; i < 4; i++) {
    const visitedNodes = Object.keys(visited).map((a) => a as Currency);
    for (const a of visitedNodes) {
      for (const b of neighbours(a, pools)) {
        if (b.neighbour === tokenY) {
          return [...(visited[a] ?? []), b];
        }
        if (visited[b.neighbour] == null) {
          visited[b.neighbour] = [...(visited[a] ?? []), b];
        }
      }
    }
  }
  return [];
}
