import { isNotNull } from './utils';
import { AMMSwapPool } from './ammPool';

export type AMMSwapRoute = {
  neighbour: AMMSwapPool.SwapTokens;
  pool: AMMSwapPool.PoolTokens;
};

function neighbours(
  token: AMMSwapPool.SwapTokens,
  pools: AMMSwapPool.PoolTokens[]
): AMMSwapRoute[] {
  return pools
    .map((pool) => {
      const [x, y] = AMMSwapPool.breakDown(pool);
      if (x === token) return { neighbour: y, pool };
      if (y === token) return { neighbour: x, pool };
      return null;
    })
    .filter(isNotNull);
}

export function resolveAmmRoute(
  tokenX: AMMSwapPool.SwapTokens,
  tokenY: AMMSwapPool.SwapTokens,
  pools: AMMSwapPool.PoolTokens[]
): AMMSwapRoute[] {
  if (pools.length === 0) {
    return [];
  }
  const visited: { [key in AMMSwapPool.SwapTokens]?: AMMSwapRoute[] } = {
    [tokenX]: [],
  };
  // contract only support up to 4 segments
  for (let i = 0; i < 4; i++) {
    const visitedNodes = Object.keys(visited).map(
      (a) => a as AMMSwapPool.SwapTokens
    );
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
