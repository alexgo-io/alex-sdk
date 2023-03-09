export function isNotNull<T>(input: T | undefined | null): input is T {
  return input != null;
}

export function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}
