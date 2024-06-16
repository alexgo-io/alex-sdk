import { generateContracts } from 'clarity-codegen/lib/generate';
import * as path from 'path';

const API_HOST = 'https://stacks-node-api.alexlab.co';
const CONTRACT_DEPLOYER = 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM';

const contracts = ['amm-pool-v2-01'];

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
