import { defineContract } from '../smartContractHelpers/codegenImport';
import { ammPoolV201 } from './contract_Alex_amm-pool-v2-01';
import { sponsorDexV01 } from './contract_Alex_sponsor-dex-v01';
import { alexAmmPoolV201GetHelper } from './contract_Alex_alex-amm-pool-v2-01-get-helper';

export const AlexContracts = defineContract({
  ...ammPoolV201,
  ...sponsorDexV01,
  ...alexAmmPoolV201GetHelper,
});
