import { AlexSDK } from '../index';
import { AMMSwapPool } from '../utils/ammPool';
import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import { Currency } from '../Currency';

export async function getRoute(
  from: Currency,
  to: Currency,
  pools: AMMSwapPool.PoolTokens[]
): Promise<Currency[]> {
  const ammRoute = AMMSwapPool.getRoute(from, to, pools);
  if (ammRoute.length > 0) {
    return [from, ...ammRoute.map((a) => a.neighbour)];
  }
  const reachableInAmm = AMMSwapPool.reachableInAMM(from, to, pools);
  if (reachableInAmm.type === 'fromAmm') {
    const result = await readonlyCall(
      'swap-helper-bridged',
      'route-helper-from-amm',
      {
        'token-x': reachableInAmm.tokenX,
        'token-y': reachableInAmm.tokenY,
        'token-z': reachableInAmm.tokenZ,
        'factor-x': reachableInAmm.factorX,
      }
    ).then(unwrapResponse);
    return result.map((x) => x as Currency);
  }
  if (reachableInAmm.type === 'toAmm') {
    const result = await readonlyCall(
      'swap-helper-bridged',
      'route-helper-to-amm',
      {
        'token-x': reachableInAmm.tokenX,
        'token-y': reachableInAmm.tokenY,
        'token-z': reachableInAmm.tokenZ,
        'factor-y': reachableInAmm.factorY,
      }
    ).then(unwrapResponse);
    return result.map((x) => x as Currency);
  }
  const result = await readonlyCall('swap-helper-v1-03', 'route-helper', {
    'token-x': from,
    'token-y': to,
  }).then(unwrapResponse);
  return result.map((x) => x as Currency);
}
