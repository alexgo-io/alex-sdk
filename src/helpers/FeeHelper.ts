import { AlexSDKError, AlexErrorType } from '../errors'
import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import type { Currency } from '../currency';
import type { PoolData } from '../types';
import {
  type AMMRouteSegment,
  resolveAmmRoute,
} from '../utils/ammRouteResolver';
import { hasLength } from '../utils/arrayHelper';

export async function getLiquidityProviderFee(
  tokenX: Currency,
  tokenY: Currency,
  pools: PoolData[],
  getContractId: (currency: Currency) => string,
  customRoute?: AMMRouteSegment[]
): Promise<bigint> {
  const ammRoute = customRoute ?? resolveAmmRoute(tokenX, tokenY, pools);
  if (ammRoute.length === 0) {
    throw new AlexSDKError(AlexErrorType.RouteNotFound, 'Route Not Found', 404, 'No AMM pools in route');
  }
  if (hasLength(ammRoute, 1)) {
    const [segment] = ammRoute;
    return await readonlyCall('amm-pool-v2-01', 'fee-helper', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(tokenY),
      factor: segment.pool.factor,
    }).then(unwrapResponse);
  }
  if (hasLength(ammRoute, 2)) {
    const [segment1, segment2] = ammRoute;
    return await readonlyCall('amm-pool-v2-01', 'fee-helper-a', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(segment1.neighbour),
      'token-z': getContractId(segment2.neighbour),
      'factor-x': segment1.pool.factor,
      'factor-y': segment2.pool.factor,
    }).then(unwrapResponse);
  }
  if (hasLength(ammRoute, 3)) {
    const [segment1, segment2, segment3] = ammRoute;
    return await readonlyCall('amm-pool-v2-01', 'fee-helper-b', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(segment1.neighbour),
      'token-z': getContractId(segment2.neighbour),
      'token-w': getContractId(segment3.neighbour),
      'factor-x': segment1.pool.factor,
      'factor-y': segment2.pool.factor,
      'factor-z': segment3.pool.factor,
    }).then(unwrapResponse);
  }
  if (hasLength(ammRoute, 4)) {
    const [segment1, segment2, segment3, segment4] = ammRoute;
    return await readonlyCall('amm-pool-v2-01', 'fee-helper-c', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(segment1.neighbour),
      'token-z': getContractId(segment2.neighbour),
      'token-w': getContractId(segment3.neighbour),
      'token-v': getContractId(segment4.neighbour),
      'factor-x': segment1.pool.factor,
      'factor-y': segment2.pool.factor,
      'factor-z': segment3.pool.factor,
      'factor-w': segment4.pool.factor,
    }).then(unwrapResponse);
  }
  throw new AlexSDKError(AlexErrorType.TooManyPools, 'Route Too Complex', 422, 'Too many AMM pools in route: maximum supported is 4');
}
