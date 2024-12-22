import type { Currency } from '../currency';
import type { PoolData } from '../types';
import {
  type AMMRouteSegment,
  resolveAmmRoute,
} from '../utils/ammRouteResolver';

export async function getAllPossibleRoute(
  from: Currency,
  to: Currency,
  pools: PoolData[]
): Promise<AMMRouteSegment[][]> {
  return [resolveAmmRoute(from, to, pools)];
}
