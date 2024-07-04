import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import { Currency } from '../currency';
import { PoolData } from '../types';
import { AMMRouteSegment, resolveAmmRoute } from '../utils/ammRouteResolver';

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
  if (ammRoute.length === 1) {
    return await readonlyCall('amm-pool-v2-01', 'get-helper', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(ammRoute[0]!.neighbour),
      dx: fromAmount,
      factor: ammRoute[0]!.pool.factor,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 2) {
    return await readonlyCall('amm-pool-v2-01', 'get-helper-a', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(ammRoute[0]!.neighbour),
      'token-z': getContractId(ammRoute[1]!.neighbour),
      'factor-x': ammRoute[0]!.pool.factor,
      'factor-y': ammRoute[1]!.pool.factor,
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 3) {
    return await readonlyCall('amm-pool-v2-01', 'get-helper-b', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(ammRoute[0]!.neighbour),
      'token-z': getContractId(ammRoute[1]!.neighbour),
      'token-w': getContractId(ammRoute[2]!.neighbour),
      'factor-x': ammRoute[0]!.pool.factor,
      'factor-y': ammRoute[1]!.pool.factor,
      'factor-z': ammRoute[2]!.pool.factor,
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 4) {
    return await readonlyCall('amm-pool-v2-01', 'get-helper-c', {
      'token-x': getContractId(tokenX),
      'token-y': getContractId(ammRoute[0]!.neighbour),
      'token-z': getContractId(ammRoute[1]!.neighbour),
      'token-w': getContractId(ammRoute[2]!.neighbour),
      'token-v': getContractId(ammRoute[3]!.neighbour),
      'factor-x': ammRoute[0]!.pool.factor,
      'factor-y': ammRoute[1]!.pool.factor,
      'factor-z': ammRoute[2]!.pool.factor,
      'factor-w': ammRoute[3]!.pool.factor,
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  throw new Error('Too many AMM pools in route');
};
