import { defineContract } from "../smartContractHelpers/codegenImport";
import { swapHelperV102 } from "./contract_swap-helper-v1-02"
import { swapHelperV103 } from "./contract_swap-helper-v1-03"
import { ammSwapPool } from "./contract_amm-swap-pool"
import { ammSwapPoolV11 } from "./contract_amm-swap-pool-v1-1"
import { tokenAmmSwapPool } from "./contract_token-amm-swap-pool"
import { swapHelperBridged } from "./contract_swap-helper-bridged"
import { swapHelperBridgedV11 } from "./contract_swap-helper-bridged-v1-1"

export const AlexContracts = defineContract({
...swapHelperV102,
...swapHelperV103,
...ammSwapPool,
...ammSwapPoolV11,
...tokenAmmSwapPool,
...swapHelperBridged,
...swapHelperBridgedV11
});

  