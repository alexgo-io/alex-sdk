import { Currency } from './currency';

const CONTRACT_DEPLOYER = 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
const API_HOST = 'https://stacks-blockchain-lb.alexlab.co';
const IS_MAINNET = true;

const NATIVE_TOKEN_MAPPING = {
  'age000-governance-token': {
    assetIdentifier:
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex',
    decimals: 1e8,
  },
  'token-wxusd': {
    assetIdentifier:
      'SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A.Wrapped-USD::wrapped-usd',
    decimals: 1e8,
  },
  'token-wbtc': {
    assetIdentifier:
      'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin::wrapped-bitcoin',
    decimals: 1e8,
  },
  'token-wdiko': {
    assetIdentifier:
      'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token::diko',
    decimals: 1e6,
  },
  'token-wusda': {
    assetIdentifier:
      'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda',
    decimals: 1e6,
  },
  'token-wban': {
    assetIdentifier:
      'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-bananas::BANANA',
    decimals: 1e6,
  },
  'token-wslm': {
    assetIdentifier:
      'SP125J1ADVYWGWB9NQRCVGKYAG73R17ZNMV17XEJ7.slime-token::SLIME',
    decimals: 1e6,
  },
  'token-wmia': {
    assetIdentifier:
      'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2::miamicoin',
    decimals: 1e6,
  },
  'token-wnycc': {
    assetIdentifier:
      'SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11.newyorkcitycoin-token-v2::newyorkcitycoin',
    decimals: 1e6,
  },
  'token-wcorgi': {
    decimals: 1e6,
    assetIdentifier: `SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token::welshcorgicoin`,
  },
} as {
  [P in Exclude<Currency, Currency.STX>]: {
    decimals: number;
    assetIdentifier: string;
  };
};

export const configs = {
  IS_MAINNET,
  CONTRACT_DEPLOYER,
  API_HOST,
  NATIVE_TOKEN_MAPPING,
};

export type AlexConfig = typeof configs;

export function assignConfig(
  newConfigs: Partial<AlexConfig> & {
    NATIVE_TOKEN_MAPPING: Partial<AlexConfig['NATIVE_TOKEN_MAPPING']>;
  }
) {
  Object.assign(configs, newConfigs, {
    NATIVE_TOKEN_MAPPING: {
      ...NATIVE_TOKEN_MAPPING,
      ...newConfigs.NATIVE_TOKEN_MAPPING,
    },
  });
}
