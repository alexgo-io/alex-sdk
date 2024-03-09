import { AMMSwapPool } from '../utils/ammPool';
import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import { Currency } from '../currency';
import { AlexSDK } from '../alexSDK';

export async function getLiquidityProviderFee(
  tokenX: Currency,
  tokenY: Currency,
  ammPools: AMMSwapPool.PoolTokens[],
  ammV1_1Pools: AMMSwapPool.PoolTokens[]
): Promise<bigint> {
  const ammV1_1Route = AMMSwapPool.getRoute(tokenX, tokenY, ammV1_1Pools);
  if (ammV1_1Route.length === 1) {
    return await readonlyCall('amm-swap-pool-v1-1', 'fee-helper', {
      'token-x': tokenX,
      'token-y': tokenY,
      factor: AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
    }).then(unwrapResponse);
  }
  if (ammV1_1Route.length === 2) {
    return await readonlyCall('amm-swap-pool-v1-1', 'fee-helper-a', {
      'token-x': tokenX,
      'token-y': ammV1_1Route[0]!.neighbour,
      'token-z': ammV1_1Route[1]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
    }).then(unwrapResponse);
  }
  if (ammV1_1Route.length === 3) {
    return await readonlyCall('amm-swap-pool-v1-1', 'fee-helper-b', {
      'token-x': tokenX,
      'token-y': ammV1_1Route[0]!.neighbour,
      'token-z': ammV1_1Route[1]!.neighbour,
      'token-w': ammV1_1Route[2]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammV1_1Route[2]!.pool),
    }).then(unwrapResponse);
  }
  if (ammV1_1Route.length === 4) {
    return await readonlyCall('amm-swap-pool-v1-1', 'fee-helper-c', {
      'token-x': tokenX,
      'token-y': ammV1_1Route[0]!.neighbour,
      'token-z': ammV1_1Route[1]!.neighbour,
      'token-w': ammV1_1Route[2]!.neighbour,
      'token-v': ammV1_1Route[3]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammV1_1Route[2]!.pool),
      'factor-w': AMMSwapPool.getFactor(ammV1_1Route[3]!.pool),
    }).then(unwrapResponse);
  }

  const ammRoute = AMMSwapPool.getRoute(tokenX, tokenY, ammPools);
  if (ammRoute.length === 1) {
    return await readonlyCall('amm-swap-pool', 'fee-helper', {
      'token-x': tokenX,
      'token-y': tokenY,
      factor: AMMSwapPool.getFactor(ammRoute[0]!.pool),
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 2) {
    return await readonlyCall('amm-swap-pool', 'fee-helper-a', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 3) {
    return await readonlyCall('amm-swap-pool', 'fee-helper-b', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'token-w': ammRoute[2]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 4) {
    return await readonlyCall('amm-swap-pool', 'fee-helper-c', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'token-w': ammRoute[2]!.neighbour,
      'token-v': ammRoute[3]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
      'factor-w': AMMSwapPool.getFactor(ammRoute[3]!.pool),
    }).then(unwrapResponse);
  }

  const reachableInAmm1_1 = AMMSwapPool.reachableInAMM(
    tokenX,
    tokenY,
    ammV1_1Pools
  );
  if (reachableInAmm1_1.type === 'fromAmm') {
    return await readonlyCall(
      'swap-helper-bridged-v1-1',
      'fee-helper-from-amm',
      {
        'token-x': reachableInAmm1_1.tokenX,
        'token-y': reachableInAmm1_1.tokenY,
        'token-z': reachableInAmm1_1.tokenZ,
        'factor-x': reachableInAmm1_1.factorX,
      }
    ).then(unwrapResponse);
  }
  if (reachableInAmm1_1.type === 'toAmm') {
    return await readonlyCall('swap-helper-bridged-v1-1', 'fee-helper-to-amm', {
      'token-x': reachableInAmm1_1.tokenX,
      'token-y': reachableInAmm1_1.tokenY,
      'token-z': reachableInAmm1_1.tokenZ,
      'factor-y': reachableInAmm1_1.factorY,
    }).then(unwrapResponse);
  }

  const reachableInAmm = AMMSwapPool.reachableInAMM(tokenX, tokenY, ammPools);
  if (reachableInAmm.type === 'fromAmm') {
    return await readonlyCall('swap-helper-bridged', 'fee-helper-from-amm', {
      'token-x': reachableInAmm.tokenX,
      'token-y': reachableInAmm.tokenY,
      'token-z': reachableInAmm.tokenZ,
      'factor-x': reachableInAmm.factorX,
    }).then(unwrapResponse);
  }
  if (reachableInAmm.type === 'toAmm') {
    return await readonlyCall('swap-helper-bridged', 'fee-helper-to-amm', {
      'token-x': reachableInAmm.tokenX,
      'token-y': reachableInAmm.tokenY,
      'token-z': reachableInAmm.tokenZ,
      'factor-y': reachableInAmm.factorY,
    }).then(unwrapResponse);
  }

  return await readonlyCall('swap-helper-v1-03', 'fee-helper', {
    'token-x': tokenX,
    'token-y': tokenY,
  }).then(unwrapResponse);
}
