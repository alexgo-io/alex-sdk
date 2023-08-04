# Alex-SDK

Alex-SDK is a easy-to-use library that exposes the swap functionality from [alexlab.co](https://app.alexlab.co/swap) to be integrated into any app or wallet. It enables users to perform swaps with a wide variety of supported currencies.

## Supported Currencies

The SDK supports the following currencies:

```javascript
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
```

## Functions

The AlexSDK class includes the following functions:

```javascript
export declare class AlexSDK {
    getFeeRate(from: Currency, to: Currency): Promise<bigint>;
    getRouter(from: Currency, to: Currency): Promise<Currency[]>;
    getAmountTo(from: Currency, fromAmount: bigint, to: Currency): Promise<bigint>;
    runSwap(stxAddress: string, currencyX: Currency, currencyY: Currency, fromAmount: bigint, minDy: bigint, router: Currency[]): TxToBroadCast;
    getCurrencyFrom(address: string): Currency | undefined;
}
```

### getFee
Rate
Get the swap fee (liquidity provider fee) between two currencies.

```javascript
async function getFeeRate(from: Currency, to: Currency): Promise<bigint>;
```

### getRouter

Get the router path for swapping between two currencies.

```javascript
async function getRouter(from: Currency, to: Currency): Promise<Currency[]>;
```

### getAmountTo

Get the amount of destination currency that will be received when swapping from one currency to another.

```javascript
async function getAmountTo(from: Currency, fromAmount: bigint, to: Currency): Promise<bigint>;
```

### runSwap

Perform a swap between two currencies using the specified route and amount.

```javascript
function runSwap(stxAddress: string, currencyX: Currency, currencyY: Currency, fromAmount: bigint, minDy: bigint, router: Currency[]): TxToBroadCast;
```

### getCurrencyFrom

Get the corresponding currency for a given address.

```javascript
function getCurrencyFrom(address: string): Currency | undefined;
```

### getAddressFrom

Get the corresponding currency for a given address.

```javascript
function getAddressFrom(currency: Exclude<Currency, Currency.STX>): string;
```

### isAlexSwapTransaction

Check if a transaction is a swap transaction from Alex
```javascript
function isAlexSwapTransaction(deployer: string, contractName: string, functionName: string): boolean;
```

### broadcastSponsoredTx

Broadcast a sponsored transaction to Alex's sponsored tx services
```javascript
function broadcastSponsoredTx(txRaw: string): Promise<string>;
````

### isSponsoredSwapEnabled

Check if alex's swap sponsor service is activated
```javascript
function isSponsoredSwapEnabled(): Promise<boolean>;
````

## Installation

You can install Alex-SDK using npm:

```bash
npm install alex-sdk
```

## Usage

To use the AlexSDK, you can import it into your project and instantiate a new object:

```javascript
import { AlexSDK, Currency } from 'alex-sdk';

const alex = new AlexSDK();

(async () => {
  // Get swap fee between ALEX and USDA
  const feeRate = await alex.getFeeRate(Currency.ALEX, Currency.USDA);
  console.log('Swap fee:', feeRate);

  // Get the router path for swapping ALEX to USDA
  const router = await alex.getRouter(Currency.ALEX, Currency.USDA);
  console.log('Router path:', router);

  // Get the amount of USDA that will be received when swapping 100 ALEX
  const amountTo = await alex.getAmountTo(
    Currency.ALEX,
    BigInt(100),
    Currency.USDA
  );
  console.log('Amount to receive:', amountTo);

  // To get the transaction to broadcast
  const tx = await alex.runSwap(
    stxAddress,
    Currency.ALEX,
    Currency.USDA,
    BigInt(Number(amount) * 1e8),
    BigInt(0),
    router
  );

  // Then broadcast the transaction yourself
  await openContractCall(tx);
})();
```

There is a fully working example in the [alex-sdk-example](https://github.com/alexgo-io/alex-sdk-example)

## Contributing

Contributions to the project are welcome. Please fork the repository, make your changes, and submit a pull request. Ensure your changes follow the code style and conventions used
