import type { Currency } from '../currency';
import type { PoolData } from '../types';
import {
  type AMMRouteSegment,
  resolveAmmRoutes,
} from '../utils/ammRouteResolver';

export async function getAllPossibleRoute(
  from: Currency,
  to: Currency,
  pools: PoolData[]
): Promise<AMMRouteSegment[][]> {
  return resolveAmmRoutes(from, to, pools);
}
