# Alex-SDK

Alex-SDK is an easy-to-use library that exposes the swap functionality from [alexlab.co](https://app.alexlab.co/swap) to be integrated into any app or wallet. It enables users to perform swaps with a wide variety of supported currencies.

## Installation

You can install Alex-SDK using npm:

```bash
npm install alex-sdk
```

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

(detailed list [here](./documentation.md)).

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
  
  // Get all possible routes for swapping currencies
  const allRoutes = await alex.getAllPossibleRoutes(Currency.STX, Currency.ALEX);
  console.log('All possible routes:', allRoutes);

  // Get way points
  const someRoute: AMMRoute = [x1, x2];
  const wayPoints = await sdk.getWayPoints(someRoute);
  console.log('Way points for the route:', wayPoints);
})();
```

There is a fully working example in the [alex-sdk-example](https://github.com/alexgo-io/alex-sdk-example).

## Contributing

Contributions to the project are welcome. Please fork the repository, make your changes, and submit a pull request. Ensure your changes follow the code style and conventions used.
