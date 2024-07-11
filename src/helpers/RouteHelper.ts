import { Currency } from '../currency';
import { PoolData } from '../types';
import { AMMRouteSegment, resolveAmmRoute } from '../utils/ammRouteResolver';

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
