import { ReadOnlyFunctionOptions } from '@stacks/transactions/src/builders';
import { ClarityValue } from '@stacks/transactions';
import { AlexContracts } from './generated/smartContract/contracts_Alex';
import {
  ParameterObjOfDescriptor,
  ReadonlyFunctionDescriptor,
  ReturnTypeOfDescriptor,
} from 'clarity-codegen';
import { CONTRACT_DEPLOYER } from './config';
import { getLiquidityProviderFee } from './helpers/FeeHelper';
import { AMMSwapPool } from './utils/ammPool';
import { defaultReadonlyCallExecutor } from './utils/readonlyCallExecutor';
import { getRoute } from './helpers/RouteHelper';
import { getYAmountFromXAmount } from './helpers/RateHelper';
import { runSpot, TxToBroadCast } from './helpers/SwapHelper';

export type Contracts = typeof AlexContracts;

export enum Currency {
  ALEX = 'age000-governance-token',
  USDA = 'token-wusda',
  STX = 'token-wstx',
  BANANA = 'token-wban',
  XBTC = 'token-wbtc',
  DIKO = 'token-wdiko',
  SLIME = 'token-wslm',
  XUSD = 'token-wxusd',
  MIA = 'token-wmia',
  NYCC = 'token-wnycc',
  CORGI = 'token-wcorgi',
}

export type ReadonlyCallExecutor = (
  options: Pick<
    ReadOnlyFunctionOptions,
    'functionArgs' | 'functionName' | 'contractName' | 'contractAddress'
  >
) => Promise<ClarityValue>;

export class AlexSDK {
  private readonly readonlyCallExecutor: ReadonlyCallExecutor;
  constructor(options?: { readonlyCallExecutor?: ReadonlyCallExecutor }) {
    this.readonlyCallExecutor =
      options?.readonlyCallExecutor ?? defaultReadonlyCallExecutor;
  }

  readonlyCall: <
    T extends keyof Contracts,
    F extends keyof Contracts[T],
    Descriptor extends Contracts[T][F]
  >(
    contractName: T,
    functionName: F,
    args: Descriptor extends ReadonlyFunctionDescriptor
      ? ParameterObjOfDescriptor<Descriptor>
      : never
  ) => Promise<
    Descriptor extends ReadonlyFunctionDescriptor
      ? ReturnTypeOfDescriptor<Descriptor>
      : never
  > = async (contractName, functionName, args) => {
    const functionDescriptor = AlexContracts[contractName][
      functionName
    ] as any as ReadonlyFunctionDescriptor;
    const clarityArgs = functionDescriptor.input.map((arg) =>
      arg.type.encode(args[arg.name])
    );
    const result = await this.readonlyCallExecutor({
      contractName,
      functionName: String(functionName),
      functionArgs: clarityArgs,
      contractAddress: CONTRACT_DEPLOYER,
    });
    return functionDescriptor.output.decode(result);
  };

  getFee(from: Currency, to: Currency): Promise<bigint> {
    return getLiquidityProviderFee(this, from, to, AMMSwapPool.ammTokens);
  }
  getRouter(from: Currency, to: Currency): Promise<Currency[]> {
    return getRoute(this, from, to, AMMSwapPool.ammTokens);
  }
  getRate(from: Currency, fromAmount: bigint, to: Currency): Promise<bigint> {
    return getYAmountFromXAmount(
      this,
      from,
      to,
      fromAmount,
      AMMSwapPool.ammTokens
    );
  }
  runSwap(
    stxAddress: string,
    currencyX: Currency,
    currencyY: Currency,
    fromAmount: bigint,
    minDy: bigint,
    middleSteps: Currency[],
    ammPools: AMMSwapPool.PoolTokens[]
  ): TxToBroadCast {
    return runSpot(
      stxAddress,
      currencyX,
      currencyY,
      fromAmount,
      minDy,
      middleSteps,
      ammPools
    );
  }
}
