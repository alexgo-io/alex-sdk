# Alex-SDK

Alex-SDK is an easy-to-use library that exposes the swap functionality from [alexlab.co](https://app.alexlab.co/swap) to be integrated into any app or wallet. It enables users to perform swaps with a wide variety of supported currencies.

## Installation

You can install Alex-SDK using npm:

```bash
npm install alex-sdk
```

## Methods

### `fetchSwappableCurrency()`

Fetches the list of currencies that can be swapped on the DEX.

- **Returns**: `Promise<TokenInfo[]>` - A promise that resolves to an array of TokenInfo objects, representing the swappable currencies.

### `getAllPossibleRoutes(from: Currency, to: Currency)`

Retrieves all possible routes for swapping from one currency to another.

- **Parameters**:

    - `from: Currency` - The currency to swap from.
    - `to: Currency` - The currency to swap to.

- **Returns**: `Promise<AMMRoute[]>` - A promise that resolves to an array of AMMRoute objects, representing all possible routes for the swap.

### `getRoute(from: Currency, to: Currency)`

Retrieves the best route for swapping from one currency to another.

- **Parameters**:

    - `from: Currency` - The currency to swap from.
    - `to: Currency` - The currency to swap to.

- **Returns**: `Promise<AMMRoute>` - A promise that resolves to an AMMRoute object, representing the best route for the swap.

### `getWayPoints(route: AMMRoute)`

Displays the detailed route information.

- **Parameters**:

    - `route: AMMRoute` - The route to display.

- **Returns**: `Promise<TokenInfo[]>` - A promise that resolves to an array of TokenInfo objects, representing the detailed information of the route.

### `getFeeRate(from: Currency, to: Currency, customRoute?: AMMRoute)`

Calculates the fee rate for a swap between two currencies.

- **Parameters**:

    - `from: Currency` - The currency to swap from.
    - `to: Currency` - The currency to swap to.
    - `customRoute?: AMMRoute` - An optional custom route for the swap.

- **Returns**: `Promise<bigint>` - A promise that resolves to a bigint representing the fee rate for the swap.

### `getAmountTo(from: Currency, fromAmount: bigint, to: Currency, customRoute?: AMMRoute)`

Calculates the amount of the destination currency that will be received for a given amount of the source currency.

- **Parameters**:

    - `from: Currency` - The currency to swap from.
    - `fromAmount: bigint` - The amount of the source currency to swap.
    - `to: Currency` - The currency to swap to.
    - `customRoute?: AMMRoute` - An optional custom route for the swap.

- **Returns**: `Promise<bigint>` - A promise that resolves to a bigint representing the amount of the destination currency that will be received.

### `runSwap(stxAddress: string, currencyX: Currency, currencyY: Currency, fromAmount: bigint, minDy: bigint, customRoute?: AMMRoute)`

Executes a swap transaction between two currencies.

- **Parameters**:

    - `stxAddress: string` - The Stacks (STX) address to execute the swap from.
    - `currencyX: Currency` - The currency to swap from.
    - `currencyY: Currency` - The currency to swap to.
    - `fromAmount: bigint` - The amount of the source currency to swap.
    - `minDy: bigint` - The minimum amount of the destination currency to receive.
    - `customRoute?: AMMRoute` - An optional custom route for the swap.

- **Returns**: `Promise<TxToBroadCast>` - A promise that resolves to a TxToBroadCast object, representing the transaction to be broadcasted.

### `getLatestPrices()`

Retrieves the latest prices for all supported currencies.

- **Returns**: `Promise<Partial<{ [currency in Currency]: number }>>` - A promise that resolves to an object containing the latest prices for each currency.

### `getBalances(stxAddress: string)`

Retrieves the balances of all supported currencies for a given Stacks (STX) address.

- **Parameters**:

    - `stxAddress: string` - The Stacks (STX) address to retrieve the balances for.

- **Returns**: `Promise<Partial<{ [currency in Currency]: bigint }>>` - A promise that resolves to an object containing the balances of each currency for the given address.

## Usage

```typescript
import { AlexSDK, Currency } from 'alex-sdk';

const alex = new AlexSDK();

(async () => {
  // Get swap fee between STX and ALEX
  const feeRate = await alex.getFeeRate(Currency.STX, Currency.ALEX);
  console.log('Swap fee:', feeRate);

  // Get the router path for swapping STX to ALEX
  const router = await alex.getRoute(Currency.STX, Currency.ALEX);
  console.log('Router path:', router);

  // Get the amount of USDA that will be received when swapping 100 ALEX
  const amountTo = await alex.getAmountTo(
    Currency.STX,
    BigInt(100 * 1e8), // all decimals are multiplied by 1e8
    Currency.ALEX
  );
  console.log('Amount to receive:', Number(amountTo) / 1e8);

  // To get the transaction to broadcast
  const tx = await alex.runSwap(
    stxAddress,
    Currency.STX,
    Currency.ALEX,
    BigInt(Number(amount) * 1e8),
    BigInt(0)
  );

  // Then broadcast the transaction yourself
  await openContractCall(tx);

  // Get the latest prices for all supported currencies
  const latestPrices = await alex.getLatestPrices();
  console.log('Latest prices:', latestPrices);

  // Get balances for a specific STX address
  const stxAddress = 'SM2MARAVW6BEJCD13YV2RHGYHQWT7TDDNMNRB1MVT';
  const balances = await alex.getBalances(stxAddress);
  console.log('Balances:', balances);

  // Fetch information about all swappable currencies
  const swappableCurrencies = await alex.fetchSwappableCurrency();
  console.log('Swappable currencies:', swappableCurrencies);    
})();
```

There is a fully working example in the [alex-sdk-example](https://github.com/alexgo-io/alex-sdk-example).

## Contributing

Contributions to the project are welcome. Please fork the repository, make your changes, and submit a pull request. Ensure your changes follow the code style and conventions used.
