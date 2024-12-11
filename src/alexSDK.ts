import { Currency } from './currency';
import { runSpot, type TxToBroadCast } from './helpers/SwapHelper';
import { getLiquidityProviderFee } from './helpers/FeeHelper';
import type { AlexSDKResponse, PoolData, PriceData, TokenInfo } from './types';
import {
  fetchBalanceForAccount,
  getAlexSDKData,
  getPrices,
} from './utils/fetchData';
import { getAllPossibleRoute } from './helpers/RouteHelper';
import { getYAmountFromXAmount } from './helpers/RateHelper';
import { fromEntries } from './utils/utils';
import type { AMMRoute } from './utils/ammRouteResolver';
import {
  broadcastSponsoredTx,
  requiredStxAmountForSponsorTx,
  runSponsoredSpotTx,
  SponsoredTxError,
  SponsoredTxErrorCode,
} from './helpers/SponsorTxHelper';

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
   * This function returns an array of TokenInfo objects, each containing detailed
   * information about a supported swappable currency.
   *
   * @returns {Promise<TokenInfo[]>} - A promise that resolves to an array of
   * `TokenInfo` objects representing the currencies available for swaps.
   */
  fetchSwappableCurrency(): Promise<TokenInfo[]> {
    return this.getTokenInfos();
  }

  /**
   * Fetch the token info for a given token address.
   * @param tokenAddress - The address of the token to fetch info for. e.g SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex
   * @returns A promise that resolves to a `TokenInfo` object or `null` if the token is not found.
   */
  async fetchTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
    return (
      (await this.getTokenInfos()).find(
        (x) => x.underlyingToken.split('::')[0] === tokenAddress.split('::')[0]
      ) ?? null
    );
  }

  private async getPrices(): Promise<PriceData[]> {
    return getPrices(await this.getTokenInfos());
  }

  /**
   * This function returns all possible routes for swapping between two specified currencies.
   * It returns an array of AMMRoute, representing possible swap routes.
   *
   * @param {Currency} from - The currency to swap from.
   * @param {Currency} to - The currency to swap to.
   * @returns {Promise<AMMRoute[]>} - A promise that resolves to an array of AMMRoute objects,
   * representing all possible swap routes between the two specified currencies.
   */
  async getAllPossibleRoutes(
    from: Currency,
    to: Currency
  ): Promise<AMMRoute[]> {
    return await getAllPossibleRoute(from, to, await this.getPools());
  }

  /**
   * Get the router path for swapping between two currencies.
   *
   * @param {Currency} from - The currency to swap from.
   * @param {Currency} to - The currency to swap to.
   * @returns {Promise<AMMRoute>} - A promise that resolves to an AMMRoute object, representing the best route for the swap.
   */
  async getRoute(from: Currency, to: Currency): Promise<AMMRoute> {
    const allPossibleRoutes = await this.getAllPossibleRoutes(from, to);
    if (allPossibleRoutes.length === 0) {
      throw new Error("Can't find route");
    }
    return allPossibleRoutes[0];
  }

  /**
   * This function takes an AMMRoute and returns an array of TokenInfo objects representing
   * the tokens involved in each step of the route, including the origin token.
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
   * Get the swap fee (liquidity provider fee) between two currencies.
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
   * Get the amount of destination currency that will be received when swapping from one currency to another.
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
   * Get the amount of destination currency that will be received when swapping from one currency to another
   * in the context of sponsor tx.
   *
   * @param {Currency} from - The currency to swap from.
   * @param {bigint} fromAmount - The amount of the source currency to swap.
   * @param {Currency} to - The currency to swap to.
   * @param {AMMRoute} [customRoute] - An optional custom route for the swap.
   * @returns {Promise<bigint>} - A promise that resolves to a bigint representing the amount of the destination currency that will be received.
   */
  async getAmountToForSponsoredTx(
    from: Currency,
    fromAmount: bigint,
    to: Currency,
    customRoute?: AMMRoute
  ): Promise<bigint> {
    const route = customRoute ?? (await this.getRoute(from, to));
    const stxAmount = await requiredStxAmountForSponsorTx(from, to, route);
    const sponsorFeeAmount =
      from === Currency.STX
        ? stxAmount
        : await this.getAmountTo(Currency.STX, stxAmount, from);
    if (sponsorFeeAmount > fromAmount) {
      return BigInt(0);
    }
    return getYAmountFromXAmount(
      from,
      to,
      fromAmount - sponsorFeeAmount,
      await this.getPools(),
      await this.getContractId(),
      customRoute
    );
  }

  /**
   * Perform a swap between two currencies using the specified route and amount.
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
   * Perform a swap between two currencies using the specified route and amount.
   * Targetting sponsor tx.
   *
   * @param {string} stxAddress - The Stacks (STX) address to execute the swap from.
   * @param {Currency} currencyX - The currency to swap from.
   * @param {Currency} currencyY - The currency to swap to.
   * @param {bigint} fromAmount - The amount of the source currency to swap.
   * @param {bigint} minDy - The minimum amount of the destination currency to receive.
   * @param {AMMRoute} [customRoute] - An optional custom route for the swap.
   * @returns {Promise<TxToBroadCast>} - A promise that resolves to a TxToBroadCast object, representing the transaction to be broadcasted.
   */
  async runSwapForSponsoredTx(
    stxAddress: string,
    currencyX: Currency,
    currencyY: Currency,
    fromAmount: bigint,
    minDy: bigint,
    customRoute?: AMMRoute
  ): Promise<TxToBroadCast> {
    const route = customRoute ?? (await this.getRoute(currencyX, currencyY));
    const stxAmount = await requiredStxAmountForSponsorTx(
      currencyX,
      currencyY,
      route
    );
    const sponsorFeeAmount =
      currencyX === Currency.STX
        ? stxAmount
        : await this.getAmountTo(Currency.STX, stxAmount, currencyX);
    if (sponsorFeeAmount > fromAmount) {
      throw new SponsoredTxError(
        SponsoredTxErrorCode.insufficient_funds,
        'Insufficient funds to cover sponsor fee'
      );
    }
    return runSponsoredSpotTx(
      stxAddress,
      currencyX,
      currencyY,
      fromAmount,
      minDy,
      sponsorFeeAmount,
      await this.getPools(),
      await this.getTokenInfos(),
      customRoute
    );
  }

  /**
   * Broadcast a sponsored transaction.
   *
   * @param {string} tx - The signed sponsor transaction to be broadcast.
   * @returns {Promise<string>} - A promise that resolves to the transaction ID.
   */
  async broadcastSponsoredTx(tx: string): Promise<string> {
    return broadcastSponsoredTx(tx);
  }

  /**
   * This function fetches the current price data for all supported tokens. It returns an object where
   * the keys are the currency identifiers (as defined in the Currency enum) and the values are the corresponding prices in USD.
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
   * This function fetches the current balances of all supported tokens for a specified STX address.
   * It returns an object where the keys are the currency identifiers (as defined in the Currency enum)
   * and the values are the corresponding balances as bigint values.
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
