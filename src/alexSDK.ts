import { createCurrency, Currency } from './currency';
import { runSpot, TxToBroadCast } from './helpers/SwapHelper';
import { getLiquidityProviderFee } from './helpers/FeeHelper';
import { PoolData, PriceData, TokenMapping } from './types';
import {
  fetchBalanceForAccount,
  getMappingData,
  getPoolData,
  getPrices,
} from './utils/fetchData';
import { getRoute } from './helpers/RouteHelper';
import { getYAmountFromXAmount } from './helpers/RateHelper';
import { fromEntries } from './utils/utils';

export class AlexSDK {
  tokenMappings?: Promise<TokenMapping[]>;
  pools?: Promise<PoolData[]>;

  private async getTokenMappings(): Promise<TokenMapping[]> {
    if (this.tokenMappings == null) {
      this.tokenMappings = getMappingData();
    }
    return this.tokenMappings;
  }

  private async getPools(): Promise<PoolData[]> {
    if (this.pools == null) {
      this.pools = getPoolData();
    }
    return this.pools;
  }

  private async getPrices(): Promise<PriceData[]> {
    return getPrices(await this.getTokenMappings());
  }

  async getListAllCurrency(): Promise<Currency[]> {
    const mappings = await this.getTokenMappings();
    return mappings.map((x) => x.token).map(createCurrency);
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
      await this.getTokenMappings()
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
    return fetchBalanceForAccount(stxAddress, await this.getTokenMappings());
  }
}
