import { Currency } from './currency';
import { runSpot, TxToBroadCast } from './helpers/SwapHelper';
import { getLiquidityProviderFee } from './helpers/FeeHelper';
import { AlexSDKResponse, PoolData, PriceData, TokenInfo } from './types';
import {
  fetchBalanceForAccount,
  getAlexSDKData,
  getPrices,
} from './utils/fetchData';
import { getRoute } from './helpers/RouteHelper';
import { getYAmountFromXAmount } from './helpers/RateHelper';
import { fromEntries } from './utils/utils';

export class AlexSDK {
  alexSDKData?: Promise<AlexSDKResponse>;

  private async getAlexSDKData(): Promise<AlexSDKResponse> {
    if (this.alexSDKData == null) {
      this.alexSDKData = getAlexSDKData();
    }
    return this.alexSDKData;
  }

  private async getTokenInfos(): Promise<TokenInfo[]> {
    return (await this.getAlexSDKData()).tokens;
  }

  private async getPools(): Promise<PoolData[]> {
    return (await this.getAlexSDKData()).pools;
  }

  fetchSwappableCurrency(): Promise<TokenInfo[]> {
    return this.getTokenInfos();
  }

  private async getPrices(): Promise<PriceData[]> {
    return getPrices(await this.getTokenInfos());
  }

  async getFeeRate(from: Currency, to: Currency): Promise<bigint> {
    return getLiquidityProviderFee(from, to, await this.getPools());
  }

  async getRouter(from: Currency, to: Currency): Promise<Currency[]> {
    return getRoute(from, to, await this.getPools());
  }

  async getAmountTo(
    from: Currency,
    fromAmount: bigint,
    to: Currency
  ): Promise<bigint> {
    return getYAmountFromXAmount(from, to, fromAmount, await this.getPools());
  }

  async runSwap(
    stxAddress: string,
    currencyX: Currency,
    currencyY: Currency,
    fromAmount: bigint,
    minDy: bigint
  ): Promise<TxToBroadCast> {
    return runSpot(
      stxAddress,
      currencyX,
      currencyY,
      fromAmount,
      minDy,
      await this.getPools(),
      await this.getTokenInfos()
    );
  }

  async getLatestPrices(): Promise<
    Partial<{
      [currency in Currency]: number;
    }>
  > {
    const priceData = await this.getPrices();
    return fromEntries(priceData.map((x) => [x.token, x.price]));
  }

  async getBalances(
    stxAddress: string
  ): Promise<Partial<{ [currency in Currency]: bigint }>> {
    return fetchBalanceForAccount(stxAddress, await this.getTokenInfos());
  }
}
