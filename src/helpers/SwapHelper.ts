import { AMMSwapPool } from '../utils/ammPool';
import { AlexVault, transfer } from '../utils/postConditions';
import {
  ClarityValue,
  FungibleConditionCode,
  FungiblePostCondition,
  STXPostCondition,
} from '@stacks/transactions';
import {
  OpenCallFunctionDescriptor,
  ParameterObjOfDescriptor,
  ReadonlyFunctionDescriptor,
  ReturnTypeOfDescriptor,
} from 'clarity-codegen';
import { AlexContracts } from '../generated/smartContract/contracts_Alex';
import { CONTRACT_DEPLOYER } from '../config';
import { Currency } from '../index';

export type TxToBroadCast = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  postConditions: Array<FungiblePostCondition | STXPostCondition>;
};

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
    contractAddress: CONTRACT_DEPLOYER,
    postConditions,
  };
};

export function runSpot(
  stxAddress: string,
  currencyX: Currency,
  currencyY: Currency,
  fromAmount: bigint,
  minDy: bigint,
  router: Currency[],
  ammPools: AMMSwapPool.PoolTokens[]
): TxToBroadCast {
  const ammRoute = AMMSwapPool.getRoute(currencyX, currencyY, ammPools);
  const middleSteps = router.slice(1, -1);
  if (ammRoute.length === 0) {
    const reachableInAMM = AMMSwapPool.reachableInAMM(
      currencyX,
      currencyY,
      ammPools
    );
    if (reachableInAMM.type === 'fromAmm') {
      return composeTx(
        'swap-helper-bridged',
        'swap-helper-from-amm',
        {
          'token-x-trait': reachableInAMM.tokenX,
          'token-y-trait': reachableInAMM.tokenY,
          'token-z-trait': reachableInAMM.tokenZ,
          dx: fromAmount,
          'min-dz': minDy,
          'factor-x': reachableInAMM.factorX,
        },
        [
          transfer(stxAddress, currencyX, fromAmount),
          ...middleSteps.flatMap((middle) => [
            transfer(
              AlexVault,
              middle,
              BigInt(0),
              FungibleConditionCode.GreaterEqual
            ),
            transfer(
              stxAddress,
              middle,
              BigInt(0),
              FungibleConditionCode.GreaterEqual
            ),
          ]),
          transfer(
            AlexVault,
            currencyY,
            minDy,
            FungibleConditionCode.GreaterEqual
          ),
        ]
      );
    }
    if (reachableInAMM.type === 'toAmm') {
      return composeTx(
        'swap-helper-bridged',
        'swap-helper-to-amm',
        {
          'token-x-trait': reachableInAMM.tokenX,
          'token-y-trait': reachableInAMM.tokenY,
          'token-z-trait': reachableInAMM.tokenZ,
          dx: fromAmount,
          'min-dz': minDy,
          'factor-y': reachableInAMM.factorY,
        },
        [
          transfer(stxAddress, currencyX, fromAmount),
          ...middleSteps.flatMap((middle) => [
            transfer(
              AlexVault,
              middle,
              BigInt(0),
              FungibleConditionCode.GreaterEqual
            ),
            transfer(
              stxAddress,
              middle,
              BigInt(0),
              FungibleConditionCode.GreaterEqual
            ),
          ]),
          transfer(
            AlexVault,
            currencyY,
            minDy,
            FungibleConditionCode.GreaterEqual
          ),
        ]
      );
    }
    return composeTx(
      'swap-helper-v1-03',
      'swap-helper',
      {
        'token-x-trait': currencyX,
        'token-y-trait': currencyY,
        dx: fromAmount,
        'min-dy': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        ...middleSteps.flatMap((middle) => [
          transfer(
            AlexVault,
            middle,
            BigInt(0),
            FungibleConditionCode.GreaterEqual
          ),
          transfer(
            stxAddress,
            middle,
            BigInt(0),
            FungibleConditionCode.GreaterEqual
          ),
        ]),
        transfer(
          AlexVault,
          currencyY,
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }
  if (ammRoute.length === 1) {
    return composeTx(
      'amm-swap-pool',
      'swap-helper',
      {
        'token-x-trait': currencyX,
        'token-y-trait': ammRoute[0]!.neighbour,
        factor: AMMSwapPool.getFactor(ammRoute[0]!.pool),
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
      'amm-swap-pool',
      'swap-helper-a',
      {
        'token-x-trait': currencyX,
        'token-y-trait': ammRoute[0]!.neighbour,
        'token-z-trait': ammRoute[1]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
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
      'amm-swap-pool',
      'swap-helper-b',
      {
        'token-x-trait': currencyX,
        'token-y-trait': ammRoute[0]!.neighbour,
        'token-z-trait': ammRoute[1]!.neighbour,
        'token-w-trait': ammRoute[2]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
        'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
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
      'amm-swap-pool',
      'swap-helper-c',
      {
        'token-x-trait': currencyX,
        'token-y-trait': ammRoute[0]!.neighbour,
        'token-z-trait': ammRoute[1]!.neighbour,
        'token-w-trait': ammRoute[2]!.neighbour,
        'token-v-trait': ammRoute[3]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
        'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
        'factor-w': AMMSwapPool.getFactor(ammRoute[3]!.pool),
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
