/**
 * This type is a string used to represent different tokens in the AlexSDK.
 * It use a unique symbol to distinguish it from regular strings and refers to specific currencies such as `STX`, `ALEX`, and others.
 */
export type Currency = string & {
  readonly brand: unique symbol;
};

// ignore duplicate
// eslint-disable-next-line @typescript-eslint/no-redeclare
/** The `Currency` namespace contains predefined constants for tokens in the AlexSDK.*/
export namespace Currency {
  /** Represents the `STX` token */
  export const STX = createCurrency('token-wstx');
  /** Represents the `ALEX` token*/
  export const ALEX = createCurrency('age000-governance-token');
}

function createCurrency(value: string): Currency {
  return value as Currency;
}
