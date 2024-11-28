import type { Currency } from '../currency';
import type { PoolData } from '../types';
import { type AMMRouteSegment, resolveAmmRoute } from '../utils/ammRouteResolver';

export async function getAllPossibleRoute(
  from: Currency,
  to: Currency,
  pools: PoolData[]
): Promise<AMMRouteSegment[][]> {
  const ammRoute = resolveAmmRoute(from, to, pools);
  if (ammRoute.length > 0) {
    // TODO: add all possible routes later
    return [ammRoute];
  }
  throw new Error("Can't find route");
}
