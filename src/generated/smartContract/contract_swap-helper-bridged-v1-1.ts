
import {
defineContract,
principalT,
numberT,
optionalT,
responseSimpleT,
listT
} from "../smartContractHelpers/codegenImport"

export const swapHelperBridgedV11 = defineContract({
"swap-helper-bridged-v1-1": {
  'swap-helper-from-amm': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'token-z-trait', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'min-dz', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'public'
  },
  'swap-helper-to-amm': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'token-z-trait', type: principalT },
      { name: 'factor-y', type: numberT },
      { name: 'dx', type: numberT },
      { name: 'min-dz', type: optionalT(numberT, ) }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'public'
  },
  'fee-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'fee-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: numberT },
      { name: 'dx', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'get-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: numberT },
      { name: 'dx', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'oracle-instant-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'oracle-instant-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'oracle-resilient-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'oracle-resilient-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: numberT }
    ],
    output: responseSimpleT(numberT, ),
    mode: 'readonly'
  },
  'route-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: numberT }
    ],
    output: responseSimpleT(listT(principalT, ), ),
    mode: 'readonly'
  },
  'route-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: numberT }
    ],
    output: responseSimpleT(listT(principalT, ), ),
    mode: 'readonly'
  }
}
} as const)


