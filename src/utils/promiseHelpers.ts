import { zipObj } from './arrayHelper';

export async function props<I extends Record<string, any>>(
  inputs: I
): Promise<{ [K in keyof I]: Awaited<I[K]> }> {
  const res = await Promise.all(Object.values(inputs));
  return zipObj(Object.keys(inputs), res) as any;
}
