import { Contracts } from '../index';
import { callReadOnlyFunction, ClarityValue } from '@stacks/transactions';
import { API_HOST, CONTRACT_DEPLOYER } from '../config';
import { StacksMainnet } from '@stacks/network';
import {
  ParameterObjOfDescriptor,
  ReadonlyFunctionDescriptor,
  ReturnTypeOfDescriptor,
} from 'clarity-codegen';
import { AlexContracts } from '../generated/smartContract/contracts_Alex';
import { ReadOnlyFunctionOptions } from '@stacks/transactions/src/builders';

type ReadonlyCallExecutor = (
  options: Pick<
    ReadOnlyFunctionOptions,
    'functionArgs' | 'functionName' | 'contractName' | 'contractAddress'
  >
) => Promise<ClarityValue>;

const defaultReadonlyCallExecutor: ReadonlyCallExecutor = async (options) => {
  return callReadOnlyFunction({
    ...options,
    senderAddress: CONTRACT_DEPLOYER,
    network: new StacksMainnet({
      url: API_HOST,
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
    contractAddress: CONTRACT_DEPLOYER,
  });
  return functionDescriptor.output.decode(result);
}
