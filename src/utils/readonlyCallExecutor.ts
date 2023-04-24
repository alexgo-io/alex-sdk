import { callReadOnlyFunction, ClarityValue } from '@stacks/transactions';
import { configs } from '../config';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
  ParameterObjOfDescriptor,
  ReadonlyFunctionDescriptor,
  ReturnTypeOfDescriptor,
} from 'clarity-codegen';
import { AlexContracts } from '../generated/smartContract/contracts_Alex';
import { ReadOnlyFunctionOptions } from '@stacks/transactions/src/builders';

type Contracts = typeof AlexContracts;

type ReadonlyCallExecutor = (
  options: Pick<
    ReadOnlyFunctionOptions,
    'functionArgs' | 'functionName' | 'contractName' | 'contractAddress'
  >
) => Promise<ClarityValue>;

const defaultReadonlyCallExecutor: ReadonlyCallExecutor = async (options) => {
  return callReadOnlyFunction({
    ...options,
    senderAddress: configs.CONTRACT_DEPLOYER,
    network: configs.IS_MAINNET
      ? new StacksMainnet({
          url: configs.API_HOST,
        })
      : new StacksTestnet({
          url: configs.API_HOST,
        }),
  });
};

export async function readonlyCall<
  T extends keyof Contracts,
  F extends keyof Contracts[T],
  Descriptor extends Contracts[T][F]
>(
  contractName: T,
  functionName: F,
  args: Descriptor extends ReadonlyFunctionDescriptor
    ? ParameterObjOfDescriptor<Descriptor>
    : never
): Promise<
  Descriptor extends ReadonlyFunctionDescriptor
    ? ReturnTypeOfDescriptor<Descriptor>
    : never
> {
  const functionDescriptor = AlexContracts[contractName][
    functionName
  ] as any as ReadonlyFunctionDescriptor;
  const clarityArgs = functionDescriptor.input.map((arg) =>
    arg.type.encode(args[arg.name])
  );
  const result = await defaultReadonlyCallExecutor({
    contractName,
    functionName: String(functionName),
    functionArgs: clarityArgs,
    contractAddress: configs.CONTRACT_DEPLOYER,
  });
  return functionDescriptor.output.decode(result);
}
