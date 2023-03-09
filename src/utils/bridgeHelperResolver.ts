// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
import { AMMSwapPool } from './ammPool';
import { Currency } from '../currency';

export function bridgeHelperResolver(
  from: Currency,
  to: Currency,
  ammPools: AMMSwapPool.PoolTokens[]
) {
  const bridgingToken = [Currency.STX, Currency.ALEX];
  const fromPool = ammPools.find((a) => {
    if (!AMMSwapPool.breakDown(a).includes(from)) return false;
    const [x, y] = AMMSwapPool.breakDown(a);
    return bridgingToken.includes(x === from ? y : x);
  });
  if (fromPool) {
    const [x, y] = AMMSwapPool.breakDown(fromPool);
    return {
      pool: fromPool,
      type: 'fromAmm' as const,
      tokenX: from,
      tokenY: x === from ? y : x,
      factorX: AMMSwapPool.getFactor(fromPool),
      tokenZ: to,
    };
  }
  const toPool = ammPools.find((a) => {
    if (!AMMSwapPool.breakDown(a).includes(to)) return false;
    const [x, y] = AMMSwapPool.breakDown(a);
    return bridgingToken.includes(x === to ? y : x);
  });
  if (toPool) {
    const [x, y] = AMMSwapPool.breakDown(toPool);
    return {
      pool: toPool,
      type: 'toAmm' as const,
      tokenX: from,
      tokenY: x === to ? y : x,
      factorY: AMMSwapPool.getFactor(toPool),
      tokenZ: to,
    };
  }
  return { type: 'none' as const };
}
