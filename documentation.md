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

### runSwap

Perform a swap between two currencies using the specified route and amount.

```typescript
function runSwap(stxAddress: string, currencyX: Currency, currencyY: Currency, 
                  fromAmount: bigint, minDy: bigint, customRoute: Currency[]): Promise<TxToBroadCast>;
```

Possible exceptions: `Failed to fetch token mappings`, `Can't find AMM route`, `Token mapping not found`, `Too many AMM pools in route`.
