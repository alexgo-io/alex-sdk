const { generateContracts } = require('clarity-codegen/lib/generate');
const path = require('path');

const API_HOST = 'https://stacks-node-api.alexlab.co';
const CONTRACT_DEPLOYER = 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';

const contracts = [
  'swap-helper-v1-02',
  'swap-helper-v1-03',
  'amm-swap-pool',
  'amm-swap-pool-v1-1',
  'token-amm-swap-pool',
  'swap-helper-bridged',
  'swap-helper-bridged-v1-1',
];

(async function main() {
  await generateContracts(
    API_HOST,
    CONTRACT_DEPLOYER,
    contracts,
    path.resolve(__dirname, '../src/generated/smartContract/'),
    'Alex',
    '../smartContractHelpers/codegenImport'
  );
})().catch(console.error);
