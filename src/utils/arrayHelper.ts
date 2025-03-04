export type AtLeastOne<T> = readonly [T, ...T[]];

export function hasLength<T>(x: T[], length: 0): x is [];
export function hasLength<T>(x: T[], length: 1): x is [T];
export function hasLength<T>(x: T[], length: 2): x is [T, T];
export function hasLength<T>(x: T[], length: 3): x is [T, T, T];
export function hasLength<T>(x: T[], length: 4): x is [T, T, T, T];
export function hasLength<T>(x: T[], length: 5): x is [T, T, T, T, T];
export function hasLength<T>(x: T[], length: number): boolean {
  return x.length === length;
}

export function zipObj<K extends string, V>(
  keys: K[],
  values: V[]
): Record<K, V> {
  return Object.fromEntries(keys.map((key, i) => [key, values[i]])) as any;
}

export function announceAtLeastOne<T>(ary: readonly T[]): AtLeastOne<T> {
  return ary as any;
}
