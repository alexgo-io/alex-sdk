import { defineContract } from "../smartContractHelpers/codegenImport";
import { ammPoolV201 } from "./contract_Alex_amm-pool-v2-01"

export const AlexContracts = defineContract({
...ammPoolV201
});

  