import { defineContract } from "../smartContractHelpers/codegenImport";
import { swapHelperV102 } from "./contract_swap-helper-v1-02"
import { swapHelperV103 } from "./contract_swap-helper-v1-03"
import { ammSwapPool } from "./contract_amm-swap-pool"
import { tokenAmmSwapPool } from "./contract_token-amm-swap-pool"
import { swapHelperBridged } from "./contract_swap-helper-bridged"

export const AlexContracts = defineContract({
...swapHelperV102,
...swapHelperV103,
...ammSwapPool,
...tokenAmmSwapPool,
...swapHelperBridged
});

  