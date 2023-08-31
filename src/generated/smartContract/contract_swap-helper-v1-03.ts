
import {
defineContract,
principalT,
uintT,
optionalT,
responseSimpleT,
listT,
tupleT
} from "../smartContractHelpers/codegenImport"

export const swapHelperV103 = defineContract({
"swap-helper-v1-03": {
  'swap-helper': {
    input: [
      { name: 'token-x-trait', type: principalT },
      { name: 'token-y-trait', type: principalT },
      { name: 'dx', type: uintT },
      { name: 'min-dy', type: optionalT(uintT, ) }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'public'
  },
  'fee-helper': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-given-helper': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'dy', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-helper': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT },
      { name: 'dx', type: uintT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'oracle-instant-helper': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'oracle-resilient-helper': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'route-helper': {
    input: [
      { name: 'token-x', type: principalT },
      { name: 'token-y', type: principalT }
    ],
    output: responseSimpleT(listT(principalT, ), ),
    mode: 'readonly'
  },
  'fwp-oracle-resilient-map': {
    input: tupleT({ 'token-x': principalT, 'token-y': principalT }, ),
    output: optionalT(uintT, ),
    mode: 'mapEntry'
  },
  'simple-oracle-resilient-map': {
    input: tupleT({ 'token-x': principalT, 'token-y': principalT }, ),
    output: optionalT(uintT, ),
    mode: 'mapEntry'
  }
}
} as const)


