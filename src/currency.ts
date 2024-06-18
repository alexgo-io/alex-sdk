export type Currency = `${string}.${string}` & {
  readonly brand: unique symbol;
};

export namespace Currency {
  export const STX = createCurrency('token-wstx');
}

function createCurrency(value: string): Currency {
  return value as Currency;
}
