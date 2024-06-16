export type Currency = `${string}.${string}` & { readonly brand: unique symbol };

export function createCurrency(value: string): Currency {
  return value as Currency;
}

export const STXCurrency = createCurrency('SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wstx-v2')