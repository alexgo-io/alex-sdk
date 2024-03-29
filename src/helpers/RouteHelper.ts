import { AMMSwapPool } from '../utils/ammPool';
import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import { Currency } from '../currency';

export async function getRoute(
  from: Currency,
  to: Currency,
  ammPools: AMMSwapPool.PoolTokens[],
  ammV1_1Tokens: AMMSwapPool.Pool[]
): Promise<Currency[]> {
  const ammV1_1Route = AMMSwapPool.getRoute(from, to, ammV1_1Tokens);
  if (ammV1_1Route.length > 0) {
    return [from, ...ammV1_1Route.map((a) => a.neighbour)];
  }
  const ammRoute = AMMSwapPool.getRoute(from, to, ammPools);
  if (ammRoute.length > 0) {
    return [from, ...ammRoute.map((a) => a.neighbour)];
  }
  const reachableInAmmV1_1 = AMMSwapPool.reachableInAMM(
    from,
    to,
    ammV1_1Tokens
  );
  if (reachableInAmmV1_1.type === 'fromAmm') {
    const result = await readonlyCall(
      'swap-helper-bridged-v1-1',
      'route-helper-from-amm',
      {
        'token-x': reachableInAmmV1_1.tokenX,
        'token-y': reachableInAmmV1_1.tokenY,
        'token-z': reachableInAmmV1_1.tokenZ,
        'factor-x': reachableInAmmV1_1.factorX,
      }
    ).then(unwrapResponse);
    return result.map((x) => x as Currency);
  }
  if (reachableInAmmV1_1.type === 'toAmm') {
    const result = await readonlyCall(
      'swap-helper-bridged-v1-1',
      'route-helper-to-amm',
      {
        'token-x': reachableInAmmV1_1.tokenX,
        'token-y': reachableInAmmV1_1.tokenY,
        'token-z': reachableInAmmV1_1.tokenZ,
        'factor-y': reachableInAmmV1_1.factorY,
      }
    ).then(unwrapResponse);
    return result.map((x) => x as Currency);
  }
  const reachableInAmm = AMMSwapPool.reachableInAMM(from, to, ammPools);
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
