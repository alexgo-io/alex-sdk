import {
  defineContract,
  traitT,
  uintT,
  principalT,
  responseSimpleT,
  booleanT,
  optionalT,
} from '../smartContractHelpers/codegenImport';

export const sponsorDexV01 = defineContract({
  'sponsor-dex-v01': {
    claim: {
      input: [
        { name: 'token', type: traitT },
        { name: 'amount', type: uintT },
        { name: 'recipient', type: principalT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'swap-helper': {
      input: [
        { name: 'token-x', type: traitT },
        { name: 'token-y', type: traitT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dy', type: optionalT(uintT) },
        { name: 'fee', type: uintT },
      ],
      output: responseSimpleT(responseSimpleT(uintT)),
      mode: 'public',
    },
    'swap-helper-a': {
      input: [
        { name: 'token-x', type: traitT },
        { name: 'token-y', type: traitT },
        { name: 'token-z', type: traitT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dz', type: optionalT(uintT) },
        { name: 'fee', type: uintT },
      ],
      output: responseSimpleT(responseSimpleT(uintT)),
      mode: 'public',
    },
    'swap-helper-b': {
      input: [
        { name: 'token-x', type: traitT },
        { name: 'token-y', type: traitT },
        { name: 'token-z', type: traitT },
        { name: 'token-w', type: traitT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'factor-z', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dw', type: optionalT(uintT) },
        { name: 'fee', type: uintT },
      ],
      output: responseSimpleT(responseSimpleT(uintT)),
      mode: 'public',
    },
    'swap-helper-c': {
      input: [
        { name: 'token-x', type: traitT },
        { name: 'token-y', type: traitT },
        { name: 'token-z', type: traitT },
        { name: 'token-w', type: traitT },
        { name: 'token-v', type: traitT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'factor-z', type: uintT },
        { name: 'factor-w', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dv', type: optionalT(uintT) },
        { name: 'fee', type: uintT },
      ],
      output: responseSimpleT(responseSimpleT(uintT)),
      mode: 'public',
    },
    'is-dao-or-extension': {
      input: [],
      output: responseSimpleT(booleanT),
      mode: 'readonly',
    },
  },
} as const);
