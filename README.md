# Alex-SDK

Alex-SDK is a easy-to-use library that exposes the swap functionality from [alexlab.co](https://app.alexlab.co/swap) to be integrated into any app or wallet. It enables users to perform swaps with a wide variety of supported currencies.

## Functions

The AlexSDK class includes the following functions:

```typescript
export declare class AlexSDK {
  // Get the list of currencies that can be swapped, the returned object would include the currency name, icon, and contract addresses.
  fetchSwappableCurrency(): Promise<TokenInfo>;

  // Get the swap fee (liquidity provider fee) between two currencies.
  getFeeRate(from: Currency, to: Currency): Promise<bigint>;

  // Get the route path for swapping between two currencies.
  getRoute(from: Currency, to: Currency): Promise<Currency[]>;

  // Get the amount of destination currency that will be received when swapping from one currency to another.
  getAmountTo(
    from: Currency,
    fromAmount: bigint,
    to: Currency
  ): Promise<bigint>;

  // Perform a swap between two currencies using the specified route and amount.
  runSwap(
    stxAddress: string,
    currencyX: Currency,
    currencyY: Currency,
    fromAmount: bigint,
    minDy: bigint,
    router: Currency[]
  ): TxToBroadCast;

  // Get currencies' latest price
  getLatestPrices(): Promise<
    Partial<{
      [currency in Currency]: number;
    }>
  >;

  // Get the corresponding token balanace for a given address.
  getBalances(stxAddress: string): Promise<
    Partial<{
      [currency in Currency]: bigint;
    }>
  >;
}
```

## Usage

```typescript
import { AlexSDK, Currency } from 'alex-sdk';

const alex = new AlexSDK();

(async () => {
  // Get swap fee between STX and ALEX
  const feeRate = await alex.getFeeRate(Currency.STX, Currency.ALEX);
  console.log('Swap fee:', feeRate);

  // Get the route path for swapping STX to ALEX
  const route = await alex.getRoute(Currency.STX, Currency.ALEX);
  console.log('Route path:', route);

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
    BigInt(0),
    route
  );

  // Then broadcast the transaction yourself
  await openContractCall(tx);
})();
```

There is a fully working example in the [alex-sdk-example](https://github.com/alexgo-io/alex-sdk-example)

## Contributing

Contributions to the project are welcome. Please fork the repository, make your changes, and submit a pull request. Ensure your changes follow the code style and conventions used
