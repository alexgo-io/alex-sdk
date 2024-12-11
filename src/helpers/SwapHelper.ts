import {
  type ClarityValue,
  FungibleConditionCode,
  type FungiblePostCondition,
  type StxPostCondition,
} from '@stacks/transactions';
import type {
  OpenCallFunctionDescriptor,
  ParameterObjOfDescriptor,
} from 'clarity-codegen';
import { AlexContracts } from '../generated/smartContract/contracts_Alex';
import { configs } from '../config';
import type { Currency } from '../currency';
import type { PoolData, TokenInfo } from '../types';
import {
  type AMMRouteSegment,
  resolveAmmRoute,
} from '../utils/ammRouteResolver';
import { transferFactory } from '../utils/postConditions';
import { hasLength } from '../utils/arrayHelper';

type Contracts = typeof AlexContracts;

export type TxToBroadCast = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions: Array<FungiblePostCondition | StxPostCondition>;
};

export const composeTx = <
  T extends keyof Contracts,
  F extends keyof Contracts[T],
  Descriptor extends Contracts[T][F]
>(
  contractName: T,
  functionName: F,
  args: Descriptor extends OpenCallFunctionDescriptor
    ? ParameterObjOfDescriptor<Descriptor>
    : never,
  postConditions: (FungiblePostCondition | StxPostCondition)[]
): TxToBroadCast => {
  const functionDescriptor = AlexContracts[contractName][
    functionName
  ] as OpenCallFunctionDescriptor;
  const clarityArgs = functionDescriptor.input.map((arg) =>
    arg.type.encode(args[arg.name])
  );
  return {
    contractName,
    functionName: String(functionName),
    functionArgs: clarityArgs,
    contractAddress: contractName === 'sponsor-dex-v01' ? configs.SPONSOR_TX_DEPLOYER : configs.CONTRACT_DEPLOYER,
    postConditions,
  };
};

export function runSpot(
  stxAddress: string,
  currencyX: Currency,
  currencyY: Currency,
  fromAmount: bigint,
  minDy: bigint,
  ammPools: PoolData[],
  mappings: TokenInfo[],
  customRoute?: AMMRouteSegment[]
): TxToBroadCast {
  const ammRoute =
    customRoute ?? resolveAmmRoute(currencyX, currencyY, ammPools);
  const getContractId = (currency: Currency) => {
    const mapping = mappings.find((x) => x.id === currency);
    if (!mapping) {
      throw new Error(`Token mapping not found for currency: ${currency}`);
    }
    return mapping.wrapToken.split('::')[0] as `${string}.${string}`;
  };
  const AlexVault = `${configs.CONTRACT_DEPLOYER}.amm-vault-v2-01`;
  if (ammRoute.length === 0) {
    throw new Error("Can't find AMM route");
  }

  const transfer = transferFactory(mappings);

  if (hasLength(ammRoute, 1)) {
    const [segment] = ammRoute;
    return composeTx(
      'amm-pool-v2-01',
      'swap-helper',
      {
        'token-x-trait': getContractId(currencyX),
        'token-y-trait': getContractId(segment.neighbour),
        factor: segment.pool.factor,
        dx: fromAmount,
        'min-dy': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        transfer(
          AlexVault,
          currencyY,
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  if (hasLength(ammRoute, 2)) {
    const [segment1, segment2] = ammRoute;
    return composeTx(
      'amm-pool-v2-01',
      'swap-helper-a',
      {
        'token-x-trait': getContractId(currencyX),
        'token-y-trait': getContractId(segment1.neighbour),
        'token-z-trait': getContractId(segment2.neighbour),
        'factor-x': segment1.pool.factor,
        'factor-y': segment2.pool.factor,
        dx: fromAmount,
        'min-dz': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
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
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  if (hasLength(ammRoute, 3)) {
    const [segment1, segment2, segment3] = ammRoute;
    return composeTx(
      'amm-pool-v2-01',
      'swap-helper-b',
      {
        'token-x-trait': getContractId(currencyX),
        'token-y-trait': getContractId(segment1.neighbour),
        'token-z-trait': getContractId(segment2.neighbour),
        'token-w-trait': getContractId(segment3.neighbour),
        'factor-x': segment1.pool.factor,
        'factor-y': segment2.pool.factor,
        'factor-z': segment3.pool.factor,
        dx: fromAmount,
        'min-dw': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
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
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  if (hasLength(ammRoute, 4)) {
    const [segment1, segment2, segment3, segment4] = ammRoute;
    return composeTx(
      'amm-pool-v2-01',
      'swap-helper-c',
      {
        'token-x-trait': getContractId(currencyX),
        'token-y-trait': getContractId(segment1.neighbour),
        'token-z-trait': getContractId(segment2.neighbour),
        'token-w-trait': getContractId(segment3.neighbour),
        'token-v-trait': getContractId(segment4.neighbour),
        'factor-x': segment1.pool.factor,
        'factor-y': segment2.pool.factor,
        'factor-z': segment3.pool.factor,
        'factor-w': segment4.pool.factor,
        dx: fromAmount,
        'min-dv': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
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
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  throw new Error('Too many AMM pools in route');
}
