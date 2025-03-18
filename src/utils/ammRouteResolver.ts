import { isNotNull } from './utils';
import type { Currency } from '../currency';
import type { PoolData } from '../types';

export type AMMRouteSegment = {
  from: Currency;
  neighbour: Currency;
  pool: PoolData;
};

export type AMMRoute = AMMRouteSegment[];

function neighbours(token: Currency, pools: PoolData[]): AMMRouteSegment[] {
  return pools
    .map((pool) => {
      if (pool.tokenX === token)
        return { from: pool.tokenX, neighbour: pool.tokenY, pool };
      if (pool.tokenY === token)
        return { from: pool.tokenY, neighbour: pool.tokenX, pool };
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

export function resolveAmmRoutes(
  tokenX: Currency,
  tokenY: Currency,
  pools: PoolData[]
): AMMRouteSegment[][] {
  if (pools.length === 0) {
    return [];
  }

  const allRoutes: AMMRouteSegment[][] = [];

  function findRoutes(
    currentToken: Currency,
    targetToken: Currency,
    currentPath: AMMRouteSegment[],
    depth: number
  ): void {
    // Contract only supports up to 4 segments
    if (depth > 4) return;

    const neighborSegments = neighbours(currentToken, pools);
    for (const segment of neighborSegments) {
      // Avoid cycles by checking if we've already visited this token
      if (
        currentPath.some(
          (route) =>
            route.from === segment.neighbour ||
            route.neighbour === segment.neighbour
        )
      ) {
        continue;
      }

      const newPath = [...currentPath, segment];
      if (segment.neighbour === targetToken) {
        allRoutes.push(newPath);
      } else {
        findRoutes(segment.neighbour, targetToken, newPath, depth + 1);
      }
    }
  }

  findRoutes(tokenX, tokenY, [], 0);
  return allRoutes.sort((a, b) => a.length - b.length);
}
