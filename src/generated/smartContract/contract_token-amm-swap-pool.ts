
import {
defineContract,
principalT,
responseSimpleT,
booleanT,
uintT,
stringAsciiT,
optionalT,
stringT,
listT,
tupleT,
bufferT,
noneT
} from "../smartContractHelpers/codegenImport"

export const tokenAmmSwapPool = defineContract({
"token-amm-swap-pool": {
  'add-approved-contract': {
    input: [ { name: 'new-approved-contract', type: principalT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  burn: {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'amount', type: uintT },
      { name: 'sender', type: principalT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'burn-fixed': {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'amount', type: uintT },
      { name: 'sender', type: principalT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  mint: {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'amount', type: uintT },
      { name: 'recipient', type: principalT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'mint-fixed': {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'amount', type: uintT },
      { name: 'recipient', type: principalT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-approved-contract': {
    input: [
      { name: 'owner', type: principalT },
      { name: 'approved', type: booleanT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-contract-owner': {
    input: [ { name: 'owner', type: principalT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-decimals': {
    input: [ { name: 'new-decimals', type: uintT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-name': {
    input: [ { name: 'new-name', type: stringAsciiT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-symbol': {
    input: [ { name: 'new-symbol', type: stringAsciiT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-token-uri': {
    input: [ { name: 'new-uri', type: optionalT(stringT, ) } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'set-transferrable': {
    input: [ { name: 'new-transferrable', type: booleanT } ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  transfer: {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'amount', type: uintT },
      { name: 'sender', type: principalT },
      { name: 'recipient', type: principalT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'transfer-fixed': {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'amount', type: uintT },
      { name: 'sender', type: principalT },
      { name: 'recipient', type: principalT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'transfer-many': {
    input: [
      {
        name: 'transfers',
        type: listT(tupleT({
          amount: uintT,
          recipient: principalT,
          sender: principalT,
          'token-id': uintT
        }, ), )
      }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'transfer-many-fixed': {
    input: [
      {
        name: 'transfers',
        type: listT(tupleT({
          amount: uintT,
          recipient: principalT,
          sender: principalT,
          'token-id': uintT
        }, ), )
      }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'transfer-many-memo': {
    input: [
      {
        name: 'transfers',
        type: listT(tupleT({
          amount: uintT,
          memo: bufferT,
          recipient: principalT,
          sender: principalT,
          'token-id': uintT
        }, ), )
      }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'transfer-many-memo-fixed': {
    input: [
      {
        name: 'transfers',
        type: listT(tupleT({
          amount: uintT,
          memo: bufferT,
          recipient: principalT,
          sender: principalT,
          'token-id': uintT
        }, ), )
      }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'transfer-memo': {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'amount', type: uintT },
      { name: 'sender', type: principalT },
      { name: 'recipient', type: principalT },
      { name: 'memo', type: bufferT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'transfer-memo-fixed': {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'amount', type: uintT },
      { name: 'sender', type: principalT },
      { name: 'recipient', type: principalT },
      { name: 'memo', type: bufferT }
    ],
    output: responseSimpleT(booleanT, ),
    mode: 'public'
  },
  'fixed-to-decimals': {
    input: [ { name: 'amount', type: uintT } ],
    output: uintT,
    mode: 'readonly'
  },
  'get-balance': {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'who', type: principalT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-balance-fixed': {
    input: [
      { name: 'token-id', type: uintT },
      { name: 'who', type: principalT }
    ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-contract-owner': {
    input: [],
    output: responseSimpleT(principalT, ),
    mode: 'readonly'
  },
  'get-decimals': {
    input: [ { name: 'token-id', type: uintT } ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-name': {
    input: [ { name: 'token-id', type: uintT } ],
    output: responseSimpleT(stringAsciiT, ),
    mode: 'readonly'
  },
  'get-overall-balance': {
    input: [ { name: 'who', type: principalT } ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-overall-balance-fixed': {
    input: [ { name: 'who', type: principalT } ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-overall-supply': { input: [], output: responseSimpleT(uintT, ), mode: 'readonly' },
  'get-overall-supply-fixed': { input: [], output: responseSimpleT(uintT, ), mode: 'readonly' },
  'get-symbol': {
    input: [ { name: 'token-id', type: uintT } ],
    output: responseSimpleT(stringAsciiT, ),
    mode: 'readonly'
  },
  'get-token-balance-owned-in-fixed': {
    input: [ { name: 'owner', type: principalT } ],
    output: listT(tupleT({ balance: uintT, 'token-id': uintT }, ), ),
    mode: 'readonly'
  },
  'get-token-owned': {
    input: [ { name: 'owner', type: principalT } ],
    output: listT(uintT, ),
    mode: 'readonly'
  },
  'get-token-uri': {
    input: [ { name: 'token-id', type: uintT } ],
    output: responseSimpleT(optionalT(stringT, ), ),
    mode: 'readonly'
  },
  'get-total-supply': {
    input: [ { name: 'token-id', type: uintT } ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-total-supply-fixed': {
    input: [ { name: 'token-id', type: uintT } ],
    output: responseSimpleT(uintT, ),
    mode: 'readonly'
  },
  'get-transferrable': { input: [], output: responseSimpleT(booleanT, ), mode: 'readonly' },
  'approved-contracts': {
    input: principalT,
    output: optionalT(booleanT, ),
    mode: 'mapEntry'
  },
  'token-balances': {
    input: tupleT({ owner: principalT, 'token-id': uintT }, ),
    output: optionalT(uintT, ),
    mode: 'mapEntry'
  },
  'token-owned': {
    input: principalT,
    output: optionalT(listT(uintT, ), ),
    mode: 'mapEntry'
  },
  'token-supplies': { input: uintT, output: optionalT(uintT, ), mode: 'mapEntry' },
  'contract-owner': { input: noneT, output: principalT, mode: 'variable' },
  'token-decimals': { input: noneT, output: uintT, mode: 'variable' },
  'token-name': { input: noneT, output: stringAsciiT, mode: 'variable' },
  'token-symbol': { input: noneT, output: stringAsciiT, mode: 'variable' },
  'token-uri': { input: noneT, output: optionalT(stringT, ), mode: 'variable' },
  transferrable: { input: noneT, output: booleanT, mode: 'variable' }
}
} as const)


