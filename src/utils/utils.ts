export function isNotNull<T>(input: T | undefined | null): input is T {
  return input != null;
}

export function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export function fromEntries<K extends string, V>(
  entries: [K, V][]
): Record<K, V> {
  return entries.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<K, V>);
}
