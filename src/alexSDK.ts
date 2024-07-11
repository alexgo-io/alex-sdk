import { Currency } from './currency';
import { runSpot, TxToBroadCast } from './helpers/SwapHelper';
import { getLiquidityProviderFee } from './helpers/FeeHelper';
import { AlexSDKResponse, PoolData, PriceData, TokenInfo } from './types';
import {
  fetchBalanceForAccount,
  getAlexSDKData,
  getPrices,
} from './utils/fetchData';
import { getAllPossibleRoute } from './helpers/RouteHelper';
import { getYAmountFromXAmount } from './helpers/RateHelper';
import { fromEntries } from './utils/utils';
import { AMMRoute } from './utils/ammRouteResolver';

/**
 * The AlexSDK class provides methods for interacting with a decentralized exchange (DEX) system,
 * allowing users to fetch currency information, calculate routes for swaps, estimate fees and
 * amounts, perform swaps, retrieve latest prices, and check balances.
 */
export class AlexSDK {
  private alexSDKData?: Promise<AlexSDKResponse>;

  private async getAlexSDKData(): Promise<AlexSDKResponse> {
    if (this.alexSDKData == null) {
      this.alexSDKData = getAlexSDKData();
    }
    return this.alexSDKData;
  }

  private async getTokenInfos(): Promise<TokenInfo[]> {
    return (await this.getAlexSDKData()).tokens;
  }

  private async getTokenMappings(): Promise<{ [P in Currency]: TokenInfo }> {
    return fromEntries((await this.getTokenInfos()).map((x) => [x.id, x]));
  }

  private async getContractId(): Promise<(currency: Currency) => string> {
    const mappings = await this.getTokenMappings();
    return (currency) => mappings[currency].wrapToken.split('::')[0];
  }

  private async getPools(): Promise<PoolData[]> {
    return (await this.getAlexSDKData()).pools;
  }

  /**
   * Fetches the list of currencies that can be swapped on the DEX.
   *
   * @returns {Promise<TokenInfo[]>} - A promise that resolves to an array of TokenInfo objects,
   * representing the swappable currencies.
   */
  fetchSwappableCurrency(): Promise<TokenInfo[]> {
    return this.getTokenInfos();
  }

  private async getPrices(): Promise<PriceData[]> {
    return getPrices(await this.getTokenInfos());
  }

  /**
   * Retrieves all possible routes for swapping from one currency to another.
   *
   * @param {Currency} from - The currency to swap from.
   * @param {Currency} to - The currency to swap to.
   * @returns {Promise<AMMRoute[]>} - A promise that resolves to an array of AMMRoute objects,
   * representing all possible routes for the swap.
   */
  async getAllPossibleRoutes(
    from: Currency,
    to: Currency
  ): Promise<AMMRoute[]> {
    return await getAllPossibleRoute(from, to, await this.getPools());
  }

  /**
   * Retrieves the best route for swapping from one currency to another.
   *
   * @param {Currency} from - The currency to swap from.
   * @param {Currency} to - The currency to swap to.
   * @returns {Promise<AMMRoute>} - A promise that resolves to an AMMRoute object, representing the best route for the swap.
   */
  async getRoute(from: Currency, to: Currency): Promise<AMMRoute> {
    return (await this.getAllPossibleRoutes(from, to))[0];
  }

  /**
   * Displays the detailed route information.
   *
   * @param {AMMRoute} route - The route to display.
   * @returns {Promise<TokenInfo[]>} - A promise that resolves to an array of TokenInfo objects,
   * representing the detailed information of the route.
   */
  async getWayPoints(route: AMMRoute): Promise<TokenInfo[]> {
    const { neighbour, pool } = route[0];
    const origin = neighbour === pool.tokenY ? pool.tokenX : pool.tokenY;
    const tokenMappings = await this.getTokenMappings();
    return [origin, ...route.map((x) => x.neighbour)].map(
      (x) => tokenMappings[x]
    );
  }

  /**
   * Calculates the fee rate for a swap between two currencies.
   *
   * @param {Currency} from - The currency to swap from.
   * @param {Currency} to - The currency to swap to.
   * @param {AMMRoute} [customRoute] - An optional custom route for the swap.
   * @returns {Promise<bigint>} - A promise that resolves to a bigint representing the fee rate for the swap.
   */
  async getFeeRate(
    from: Currency,
    to: Currency,
    customRoute?: AMMRoute
  ): Promise<bigint> {
    return getLiquidityProviderFee(
      from,
      to,
      await this.getPools(),
      await this.getContractId(),
      customRoute
    );
  }

  /**
   * Calculates the amount of the destination currency that will be received for a given amount of the source currency.
   *
   * @param {Currency} from - The currency to swap from.
   * @param {bigint} fromAmount - The amount of the source currency to swap.
   * @param {Currency} to - The currency to swap to.
   * @param {AMMRoute} [customRoute] - An optional custom route for the swap.
   * @returns {Promise<bigint>} - A promise that resolves to a bigint representing the amount of the destination currency that will be received.
   */
  async getAmountTo(
    from: Currency,
    fromAmount: bigint,
    to: Currency,
    customRoute?: AMMRoute
  ): Promise<bigint> {
    return getYAmountFromXAmount(
      from,
      to,
      fromAmount,
      await this.getPools(),
      await this.getContractId(),
      customRoute
    );
  }

  /**
   * Executes a swap transaction between two currencies.
   *
   * @param {string} stxAddress - The Stacks (STX) address to execute the swap from.
   * @param {Currency} currencyX - The currency to swap from.
   * @param {Currency} currencyY - The currency to swap to.
   * @param {bigint} fromAmount - The amount of the source currency to swap.
   * @param {bigint} minDy - The minimum amount of the destination currency to receive.
   * @param {AMMRoute} [customRoute] - An optional custom route for the swap.
   * @returns {Promise<TxToBroadCast>} - A promise that resolves to a TxToBroadCast object, representing the transaction to be broadcasted.
   */
  async runSwap(
    stxAddress: string,
    currencyX: Currency,
    currencyY: Currency,
    fromAmount: bigint,
    minDy: bigint,
    customRoute?: AMMRoute
  ): Promise<TxToBroadCast> {
    return runSpot(
      stxAddress,
      currencyX,
      currencyY,
      fromAmount,
      minDy,
      await this.getPools(),
      await this.getTokenInfos(),
      customRoute
    );
  }

  /**
   * Retrieves the latest prices for all supported currencies.
   *
   * @returns {Promise<Partial<{ [currency in Currency]: number }>>} - A promise that resolves to an object containing the latest prices for each currency.
   */
  async getLatestPrices(): Promise<
    Partial<{
      [currency in Currency]: number;
    }>
  > {
    const priceData = await this.getPrices();
    return fromEntries(priceData.map((x) => [x.token, x.price]));
  }

  /**
   * Retrieves the balances of all supported currencies for a given Stacks (STX) address.
   *
   * @param {string} stxAddress - The Stacks (STX) address to retrieve the balances for.
   * @returns {Promise<Partial<{ [currency in Currency]: bigint }>>} - A promise that resolves to an object containing the balances of each currency for the given address.
   */
  async getBalances(
    stxAddress: string
  ): Promise<Partial<{ [currency in Currency]: bigint }>> {
    return fetchBalanceForAccount(stxAddress, await this.getTokenInfos());
  }

  // @deprecated use getRoute + displayRoute instead
  async getRouter(from: Currency, to: Currency): Promise<Currency[]> {
    const route = await this.getRoute(from, to);
    return [from, ...route.map((x) => x.neighbour)];
  }
}
