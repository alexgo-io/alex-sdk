import { AlexSDK, Currency } from '../index';
import { AMMSwapPool } from '../utils/ammPool';
import { unwrapResponse } from 'clarity-codegen';

export async function getLiquidityProviderFee(
  sdk: AlexSDK,
  tokenX: Currency,
  tokenY: Currency,
  ammPools: AMMSwapPool.PoolTokens[]
): Promise<bigint> {
  const ammRoute = AMMSwapPool.getRoute(tokenX, tokenY, ammPools);
  if (ammRoute.length === 0) {
    const reachableInAmm = AMMSwapPool.reachableInAMM(tokenX, tokenY, ammPools);
    if (reachableInAmm.type === 'fromAmm') {
      return await sdk
        .readonlyCall('swap-helper-bridged', 'fee-helper-from-amm', {
          'token-x': reachableInAmm.tokenX,
          'token-y': reachableInAmm.tokenY,
          'token-z': reachableInAmm.tokenZ,
          'factor-x': reachableInAmm.factorX,
        })
        .then(unwrapResponse);
    }
    if (reachableInAmm.type === 'toAmm') {
      return await sdk
        .readonlyCall('swap-helper-bridged', 'fee-helper-to-amm', {
          'token-x': reachableInAmm.tokenX,
          'token-y': reachableInAmm.tokenY,
          'token-z': reachableInAmm.tokenZ,
          'factor-y': reachableInAmm.factorY,
        })
        .then(unwrapResponse);
    }
    return await sdk
      .readonlyCall('swap-helper-v1-03', 'fee-helper', {
        'token-x': tokenX,
        'token-y': tokenY,
      })
      .then(unwrapResponse);
  }
  if (ammRoute.length === 1) {
    return await sdk
      .readonlyCall('amm-swap-pool', 'fee-helper', {
        'token-x': tokenX,
        'token-y': tokenY,
        factor: AMMSwapPool.getFactor(ammRoute[0]!.pool),
      })
      .then(unwrapResponse);
  }
  if (ammRoute.length === 2) {
    return await sdk
      .readonlyCall('amm-swap-pool', 'fee-helper-a', {
        'token-x': tokenX,
        'token-y': ammRoute[0]!.neighbour,
        'token-z': ammRoute[1]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      })
      .then(unwrapResponse);
  }
  if (ammRoute.length === 3) {
    return await sdk
      .readonlyCall('amm-swap-pool', 'fee-helper-b', {
        'token-x': tokenX,
        'token-y': ammRoute[0]!.neighbour,
        'token-z': ammRoute[1]!.neighbour,
        'token-w': ammRoute[2]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
        'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
      })
      .then(unwrapResponse);
  }
  if (ammRoute.length === 4) {
    return await sdk
      .readonlyCall('amm-swap-pool', 'fee-helper-c', {
        'token-x': tokenX,
        'token-y': ammRoute[0]!.neighbour,
        'token-z': ammRoute[1]!.neighbour,
        'token-w': ammRoute[2]!.neighbour,
        'token-v': ammRoute[3]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
        'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
        'factor-w': AMMSwapPool.getFactor(ammRoute[3]!.pool),
      })
      .then(unwrapResponse);
  }
  throw new Error('Too many AMM pools in route');
}
