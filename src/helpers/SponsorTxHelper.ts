import { AlexSDKError, AlexErrorType } from '../errors'
import { FungibleConditionCode } from '@stacks/transactions';
import { configs } from '../config';
import type { Currency } from '../currency';
import type { PoolData, TokenInfo } from '../types';
import {
  resolveAmmRoute,
  type AMMRoute,
  type AMMRouteSegment,
} from '../utils/ammRouteResolver';
import { hasLength } from '../utils/arrayHelper';
import { transferFactory } from '../utils/postConditions';
import { composeTx, type TxToBroadCast } from './SwapHelper';

let sponsorData:
  | Promise<{ status: 'ok' | string; perRouteFee: bigint }>
  | undefined;

export function getSponsorData(): Promise<{
  status: 'ok' | string;
  perRouteFee: bigint;
}> {
  if (sponsorData == null) {
    sponsorData = fetch(configs.SPONSORED_TX_STATUS, {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => ({
        status: data.status,
        perRouteFee: BigInt(data.per_route_fee),
      }));
  }
  return sponsorData;
}

export const requiredStxAmountForSponsorTx = async (
  _from: Currency,
  _to: Currency,
  customRoute: AMMRoute
): Promise<bigint> => {
  // we need to convert the fee to the same unit as the amount
  const feePerSegment = await getSponsorData().then(
    (data) => (data.perRouteFee * BigInt(1e8)) / BigInt(1e6)
  );
  return BigInt(customRoute.length) * feePerSegment;
};

export function runSponsoredSpotTx(
  stxAddress: string,
  currencyX: Currency,
  currencyY: Currency,
  totalAmount: bigint,
  minDy: bigint,
  feeAmount: bigint,
  ammPools: PoolData[],
  mappings: TokenInfo[],
  customRoute?: AMMRouteSegment[]
): TxToBroadCast {
  const fromAmount = totalAmount - feeAmount;
  const ammRoute =
    customRoute ?? resolveAmmRoute(currencyX, currencyY, ammPools);
  const getContractId = (currency: Currency) => {
    const mapping = mappings.find((x) => x.id === currency);
    if (!mapping) {
      throw new AlexSDKError(AlexErrorType.TokenMappingNotFound, 'Token Mapping Not Found', 404, `Token mapping not found for currency: ${currency}`);
    }
    return mapping.wrapToken.split('::')[0] as `${string}.${string}`;
  };
  const AlexVault = `${configs.CONTRACT_DEPLOYER}.amm-vault-v2-01`;
  if (ammRoute.length === 0) {
    throw new AlexSDKError(AlexErrorType.RouteNotFound, 'Route Not Found', 404, "Can't find AMM route");
  }

  const transfer = transferFactory(mappings);

  if (hasLength(ammRoute, 1)) {
    const [segment] = ammRoute;
    return composeTx(
      'sponsor-dex-v01',
      'swap-helper',
      {
        'token-x': getContractId(currencyX),
        'token-y': getContractId(segment.neighbour),
        factor: segment.pool.factor,
        dx: fromAmount,
        'min-dy': minDy,
        fee: feeAmount,
      },
      [
        transfer(
          stxAddress,
          currencyX,
          totalAmount,
          FungibleConditionCode.LessEqual
        ),
        transfer(
          AlexVault,
          currencyY,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  if (hasLength(ammRoute, 2)) {
    const [segment1, segment2] = ammRoute;
    return composeTx(
      'sponsor-dex-v01',
      'swap-helper-a',
      {
        'token-x': getContractId(currencyX),
        'token-y': getContractId(segment1.neighbour),
        'token-z': getContractId(segment2.neighbour),
        'factor-x': segment1.pool.factor,
        'factor-y': segment2.pool.factor,
        dx: fromAmount,
        'min-dz': minDy,
        fee: feeAmount,
      },
      [
        transfer(
          stxAddress,
          currencyX,
          totalAmount,
          FungibleConditionCode.LessEqual
        ),
        transfer(
          AlexVault,
          segment1.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          segment1.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          currencyY,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  if (hasLength(ammRoute, 3)) {
    const [segment1, segment2, segment3] = ammRoute;
    return composeTx(
      'sponsor-dex-v01',
      'swap-helper-b',
      {
        'token-x': getContractId(currencyX),
        'token-y': getContractId(segment1.neighbour),
        'token-z': getContractId(segment2.neighbour),
        'token-w': getContractId(segment3.neighbour),
        'factor-x': segment1.pool.factor,
        'factor-y': segment2.pool.factor,
        'factor-z': segment3.pool.factor,
        dx: fromAmount,
        'min-dw': minDy,
        fee: feeAmount,
      },
      [
        transfer(stxAddress, currencyX, totalAmount),
        transfer(
          AlexVault,
          segment1.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          segment1.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          segment2.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          segment2.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          currencyY,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  if (hasLength(ammRoute, 4)) {
    const [segment1, segment2, segment3, segment4] = ammRoute;
    return composeTx(
      'sponsor-dex-v01',
      'swap-helper-c',
      {
        'token-x': getContractId(currencyX),
        'token-y': getContractId(segment1.neighbour),
        'token-z': getContractId(segment2.neighbour),
        'token-w': getContractId(segment3.neighbour),
        'token-v': getContractId(segment4.neighbour),
        'factor-x': segment1.pool.factor,
        'factor-y': segment2.pool.factor,
        'factor-z': segment3.pool.factor,
        'factor-w': segment4.pool.factor,
        dx: fromAmount,
        'min-dv': minDy,
        fee: feeAmount,
      },
      [
        transfer(stxAddress, currencyX, totalAmount),
        transfer(
          AlexVault,
          segment1.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          segment1.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          segment2.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          segment2.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          segment3.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          segment3.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          currencyY,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  throw new AlexSDKError(AlexErrorType.TooManyPools, 'Route Too Complex', 422, 'Too many AMM pools in route: maximum supported is 4');
}

export enum SponsoredTxErrorCode {
  // The submitted tx payload is invalid
  'invalid_tx' = 'invalid_tx',
  // The requested contract / function aren't whitelisted
  'operation_not_supported' = 'operation_not_supported',
  // Current user already have a pending sponsored transaction
  'pending_operation_exists' = 'pending_operation_exists',
  // The requested tx exceed the capacity of the pool
  'capacity_exceed' = 'capacity_exceed',
  // Current user have pending operation, we require the submitted nonce to be immediate nonce
  'invalid_nonce' = 'invalid_nonce',
  // Worker failed to broadcast the tx
  'broadcast_error' = 'broadcast_error',
  // Insufficient funds to cover sponsor fee
  'insufficient_funds' = 'insufficient_funds',
  'unknown_error' = 'unknown_error',
}

export class SponsoredTxError extends Error {
  constructor(readonly code: SponsoredTxErrorCode, message: string) {
    super(message);
  }
}

export async function broadcastSponsoredTx(tx: string): Promise<string> {
  const response = await fetch(configs.SPONSORED_TX_EXECUTOR, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wrap_http_code: 'true',
      tx,
    }),
  });
  if (!response.ok) {
    throw new SponsoredTxError(
      SponsoredTxErrorCode.unknown_error,
      response.statusText
    );
  }
  const result = (await response.json()) as {
    http_code: number;
    code?: SponsoredTxErrorCode;
    message?: string;
    tx_id?: string;
  };
  if (result.http_code !== 200 || result.tx_id == null) {
    const message = result.message ?? 'Unknown Error';
    const errorCode = result.code ?? SponsoredTxErrorCode.unknown_error;
    throw new SponsoredTxError(errorCode, message);
  }
  return result.tx_id;
}
