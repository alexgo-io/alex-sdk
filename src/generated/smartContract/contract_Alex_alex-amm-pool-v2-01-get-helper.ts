import {
  defineContract,
  principalT,
  uintT,
  responseSimpleT,
} from '../smartContractHelpers/codegenImport';

export const alexAmmPoolV201GetHelper = defineContract({
  'alex-amm-pool-v2-01-get-helper': {
    'get-helper-with-fee': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-helper-with-fee-a': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'token-z', type: principalT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'dx', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-helper-with-fee-b': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'token-z', type: principalT },
        { name: 'token-w', type: principalT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'factor-z', type: uintT },
        { name: 'dx', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-helper-with-fee-c': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'token-z', type: principalT },
        { name: 'token-w', type: principalT },
        { name: 'token-v', type: principalT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'factor-z', type: uintT },
        { name: 'factor-w', type: uintT },
        { name: 'dx', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
  },
} as const);
