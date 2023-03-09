import { Currency } from '../index';

const tokenNativeAddressDefinition = {
  'age000-governance-token':
    'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex',
  'token-wxusd':
    'SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A.Wrapped-USD::wrapped-usd',
  'token-wbtc':
    'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin::wrapped-bitcoin',
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
};

export function getCurrencyNativeScale(currency: Currency) {
  if (currency === Currency.STX) {
    return 1e6;
  }
  const address = tokenNativeAddressDefinition[currency];
  if (typeof address === 'string') {
    return 1e8;
  }
  return address.decimals;
}

export function getCurrencyNativeAddress(currency: Currency) {
  if (currency === Currency.STX) {
    throw new Error('STX is not a token');
  }
  const address = tokenNativeAddressDefinition[currency];
  if (typeof address === 'string') {
    return address;
  }
  return address.assetIdentifier;
}
