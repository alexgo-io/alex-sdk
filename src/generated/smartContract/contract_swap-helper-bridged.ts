
import {
defineContract,
principalT,
uintT,
optionalT,
responseSimpleT,
listT
} from "../smartContractHelpers/codegenImport"

export const swapHelperBridged = defineContract({
"swap-helper-bridged": {
  'swap-helper-from-amm': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'token-z-trait', type: principalT },
      { name: 'factor-x', type: uintT },
      { name: 'dx', type: uintT },
      { name: 'min-dz', type: optionalT(uintT, ) }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'public'
  },
  'swap-helper-to-amm': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'token-z-trait', type: principalT },
      { name: 'factor-y', type: uintT },
      { name: 'dx', type: uintT },
      { name: 'min-dz', type: optionalT(uintT, ) }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'public'
  },
  'fee-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'fee-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: uintT },
      { name: 'dx', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: uintT },
      { name: 'dx', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'oracle-instant-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'oracle-instant-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'oracle-resilient-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'oracle-resilient-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'route-helper-from-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-x', type: uintT }
    ],
    output: responseSimpleT(listT(principalT, ), ),
    mode: 'readonly'
  },
  'route-helper-to-amm': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'token-z', type: principalT },
      { name: 'factor-y', type: uintT }
    ],
    output: responseSimpleT(listT(principalT, ), ),
    mode: 'readonly'
  }
}
} as const)


