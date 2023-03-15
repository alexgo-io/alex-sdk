import { getLiquidityProviderFee } from './helpers/FeeHelper';
import { AMMSwapPool } from './utils/ammPool';
import { getRoute } from './helpers/RouteHelper';
import { getYAmountFromXAmount } from './helpers/RateHelper';
import { runSpot, TxToBroadCast } from './helpers/SwapHelper';
import { findCurrencyByNativeAddress } from './utils/currencyUtils';

export enum Currency {
  ALEX = 'age000-governance-token',
  USDA = 'token-wusda',
  STX = 'token-wstx',
  BANANA = 'token-wban',
  XBTC = 'token-wbtc',
  DIKO = 'token-wdiko',
  SLIME = 'token-wslm',
  XUSD = 'token-wxusd',
  MIA = 'token-wmia',
  NYCC = 'token-wnycc',
  CORGI = 'token-wcorgi',
}

export class AlexSDK {
  getFee(from: Currency, to: Currency): Promise<bigint> {
    return getLiquidityProviderFee(from, to, AMMSwapPool.ammTokens);
  }
  getRouter(from: Currency, to: Currency): Promise<Currency[]> {
    return getRoute(from, to, AMMSwapPool.ammTokens);
  }
  getAmountTo(
    from: Currency,
    fromAmount: bigint,
    to: Currency
  ): Promise<bigint> {
    return getYAmountFromXAmount(from, to, fromAmount, AMMSwapPool.ammTokens);
  }
  runSwap(
    stxAddress: string,
    currencyX: Currency,
    currencyY: Currency,
    fromAmount: bigint,
    minDy: bigint,
    router: Currency[]
  ): TxToBroadCast {
    return runSpot(
      stxAddress,
      currencyX,
      currencyY,
      fromAmount,
      minDy,
      router,
      AMMSwapPool.ammTokens
    );
  }
  getCurrencyFrom(address: string): Currency | undefined {
    return findCurrencyByNativeAddress(address);
  }
}
