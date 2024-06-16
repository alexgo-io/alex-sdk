import { Currency } from '../currency';
import { PoolData } from '../types';
import { resolveAmmRoute } from '../utils/ammRouteResolver';

export async function getRoute(
  from: Currency,
  to: Currency,
  pools: PoolData[]
): Promise<Currency[]> {
  const ammRoute = resolveAmmRoute(from, to, pools);
  if (ammRoute.length > 0) {
    return [from, ...ammRoute.map((a) => a.neighbour)];
  }
  throw new Error("Can't find route");
}
