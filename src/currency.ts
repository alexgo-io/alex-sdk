export type Currency = string & {
  readonly brand: unique symbol;
};

export namespace Currency {
  export const STX = createCurrency('token-wstx');
  export const ALEX = createCurrency('age000-governance-token');
}

function createCurrency(value: string): Currency {
  return value as Currency;
}
