import { Currency } from './currency';

const CONTRACT_DEPLOYER = 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
const API_HOST = 'https://stacks-blockchain-lb.alexlab.co';
const IS_MAINNET = true;
const SPONSORED_TX_EXECUTOR = 'https://sponsor-tx.alexlab.co/v1/graphql';

const NATIVE_TOKEN_MAPPING: {
  [P in Exclude<Currency, Currency.STX>]: {
    decimals: number;
    assetIdentifier: string;
  };
} = {
  [Currency.ALEX]: {
    assetIdentifier:
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex',
    decimals: 1e8,
  },
  [Currency.sUSDT]: {
    assetIdentifier:
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-susdt::bridged-usdt',
    decimals: 1e8,
  },
  [Currency.ATALEXV2]: {
    assetIdentifier:
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.auto-alex-v2::auto-alex-v2',
    decimals: 1e8,
  },
  [Currency.XUSD]: {
    assetIdentifier:
      'SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A.Wrapped-USD::wrapped-usd',
    decimals: 1e8,
  },
  [Currency.XBTC]: {
    assetIdentifier:
      'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin::wrapped-bitcoin',
    decimals: 1e8,
  },
  [Currency.DIKO]: {
    assetIdentifier:
      'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token::diko',
    decimals: 1e6,
  },
  [Currency.USDA]: {
    assetIdentifier:
      'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda',
    decimals: 1e6,
  },
  [Currency.BANANA]: {
    assetIdentifier:
      'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-bananas::BANANA',
    decimals: 1e6,
  },
  [Currency.SLIME]: {
    assetIdentifier:
      'SP125J1ADVYWGWB9NQRCVGKYAG73R17ZNMV17XEJ7.slime-token::SLIME',
    decimals: 1e6,
  },
  [Currency.MIA]: {
    assetIdentifier:
      'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2::miamicoin',
    decimals: 1e6,
  },
  [Currency.NYCC]: {
    assetIdentifier:
      'SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11.newyorkcitycoin-token-v2::newyorkcitycoin',
    decimals: 1e6,
  },
  [Currency.CORGI]: {
    decimals: 1e6,
    assetIdentifier: `SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token::welshcorgicoin`,
  },
  [Currency.VIBES]: {
    decimals: 1e8,
    assetIdentifier: `SP27BB1Y2DGSXZHS7G9YHKTSH6KQ6BD3QG0AN3CR9.vibes-token::vibes-token`,
  },
  [Currency.BRC20_DB20]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-db20::brc20-db20`,
  },
  [Currency.BRC20_ORMM]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-ormm::brc20-ormm`,
  },
  [Currency.BRC20_CHAX]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-chax::brc20-chax`,
  },
  [Currency.BRC20_ORDG]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-ordg::brc20-ordg`,
  },
  [Currency.BRC20_REOS]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-reos::brc20-reos`,
  },
  [Currency.BRC20_ORNJ]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-ornj::brc20-ornj`,
  },
  [Currency.STX20_STXS]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.stx20-stxs::stx20-stxs`,
  },
  [Currency.aBTC]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-abtc::bridged-btc`,
  },
  [Currency.sLUNR]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-slunr::bridged-lunr`,
  },
  [Currency.BRC20_CHAX]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-chax::brc20-chax`,
  },
  [Currency.LEO]: {
    decimals: 1e6,
    assetIdentifier: 'SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token::leo',
  },
  [Currency.MEGA]: {
    decimals: 1e2,
    assetIdentifier: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.mega::mega',
  },
  [Currency.GUS]: {
    decimals: 1e6,
    assetIdentifier: 'SP1JFFSYTSH7VBM54K29ZFS9H4SVB67EA8VT2MYJ9.gus-token::gus',
  },
  [Currency.BRC20_ORMM]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-ormm::brc20-ormm`,
  },
  [Currency.BRC20_ORDG]: {
    decimals: 1e8,
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.brc20-ordg::brc20-ordg`,
  },
  [Currency.LONG]: {
    assetIdentifier:
      'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin::longcoin',
    decimals: 1e6,
  },
  [Currency.WNOTHING]: {
    assetIdentifier:
      'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wrapped-nothing-v8::wrapped-nthng',
    decimals: 1,
  },
  [Currency.AEWBTC]: {
    assetIdentifier:
      'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aewbtc::aeWBTC',
    decimals: 1e8,
  },
  [Currency.MAX]: {
    assetIdentifier: 'SP7V1SE7EA3ZG3QTWSBA2AAG8SRHEYJ06EBBD1J2.max-token::max',
    decimals: 1e6,
  },
  [Currency.PLAY]: {
    assetIdentifier: 'SP1PW804599BZ46B4A0FYH86ED26XPJA7SFYNK1XS.play::play',
    decimals: 1e6,
  },
  [Currency.AEUSDC]: {
    assetIdentifier:
      'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc::aeUSDC',
    decimals: 1e6,
  },
  [Currency.PEPE]: {
    assetIdentifier:
      'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.tokensoft-token-v4k68639zxz::tokensoft-token',
    decimals: 1e3,
  },
  [Currency.MICK]: {
    assetIdentifier:
      'SP2Y8T3TR3FKH3Y2FPZVNQAEKNJXKWVS4RVQF48JE.stakemouse::stakemouse',
    decimals: 1e6,
  },
  [Currency.NOPE]: {
    assetIdentifier: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope::NOT',
    decimals: 1,
  },
  [Currency.FAST]: {
    assetIdentifier: 'SP3951VNPC55BMS9RCF6SKRZP4K3Q2PQ2RSM1DD1V.fast::fast',
    decimals: 1e6,
  },
  [Currency.FRODO]: {
    assetIdentifier:
      'SPPK49DG7WR1J5D50GZ4W7DYYWM5MAXSX0ZA9VEJ.FrodoSaylorKeanuPepe10Inu-token-v69::FrodoSaylorKeanuPepe10Inu',
    decimals: 1e6,
  },
  [Currency.PICSUM]: {
    assetIdentifier: `${CONTRACT_DEPLOYER}.token-picsum-404::picsum-404`,
    decimals: 1e8,
  },
  [Currency.WIF]: {
    assetIdentifier: `SP3WPNAEBYMX06RQNNYTH5PTJ1FRGX5A13ZZMZ01D.dogwifhat-token::wif`,
    decimals: 1e6,
  },
  [Currency.LQSTX]: {
    assetIdentifier: `ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.token-lqstx::lqstx`,
    decimals: 1e6,
  },
  [Currency.sSKO]: {
    assetIdentifier: `SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-ssko::token-ssko`,
    decimals: 1e8,
  },
};

export const configs = {
  IS_MAINNET,
  CONTRACT_DEPLOYER,
  API_HOST,
  NATIVE_TOKEN_MAPPING,
  SPONSORED_TX_EXECUTOR,
};

type AlexConfig = typeof configs;

export type AssignConfigParams = Partial<
  Omit<AlexConfig, 'NATIVE_TOKEN_MAPPING'>
> & {
  NATIVE_TOKEN_MAPPING: Partial<AlexConfig['NATIVE_TOKEN_MAPPING']>;
};

export function assignConfig(newConfigs: AssignConfigParams) {
  Object.assign(configs, newConfigs, {
    NATIVE_TOKEN_MAPPING: {
      ...NATIVE_TOKEN_MAPPING,
      ...newConfigs.NATIVE_TOKEN_MAPPING,
    },
  });
}
