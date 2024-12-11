import { generateContracts } from 'clarity-codegen/lib/generate';
import * as path from 'node:path';
import { configs } from '../src/config';

const API_HOST = configs.READONLY_CALL_API_HOST;
const ALEX_CONTRACT_DEPLOYER = configs.CONTRACT_DEPLOYER;
const SPONSOR_CONTRACT_DEPLOYER = configs.SPONSOR_TX_DEPLOYER;

const contracts = ['amm-pool-v2-01', 'sponsor-dex-v01'];

(async function main() {
  await generateContracts(
    API_HOST,
    (contract) => contract === 'sponsor-dex-v01' ? SPONSOR_CONTRACT_DEPLOYER : ALEX_CONTRACT_DEPLOYER,
    contracts,
    path.resolve(__dirname, '../src/generated/smartContract/'),
    'Alex',
    '../smartContractHelpers/codegenImport'
  );
})().catch(console.error);
