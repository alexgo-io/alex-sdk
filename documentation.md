# API documentation

## Functions

The AlexSDK class includes the following functions:

```typescript
export declare class AlexSDK {
  fetchSwappableCurrency(): Promise<TokenInfo[]>;
  getAllPossibleRoutes(from: Currency, to: Currency): Promise<AMMRoute[]>;   
  getAmountTo(from: Currency, fromAmount: bigint, to: Currency): Promise<bigint>;
  getBalances(stxAddress: string): Promise<Partial<{ [currency in Currency]: bigint }>>;
  getFeeRate(from: Currency, to: Currency): Promise<bigint>;
  getLatestPrices(): Promise<Partial<{ [currency in Currency]: number }>>;
  getRoute(from: Currency, to: Currency): Promise<AMMRoute>;
  getRouter(from: Currency, to: Currency): Promise<Currency[]>; // deprecated
  getWayPoints(route: AMMRoute): Promise<TokenInfo[]>;
  runSwap(stxAddress: string, currencyX: Currency, 
          currencyY: Currency, fromAmount: bigint, 
          minDy: bigint, customRoute: AMMRoute): Promise<TxToBroadCast>;
}
```

### fetchSwappableCurrency

This function returns an array of `TokenInfo` objects, each containing detailed information about a supported swappable currency.

```typescript
function fetchSwappableCurrency(): Promise<TokenInfo[]>;
```

Possible exceptions: `Failed to fetch token mappings`.

### getAllPossibleRoutes

This function returns all possible routes for swapping between two specified currencies. It returns an array of AMMRoute, representing possible swap routes.

```typescript
async function getAllPossibleRoutes(from: Currency, to: Currency): Promise<AMMRoute[]>;
```

Possible exceptions: `Failed to fetch token mappings`, `Can't find route`.

### getAmountTo

Get the amount of destination currency that will be received when swapping from one currency to another.

```typescript
async function getAmountTo(from: Currency, fromAmount: bigint, to: Currency): Promise<bigint>;
```

Possible exceptions: `Failed to fetch token mappings`, `No AMM pool found for the given route`, `Too many AMM pools in route`, `Error calling read-only function`.

### getBalances

This function fetches the current balances of all supported tokens for a specified STX address. It returns an object where the keys are the currency identifiers (as defined in the `Currency` enum) and the values are the corresponding balances as `bigint` values.

```typescript
async function getBalances(stxAddress: string): Promise<Partial<{ [currency in Currency]: bigint }>>;
```

Possible exceptions: `Failed to fetch token mappings`.

### getFeeRate

Get the swap fee (liquidity provider fee) between two currencies.

```typescript
async function getFeeRate(from: Currency, to: Currency): Promise<bigint>;
```

Possible exceptions: `Failed to fetch token mappings`, `No AMM pools in route`, `Too many AMM pools in route`, `Error calling read-only function`.


### getLatestPrices

This function fetches the current price data for all supported tokens. It returns an object where the keys are the currency identifiers (as defined in the `Currency` enum) and the values are the corresponding prices in USD.

```typescript
async function getLatestPrices(): Promise<Partial<{ [currency in Currency]: number }>>;
```
Possible exceptions: `Failed to fetch token mappings`.

### getRoute

Get the router path for swapping between two currencies.

```typescript
async function getRoute(from: Currency, to: Currency): Promise<Currency[]>;
```

Possible exceptions: `Failed to fetch token mappings`, `Can't find route`.

### getWayPoints

This function takes an AMMRoute and returns an array of TokenInfo objects representing the tokens involved in each step of the route, including the origin token.

```typescript
async function getWayPoints(route: AMMRoute): Promise<TokenInfo[]>;
```

Possible exceptions: `Failed to fetch token mappings`.

### runSwap

Perform a swap between two currencies using the specified route and amount.

```typescript
async function runSwap(stxAddress: string, currencyX: Currency, currencyY: Currency, 
                  fromAmount: bigint, minDy: bigint, customRoute: Currency[]): Promise<TxToBroadCast>;
```

Possible exceptions: `Failed to fetch token mappings`, `Can't find AMM route`, `Token mapping not found`, `Too many AMM pools in route`.

## Types
```typescript
export type TokenInfo = { // TokenInfo represents the details of a token that can be used in the AlexSDK.
  id: Currency; // The unique identifier of the currency.
  name: string; // The display name of the token that ALEX maintains, usually the token symbol.
  icon: string; // The URL to the icon image of the token, maintained by ALEX.
  wrapToken: string; // The full asset id of the alex wrapped token in the format of "{deployer}.{contract}::{asset}".
  wrapTokenDecimals: number; // The number of decimal places for the wrapped token.
  underlyingToken: string; // The full asset id of the underlying token in the format of "{deployer}.{contract}::{asset}".
  underlyingTokenDecimals: number; // The number of decimal places for the underlying token.
  isRebaseToken: boolean; // A boolean flag indicating whether the token is a rebase token.
  /**
   * In a rebase token, getBalance is different from ft-balance
   * Also postcondition would need to be adjusted since amount is different from ft-events
   */
};
```