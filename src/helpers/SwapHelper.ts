import {
  FungibleConditionCode,
  FungiblePostCondition,
  STXPostCondition,
} from '@stacks/transactions';
import {
  OpenCallFunctionDescriptor,
  ParameterObjOfDescriptor,
} from 'clarity-codegen';
import { AlexContracts } from '../generated/smartContract/contracts_Alex';
import { configs } from '../config';
import { Currency } from '../currency';
import { PoolData, TokenInfo, TxToBroadCast } from '../types';
import { AMMRouteSegment, resolveAmmRoute } from '../utils/ammRouteResolver';
import { transferFactory } from '../utils/postConditions';

type Contracts = typeof AlexContracts;

const composeTx: <
  T extends keyof Contracts,
  F extends keyof Contracts[T],
  Descriptor extends Contracts[T][F]
>(
  contractName: T,
  functionName: F,
  args: Descriptor extends OpenCallFunctionDescriptor
    ? ParameterObjOfDescriptor<Descriptor>
    : never,
  postConditions: (FungiblePostCondition | STXPostCondition)[]
) => TxToBroadCast = (contractName, functionName, args, postConditions) => {
  const functionDescriptor = AlexContracts[contractName][
    functionName
  ] as any as OpenCallFunctionDescriptor;
  const clarityArgs = functionDescriptor.input.map((arg) =>
    arg.type.encode(args[arg.name])
  );
  return {
    contractName,
    functionName: String(functionName),
    functionArgs: clarityArgs,
    contractAddress: configs.CONTRACT_DEPLOYER,
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
  const getContractId = (currency: Currency) =>
    mappings
      .find((x) => x.id === currency)!
      .wrapToken.split('::')[0] as `${string}.${string}`;
  const AlexVault = `${configs.CONTRACT_DEPLOYER}.amm-vault-v2-01`;
  if (ammRoute.length === 0) {
    throw new Error("Can't find AMM route");
  }
  const transfer = transferFactory(mappings);
  if (ammRoute.length === 1) {
    return composeTx(
      'amm-pool-v2-01',
      'swap-helper',
      {
        'token-x-trait': getContractId(currencyX),
        'token-y-trait': getContractId(ammRoute[0]!.neighbour),
        factor: ammRoute[0]!.pool.factor,
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
  if (ammRoute.length === 2) {
    return composeTx(
      'amm-pool-v2-01',
      'swap-helper-a',
      {
        'token-x-trait': getContractId(currencyX),
        'token-y-trait': getContractId(ammRoute[0]!.neighbour),
        'token-z-trait': getContractId(ammRoute[1]!.neighbour),
        'factor-x': ammRoute[0]!.pool.factor,
        'factor-y': ammRoute[1]!.pool.factor,
        dx: fromAmount,
        'min-dz': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        transfer(
          AlexVault,
          ammRoute[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammRoute[0]!.neighbour,
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
  if (ammRoute.length === 3) {
    return composeTx(
      'amm-pool-v2-01',
      'swap-helper-b',
      {
        'token-x-trait': getContractId(currencyX),
        'token-y-trait': getContractId(ammRoute[0]!.neighbour),
        'token-z-trait': getContractId(ammRoute[1]!.neighbour),
        'token-w-trait': getContractId(ammRoute[2]!.neighbour),
        'factor-x': ammRoute[0]!.pool.factor,
        'factor-y': ammRoute[1]!.pool.factor,
        'factor-z': ammRoute[2]!.pool.factor,
        dx: fromAmount,
        'min-dw': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        transfer(
          AlexVault,
          ammRoute[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammRoute[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          ammRoute[1]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammRoute[1]!.neighbour,
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
  if (ammRoute.length === 4) {
    return composeTx(
      'amm-pool-v2-01',
      'swap-helper-c',
      {
        'token-x-trait': getContractId(currencyX),
        'token-y-trait': getContractId(ammRoute[0]!.neighbour),
        'token-z-trait': getContractId(ammRoute[1]!.neighbour),
        'token-w-trait': getContractId(ammRoute[2]!.neighbour),
        'token-v-trait': getContractId(ammRoute[3]!.neighbour),
        'factor-x': ammRoute[0]!.pool.factor,
        'factor-y': ammRoute[1]!.pool.factor,
        'factor-z': ammRoute[2]!.pool.factor,
        'factor-w': ammRoute[3]!.pool.factor,
        dx: fromAmount,
        'min-dv': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        transfer(
          AlexVault,
          ammRoute[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammRoute[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          ammRoute[1]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammRoute[1]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVault,
          ammRoute[2]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammRoute[2]!.neighbour,
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
