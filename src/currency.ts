export type Currency = string & {
  readonly brand: unique symbol;
};

// ignore duplicate
// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace Currency {
  export const STX = createCurrency('token-wstx');
  export const ALEX = createCurrency('age000-governance-token');
}

function createCurrency(value: string): Currency {
  return value as Currency;
}
