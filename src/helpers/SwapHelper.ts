import { AMMSwapPool } from '../utils/ammPool';
import { transfer } from '../utils/postConditions';
import {
  ClarityValue,
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
  router: Currency[],
  ammPools: AMMSwapPool.PoolTokens[],
  ammV1_1Pools: AMMSwapPool.PoolTokens[]
): TxToBroadCast {
  const middleSteps = router.slice(1, -1);
  const AlexVault = `${configs.CONTRACT_DEPLOYER}.alex-vault`;
  const AlexVaultV1_1 = `${configs.CONTRACT_DEPLOYER}.alex-vault-v1-1`;
  const ammV1_1Route = AMMSwapPool.getRoute(currencyX, currencyY, ammV1_1Pools);

  if (ammV1_1Route.length === 1) {
    return composeTx(
      'amm-swap-pool-v1-1',
      'swap-helper',
      {
        'token-x-trait': currencyX,
        'token-y-trait': ammV1_1Route[0]!.neighbour,
        factor: AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
        dx: fromAmount,
        'min-dy': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        transfer(
          AlexVaultV1_1,
          currencyY,
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }
  if (ammV1_1Route.length === 2) {
    return composeTx(
      'amm-swap-pool-v1-1',
      'swap-helper-a',
      {
        'token-x-trait': currencyX,
        'token-y-trait': ammV1_1Route[0]!.neighbour,
        'token-z-trait': ammV1_1Route[1]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
        dx: fromAmount,
        'min-dz': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        transfer(
          AlexVaultV1_1,
          ammV1_1Route[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammV1_1Route[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVaultV1_1,
          currencyY,
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }
  if (ammV1_1Route.length === 3) {
    return composeTx(
      'amm-swap-pool-v1-1',
      'swap-helper-b',
      {
        'token-x-trait': currencyX,
        'token-y-trait': ammV1_1Route[0]!.neighbour,
        'token-z-trait': ammV1_1Route[1]!.neighbour,
        'token-w-trait': ammV1_1Route[2]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
        'factor-z': AMMSwapPool.getFactor(ammV1_1Route[2]!.pool),
        dx: fromAmount,
        'min-dw': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        transfer(
          AlexVaultV1_1,
          ammV1_1Route[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammV1_1Route[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVaultV1_1,
          ammV1_1Route[1]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammV1_1Route[1]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVaultV1_1,
          currencyY,
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }
  if (ammV1_1Route.length === 4) {
    return composeTx(
      'amm-swap-pool-v1-1',
      'swap-helper-c',
      {
        'token-x-trait': currencyX,
        'token-y-trait': ammV1_1Route[0]!.neighbour,
        'token-z-trait': ammV1_1Route[1]!.neighbour,
        'token-w-trait': ammV1_1Route[2]!.neighbour,
        'token-v-trait': ammV1_1Route[3]!.neighbour,
        'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
        'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
        'factor-z': AMMSwapPool.getFactor(ammV1_1Route[2]!.pool),
        'factor-w': AMMSwapPool.getFactor(ammV1_1Route[3]!.pool),
        dx: fromAmount,
        'min-dv': minDy,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        transfer(
          AlexVaultV1_1,
          ammV1_1Route[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammV1_1Route[0]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVaultV1_1,
          ammV1_1Route[1]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammV1_1Route[1]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVaultV1_1,
          ammV1_1Route[2]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          stxAddress,
          ammV1_1Route[2]!.neighbour,
          BigInt(0),
          FungibleConditionCode.GreaterEqual
        ),
        transfer(
          AlexVaultV1_1,
          currencyY,
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

  const ammRoute = AMMSwapPool.getRoute(currencyX, currencyY, ammPools);
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

  const reachableInAMMV1_1 = AMMSwapPool.reachableInAMM(
    currencyX,
    currencyY,
    ammPools
  );
  if (reachableInAMMV1_1.type === 'fromAmm') {
    return composeTx(
      'swap-helper-bridged-v1-1',
      'swap-helper-from-amm',
      {
        'token-x-trait': reachableInAMMV1_1.tokenX,
        'token-y-trait': reachableInAMMV1_1.tokenY,
        'token-z-trait': reachableInAMMV1_1.tokenZ,
        dx: fromAmount,
        'min-dz': minDy,
        'factor-x': reachableInAMMV1_1.factorX,
      },
      [
        transfer(stxAddress, currencyX, fromAmount),
        ...middleSteps.flatMap((middle, index) => [
          transfer(
            index === 0 ? AlexVaultV1_1 : AlexVault,
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
  if (reachableInAMMV1_1.type === 'toAmm') {
    return composeTx(
      'swap-helper-bridged-v1-1',
      'swap-helper-to-amm',
      {
        'token-x-trait': reachableInAMMV1_1.tokenX,
        'token-y-trait': reachableInAMMV1_1.tokenY,
        'token-z-trait': reachableInAMMV1_1.tokenZ,
        dx: fromAmount,
        'min-dz': minDy,
        'factor-y': reachableInAMMV1_1.factorY,
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
          AlexVaultV1_1,
          currencyY,
          minDy,
          FungibleConditionCode.GreaterEqual
        ),
      ]
    );
  }

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
        ...middleSteps.flatMap((middle, index) => [
          transfer(
            index === 0 ? AlexVaultV1_1 : AlexVault,
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
          AlexVaultV1_1,
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
      transfer(AlexVault, currencyY, minDy, FungibleConditionCode.GreaterEqual),
    ]
  );
}
