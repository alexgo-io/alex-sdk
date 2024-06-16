import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import { Currency } from '../currency';
import { AlexSDK } from '../alexSDK';
import { PoolData, TokenMapping } from '../types';
import { resolveAmmRoute } from '../utils/ammRouteResolver';

export async function getLiquidityProviderFee(
  tokenX: Currency,
  tokenY: Currency,
  pools: PoolData[]
): Promise<bigint> {
  const ammRoute = resolveAmmRoute(tokenX, tokenY, pools);
  if (ammRoute.length === 0) {
    throw new Error('No AMM pools in route');
  }
  if (ammRoute.length === 1) {
    return await readonlyCall('amm-pool-v2-01', 'fee-helper', {
      'token-x': tokenX,
      'token-y': tokenY,
      factor: ammRoute[0]!.pool.factor,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 2) {
    return await readonlyCall('amm-pool-v2-01', 'fee-helper-a', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'factor-x': ammRoute[0]!.pool.factor,
      'factor-y': ammRoute[1]!.pool.factor,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 3) {
    return await readonlyCall('amm-pool-v2-01', 'fee-helper-b', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'token-w': ammRoute[2]!.neighbour,
      'factor-x': ammRoute[0]!.pool.factor,
      'factor-y': ammRoute[1]!.pool.factor,
      'factor-z': ammRoute[2]!.pool.factor,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 4) {
    return await readonlyCall('amm-pool-v2-01', 'fee-helper-c', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'token-w': ammRoute[2]!.neighbour,
      'token-v': ammRoute[3]!.neighbour,
      'factor-x': ammRoute[0]!.pool.factor,
      'factor-y': ammRoute[1]!.pool.factor,
      'factor-z': ammRoute[2]!.pool.factor,
      'factor-w': ammRoute[3]!.pool.factor,
    }).then(unwrapResponse);
  }
  throw new Error('Too many AMM pools in route');
}
