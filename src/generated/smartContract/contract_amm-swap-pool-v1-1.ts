
import {
defineContract,
principalT,
numberT,
optionalT,
responseSimpleT,
tupleT,
booleanT,
noneT
} from "../smartContractHelpers/codegenImport"

export const ammSwapPoolV11 = defineContract({
"amm-swap-pool-v1-1": {
  'add-to-position': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'max-dy', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(tupleT({ dx: numberT, dy: numberT, supply: numberT }, ), ),
    mode: 'public'
  },
  'create-pool': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'pool-owner', type: principalT },
      { name: 'dx', type: numberT },
      { name: 'dy', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  pause: {
    input: [ { name: 'new-paused', type: booleanT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'reduce-position': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'percent', type: numberT }
    ],
    output: responseSimpleT(tupleT({ dx: numberT, dy: numberT }, ), ),
    mode: 'public'
  },
  'set-contract-owner': {
    input: [ { name: 'owner', type: principalT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-end-block': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'new-end-block', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-fee-rate-x': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'fee-rate-x', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-fee-rate-y': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'fee-rate-y', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-fee-rebate': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'fee-rebate', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-max-in-ratio': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'new-max-in-ratio', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-max-out-ratio': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'new-max-out-ratio', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-oracle-average': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'new-oracle-average', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-oracle-enabled': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'enabled', type: booleanT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-pool-owner': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'pool-owner', type: principalT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-start-block': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'new-start-block', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-switch-threshold': {
    input: [ { name: 'new-threshold', type: numberT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-threshold-x': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'new-threshold', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-threshold-y': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'new-threshold', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'swap-helper': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'min-dy', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'public'
  },
  'swap-helper-a': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'token-z-trait', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'min-dz', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'public'
  },
  'swap-helper-b': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'token-z-trait', type: principalT },
      { name: 'token-w-trait', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT },
      { name: 'factor-z', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'min-dw', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'public'
  },
  'swap-helper-c': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'token-z-trait', type: principalT },
      { name: 'token-w-trait', type: principalT },
      { name: 'token-v-trait', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT },
      { name: 'factor-z', type: numberT },
      { name: 'factor-w', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'min-dv', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'public'
  },
  'swap-x-for-y': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'min-dy', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(tupleT({ dx: numberT, dy: numberT }, ), ),
    mode: 'public'
  },
  'swap-y-for-x': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dy', type: numberT },
      { name: 'min-dx', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(tupleT({ dx: numberT, dy: numberT }, ), ),
    mode: 'public'
  },
  'check-pool-status': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'readonly'
  },
  'fee-helper': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'fee-helper-a': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'fee-helper-b': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'token-w', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT },
      { name: 'factor-z', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'fee-helper-c': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'token-w', type: principalT },
      { name: 'token-v', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT },
      { name: 'factor-z', type: numberT },
      { name: 'factor-w', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-balances': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(tupleT({ 'balance-x': numberT, 'balance-y': numberT }, ), ),
    mode: 'readonly'
  },
  'get-contract-owner': {
    input: [],
    output: responseSimpleT(principalT, ),
    mode: 'readonly'
  },
  'get-end-block': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-fee-rate-x': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-fee-rate-y': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-fee-rebate': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-helper': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dx', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-helper-a': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT },
      { name: 'dx', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-helper-b': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'token-w', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT },
      { name: 'factor-z', type: numberT },
      { name: 'dx', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-helper-c': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'token-w', type: principalT },
      { name: 'token-v', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'factor-y', type: numberT },
      { name: 'factor-z', type: numberT },
      { name: 'factor-w', type: numberT },
      { name: 'dx', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-invariant': {
    input: [
      { name: 'balance-x', type: numberT },
      { name: 'balance-y', type: numberT },
      { name: 't', type: numberT }
    ],
    output: numberT,
    mode: 'readonly'
  },
  'get-max-in-ratio': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-max-out-ratio': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-oracle-average': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-oracle-enabled': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'readonly'
  },
  'get-oracle-instant': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-oracle-resilient': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-pool-details': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(tupleT({
      'balance-x': numberT,
      'balance-y': numberT,
      'end-block': numberT,
      'fee-rate-x': numberT,
      'fee-rate-y': numberT,
      'fee-rebate': numberT,
      'max-in-ratio': numberT,
      'max-out-ratio': numberT,
      'oracle-average': numberT,
      'oracle-enabled': booleanT,
      'oracle-resilient': numberT,
      'pool-id': numberT,
      'pool-owner': principalT,
      'start-block': numberT,
      'threshold-x': numberT,
      'threshold-y': numberT,
      'total-supply': numberT
    }, ), ),
    mode: 'readonly'
  },
  'get-pool-details-by-id': {
    input: [ { name: 'pool-id', type: numberT } ],
    output: responseSimpleT(tupleT({ factor: numberT, 'token-x': principalT, 'token-y': principalT }, ), ),
    mode: 'readonly'
  },
  'get-pool-exists': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: optionalT(tupleT({
      'balance-x': numberT,
      'balance-y': numberT,
      'end-block': numberT,
      'fee-rate-x': numberT,
      'fee-rate-y': numberT,
      'fee-rebate': numberT,
      'max-in-ratio': numberT,
      'max-out-ratio': numberT,
      'oracle-average': numberT,
      'oracle-enabled': booleanT,
      'oracle-resilient': numberT,
      'pool-id': numberT,
      'pool-owner': principalT,
      'start-block': numberT,
      'threshold-x': numberT,
      'threshold-y': numberT,
      'total-supply': numberT
    }, ), ),
    mode: 'readonly'
  },
  'get-pool-owner': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(principalT, ),
    mode: 'readonly'
  },
  'get-position-given-burn': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'token-amount', type: numberT }
    ],
    output: responseSimpleT(tupleT({ dx: numberT, dy: numberT }, ), ),
    mode: 'readonly'
  },
  'get-position-given-mint': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'token-amount', type: numberT }
    ],
    output: responseSimpleT(tupleT({ dx: numberT, dy: numberT }, ), ),
    mode: 'readonly'
  },
  'get-price': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-start-block': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-switch-threshold': { input: [], output: numberT, mode: 'readonly' },
  'get-threshold-x': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-threshold-y': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-token-given-position': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'max-dy', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(tupleT({ dy: numberT, token: numberT }, ), ),
    mode: 'readonly'
  },
  'get-x-given-price': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'price', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-x-given-y': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dy', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-x-in-given-y-out': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dy', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-y-given-price': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'price', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-y-given-x': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dx', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-y-in-given-x-out': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'factor', type: numberT },
      { name: 'dx', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'is-paused': { input: [], output: booleanT, mode: 'readonly' },
  'pools-data-map': {
    input: tupleT({ factor: numberT, 'token-x': principalT, 'token-y': principalT }, ),
    output: optionalT(tupleT({
      'balance-x': numberT,
      'balance-y': numberT,
      'end-block': numberT,
      'fee-rate-x': numberT,
      'fee-rate-y': numberT,
      'fee-rebate': numberT,
      'max-in-ratio': numberT,
      'max-out-ratio': numberT,
      'oracle-average': numberT,
      'oracle-enabled': booleanT,
      'oracle-resilient': numberT,
      'pool-id': numberT,
      'pool-owner': principalT,
      'start-block': numberT,
      'threshold-x': numberT,
      'threshold-y': numberT,
      'total-supply': numberT
    }, ), ),
    mode: 'mapEntry'
  },
  'pools-id-map': {
    input: numberT,
    output: optionalT(tupleT({ factor: numberT, 'token-x': principalT, 'token-y': principalT }, ), ),
    mode: 'mapEntry'
  },
  'contract-owner': { input: noneT, output: principalT, mode: 'variable' },
  paused: { input: noneT, output: booleanT, mode: 'variable' },
  'pool-nonce': { input: noneT, output: numberT, mode: 'variable' },
  'switch-threshold': { input: noneT, output: numberT, mode: 'variable' }
}
} as const)


