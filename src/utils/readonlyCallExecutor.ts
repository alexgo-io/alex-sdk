import {
  fetchCallReadOnlyFunction,
  type ClarityValue,
  type ReadOnlyFunctionOptions,
} from '@stacks/transactions';
import { configs } from '../config';
import { STACKS_MAINNET } from '@stacks/network';
import type {
  ParameterObjOfDescriptor,
  ReadonlyFunctionDescriptor,
  ReturnTypeOfDescriptor,
} from 'clarity-codegen';
import { AlexContracts } from '../generated/smartContract/contracts_Alex';

type Contracts = typeof AlexContracts;

type ReadonlyCallExecutor = (
  options: Pick<
    ReadOnlyFunctionOptions,
    'functionArgs' | 'functionName' | 'contractName' | 'contractAddress'
  >
) => Promise<ClarityValue>;

const defaultReadonlyCallExecutor: ReadonlyCallExecutor = async (options) => {
  return fetchCallReadOnlyFunction({
    ...options,
    senderAddress: configs.CONTRACT_DEPLOYER,
    network: {
      ...STACKS_MAINNET,
      client: {
        ...STACKS_MAINNET.client,
        baseUrl: configs.READONLY_CALL_API_HOST,
      },
    },
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
    contractAddress: contractName === 'alex-amm-pool-v2-01-get-helper' ? configs.QUOTE_CONTRACT_DEPLOYER : configs.CONTRACT_DEPLOYER,
  });
  return functionDescriptor.output.decode(result);
}
