import {
  ClarityType,
  contractPrincipalCV,
  PrincipalCV,
  standardPrincipalCV,
} from '@stacks/transactions';
import { addressResult, contractResult, transcoders } from 'clarity-codegen';
import type { Decoder } from 'clarity-codegen/lib/runtime/types';
import { CONTRACT_DEPLOYER } from '../../config';

export * from 'clarity-codegen';

export function principalCV(principal: string): PrincipalCV {
  if (principal.includes('.')) {
    const [address, contractName] = principal.split('.');
    return contractPrincipalCV(address!, contractName!);
  }
  if (principal.startsWith('SP') || principal.startsWith('ST')) {
    return standardPrincipalCV(principal);
  }
  return contractPrincipalCV(CONTRACT_DEPLOYER, principal);
}

export const principleResult: Decoder<string> = (result) => {
  if (result.type === ClarityType.PrincipalStandard) {
    return addressResult(result);
  } else if (result.type === ClarityType.PrincipalContract) {
    return contractResult(result).split('.')[1];
  }
  throw new Error(`Expected principal, got ${result.type}`);
};

export const principalT = transcoders({
  encode: principalCV,
  decode: principleResult,
});
