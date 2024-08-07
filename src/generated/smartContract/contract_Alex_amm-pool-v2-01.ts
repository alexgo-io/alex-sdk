import {
  defineContract,
  traitT,
  uintT,
  optionalT,
  responseSimpleT,
  tupleT,
  principalT,
  booleanT,
  noneT,
} from '../smartContractHelpers/codegenImport';

export const ammPoolV201 = defineContract({
  'amm-pool-v2-01': {
    'add-to-position': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'max-dy', type: optionalT(uintT) },
      ],
      output: responseSimpleT(tupleT({ dx: uintT, dy: uintT, supply: uintT })),
      mode: 'public',
    },
    'create-pool': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'factor', type: uintT },
        { name: 'pool-owner', type: principalT },
        { name: 'dx', type: uintT },
        { name: 'dy', type: uintT },
      ],
      output: responseSimpleT(tupleT({ dx: uintT, dy: uintT, supply: uintT })),
      mode: 'public',
    },
    pause: {
      input: [{ name: 'new-paused', type: booleanT }],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'reduce-position': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'factor', type: uintT },
        { name: 'percent', type: uintT },
      ],
      output: responseSimpleT(tupleT({ dx: uintT, dy: uintT })),
      mode: 'public',
    },
    'set-end-block': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'new-end-block', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-fee-rate-x': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'fee-rate-x', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-fee-rate-y': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'fee-rate-y', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-max-in-ratio': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'new-max-in-ratio', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-max-out-ratio': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'new-max-out-ratio', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-oracle-average': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'new-oracle-average', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-oracle-enabled': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'enabled', type: booleanT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-start-block': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'new-start-block', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-threshold-x': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'new-threshold', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'set-threshold-y': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'new-threshold', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'public',
    },
    'swap-helper': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dy', type: optionalT(uintT) },
      ],
      output: responseSimpleT(uintT),
      mode: 'public',
    },
    'swap-helper-a': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'token-z-trait', type: traitT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dz', type: optionalT(uintT) },
      ],
      output: responseSimpleT(uintT),
      mode: 'public',
    },
    'swap-helper-b': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'token-z-trait', type: traitT },
        { name: 'token-w-trait', type: traitT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'factor-z', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dw', type: optionalT(uintT) },
      ],
      output: responseSimpleT(uintT),
      mode: 'public',
    },
    'swap-helper-c': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'token-z-trait', type: traitT },
        { name: 'token-w-trait', type: traitT },
        { name: 'token-v-trait', type: traitT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'factor-z', type: uintT },
        { name: 'factor-w', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dv', type: optionalT(uintT) },
      ],
      output: responseSimpleT(uintT),
      mode: 'public',
    },
    'swap-x-for-y': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'min-dy', type: optionalT(uintT) },
      ],
      output: responseSimpleT(tupleT({ dx: uintT, dy: uintT })),
      mode: 'public',
    },
    'swap-y-for-x': {
      input: [
        { name: 'token-x-trait', type: traitT },
        { name: 'token-y-trait', type: traitT },
        { name: 'factor', type: uintT },
        { name: 'dy', type: uintT },
        { name: 'min-dx', type: optionalT(uintT) },
      ],
      output: responseSimpleT(tupleT({ dx: uintT, dy: uintT })),
      mode: 'public',
    },
    'check-pool-status': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'readonly',
    },
    'fee-helper': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'fee-helper-a': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'token-z', type: principalT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'fee-helper-b': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'token-z', type: principalT },
        { name: 'token-w', type: principalT },
        { name: 'factor-x', type: uintT },
        { name: 'factor-y', type: uintT },
        { name: 'factor-z', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'fee-helper-c': {
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
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-balances': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(
        tupleT({ 'balance-x': uintT, 'balance-y': uintT })
      ),
      mode: 'readonly',
    },
    'get-end-block': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-fee-rate-x': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-fee-rate-y': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-fee-rebate': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-helper': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-helper-a': {
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
    'get-helper-b': {
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
    'get-helper-c': {
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
    'get-invariant': {
      input: [
        { name: 'balance-x', type: uintT },
        { name: 'balance-y', type: uintT },
        { name: 't', type: uintT },
      ],
      output: uintT,
      mode: 'readonly',
    },
    'get-max-in-ratio': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-max-out-ratio': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-max-ratio-limit': { input: [], output: uintT, mode: 'readonly' },
    'get-oracle-average': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-oracle-enabled': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(booleanT),
      mode: 'readonly',
    },
    'get-oracle-instant': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-oracle-resilient': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-pool-details': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(
        tupleT({
          'balance-x': uintT,
          'balance-y': uintT,
          'end-block': uintT,
          'fee-rate-x': uintT,
          'fee-rate-y': uintT,
          'fee-rebate': uintT,
          'max-in-ratio': uintT,
          'max-out-ratio': uintT,
          'oracle-average': uintT,
          'oracle-enabled': booleanT,
          'oracle-resilient': uintT,
          'pool-id': uintT,
          'pool-owner': principalT,
          'start-block': uintT,
          'threshold-x': uintT,
          'threshold-y': uintT,
          'total-supply': uintT,
        })
      ),
      mode: 'readonly',
    },
    'get-pool-details-by-id': {
      input: [{ name: 'pool-id', type: uintT }],
      output: responseSimpleT(
        tupleT({ factor: uintT, 'token-x': principalT, 'token-y': principalT })
      ),
      mode: 'readonly',
    },
    'get-pool-exists': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: optionalT(
        tupleT({
          'balance-x': uintT,
          'balance-y': uintT,
          'end-block': uintT,
          'fee-rate-x': uintT,
          'fee-rate-y': uintT,
          'fee-rebate': uintT,
          'max-in-ratio': uintT,
          'max-out-ratio': uintT,
          'oracle-average': uintT,
          'oracle-enabled': booleanT,
          'oracle-resilient': uintT,
          'pool-id': uintT,
          'pool-owner': principalT,
          'start-block': uintT,
          'threshold-x': uintT,
          'threshold-y': uintT,
          'total-supply': uintT,
        })
      ),
      mode: 'readonly',
    },
    'get-pool-owner': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(principalT),
      mode: 'readonly',
    },
    'get-position-given-burn': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'token-amount', type: uintT },
      ],
      output: responseSimpleT(tupleT({ dx: uintT, dy: uintT })),
      mode: 'readonly',
    },
    'get-position-given-mint': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'token-amount', type: uintT },
      ],
      output: responseSimpleT(tupleT({ dx: uintT, dy: uintT })),
      mode: 'readonly',
    },
    'get-price': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-start-block': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-switch-threshold': { input: [], output: uintT, mode: 'readonly' },
    'get-threshold-x': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-threshold-y': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-token-given-position': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
        { name: 'max-dy', type: optionalT(uintT) },
      ],
      output: responseSimpleT(tupleT({ dy: uintT, token: uintT })),
      mode: 'readonly',
    },
    'get-x-given-price': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'price', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-x-given-y': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'dy', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-x-in-given-y-out': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'dy', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-y-given-price': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'price', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-y-given-x': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'get-y-in-given-x-out': {
      input: [
        { name: 'token-x', type: principalT },
        { name: 'token-y', type: principalT },
        { name: 'factor', type: uintT },
        { name: 'dx', type: uintT },
      ],
      output: responseSimpleT(uintT),
      mode: 'readonly',
    },
    'is-blocklisted-or-default': {
      input: [{ name: 'sender', type: principalT }],
      output: booleanT,
      mode: 'readonly',
    },
    'is-dao-or-extension': {
      input: [],
      output: responseSimpleT(booleanT),
      mode: 'readonly',
    },
    'is-paused': { input: [], output: booleanT, mode: 'readonly' },
    paused: { input: noneT, output: booleanT, mode: 'variable' },
  },
} as const);
