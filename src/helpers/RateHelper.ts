import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import type { Currency } from '../currency';
import type { PoolData } from '../types';
import {
  type AMMRouteSegment,
  resolveAmmRoute,
} from '../utils/ammRouteResolver';
import { hasLength } from '../utils/arrayHelper';

export const getYAmountFromXAmount = async (
  tokenX: Currency,
  tokenY: Currency,
  fromAmount: bigint,
  ammPools: PoolData[],
  getContractId: (currency: Currency) => string,
  customRoute?: AMMRouteSegment[]
): Promise<bigint> => {
  const ammRoute = customRoute ?? resolveAmmRoute(tokenX, tokenY, ammPools);
  if (ammRoute.length === 0) {
    throw new Error('No AMM pool found for the given route');
  }
  if (hasLength(ammRoute, 1)) {
    const [segment] = ammRoute;
    return await readonlyCall('alex-amm-pool-v2-01-get-helper', 'get-helper-with-fee', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(segment.neighbour),
      dx: fromAmount,
      factor: segment.pool.factor,
    }).then(unwrapResponse);
  }
  if (hasLength(ammRoute, 2)) {
    const [segment1, segment2] = ammRoute;
    return await readonlyCall('alex-amm-pool-v2-01-get-helper', 'get-helper-with-fee-a', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(segment1.neighbour),
      'token-z': getContractId(segment2.neighbour),
      'factor-x': segment1.pool.factor,
      'factor-y': segment2.pool.factor,
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (hasLength(ammRoute, 3)) {
    const [segment1, segment2, segment3] = ammRoute;
    return await readonlyCall('alex-amm-pool-v2-01-get-helper', 'get-helper-with-fee-b', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(segment1.neighbour),
      'token-z': getContractId(segment2.neighbour),
      'token-w': getContractId(segment3.neighbour),
      'factor-x': segment1.pool.factor,
      'factor-y': segment2.pool.factor,
      'factor-z': segment3.pool.factor,
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (hasLength(ammRoute, 4)) {
    const [segment1, segment2, segment3, segment4] = ammRoute;
    return await readonlyCall('alex-amm-pool-v2-01-get-helper', 'get-helper-with-fee-c', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(segment1.neighbour),
      'token-z': getContractId(segment2.neighbour),
      'token-w': getContractId(segment3.neighbour),
      'token-v': getContractId(segment4.neighbour),
      'factor-x': segment1.pool.factor,
      'factor-y': segment2.pool.factor,
      'factor-z': segment3.pool.factor,
      'factor-w': segment4.pool.factor,
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  throw new Error('Too many AMM pools in route');
};
