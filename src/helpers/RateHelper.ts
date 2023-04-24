import { AMMSwapPool } from '../utils/ammPool';
import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import { Currency } from '../currency';
import { AlexSDK } from '../alexSDK';

export const getYAmountFromXAmount = async (
  tokenX: Currency,
  tokenY: Currency,
  fromAmount: bigint,
  ammPools: AMMSwapPool.PoolTokens[]
): Promise<bigint> => {
  const ammRoute = AMMSwapPool.getRoute(tokenX, tokenY, ammPools);
  if (ammRoute.length === 0) {
    const reachableInAMM = AMMSwapPool.reachableInAMM(tokenX, tokenY, ammPools);
    if (reachableInAMM.type === 'fromAmm') {
      return await readonlyCall('swap-helper-bridged', 'get-helper-from-amm', {
        dx: fromAmount,
        'token-x': reachableInAMM.tokenX,
        'token-y': reachableInAMM.tokenY,
        'token-z': reachableInAMM.tokenZ,
        'factor-x': reachableInAMM.factorX,
      }).then(unwrapResponse);
    }
    if (reachableInAMM.type === 'toAmm') {
      return await readonlyCall('swap-helper-bridged', 'get-helper-to-amm', {
        dx: fromAmount,
        'token-x': reachableInAMM.tokenX,
        'token-y': reachableInAMM.tokenY,
        'token-z': reachableInAMM.tokenZ,
        'factor-y': reachableInAMM.factorY,
      }).then(unwrapResponse);
    }
    return await readonlyCall('swap-helper-v1-03', 'get-helper', {
      'token-x': tokenX,
      'token-y': tokenY,
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 1) {
    return await readonlyCall('amm-swap-pool', 'get-helper', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      dx: fromAmount,
      factor: AMMSwapPool.getFactor(ammRoute[0]!.pool),
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 2) {
    return await readonlyCall('amm-swap-pool', 'get-helper-a', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 3) {
    return await readonlyCall('amm-swap-pool', 'get-helper-b', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'token-w': ammRoute[2]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 4) {
    return await readonlyCall('amm-swap-pool', 'get-helper-c', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'token-w': ammRoute[2]!.neighbour,
      'token-v': ammRoute[3]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
      'factor-w': AMMSwapPool.getFactor(ammRoute[3]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  throw new Error('Too many AMM pools in route');
};
