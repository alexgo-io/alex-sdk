import { ReadonlyCallExecutor } from '../index';
import { callReadOnlyFunction } from '@stacks/transactions';
import { API_HOST, CONTRACT_DEPLOYER } from '../config';
import { StacksMainnet } from '@stacks/network';

export const defaultReadonlyCallExecutor: ReadonlyCallExecutor = async (
  options
) => {
  return callReadOnlyFunction({
    ...options,
    senderAddress: CONTRACT_DEPLOYER,
    network: new StacksMainnet({
      url: API_HOST,
    }),
  });
};
