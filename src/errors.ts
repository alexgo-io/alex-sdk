/**
 * Structured error class for AlexSDK, inspired by RFC 9457 Problem Details.
 * Each error carries a machine-readable `type` URI, a human-readable `title`,
 * an HTTP-equivalent `status` code, and a `detail` string with specifics.
 *
 * Consumers can distinguish error categories with `instanceof AlexSDKError`
 * and branch on `error.type` for fine-grained handling.
 *
 * @example
 * try {
 *   await sdk.getRate(Currency.STX, Currency.ALEX, 1_000_000n)
 * } catch (e) {
 *   if (e instanceof AlexSDKError && e.type === AlexErrorType.RouteNotFound) {
 *     // handle gracefully
 *   }
 * }
 */
export class AlexSDKError extends Error {
  constructor(
    public readonly type: string,
    public readonly title: string,
    public readonly status: number,
    public readonly detail: string,
  ) {
    super(detail)
    this.name = 'AlexSDKError'
  }
}

/** Error type URI namespace for AlexSDK. */
export const AlexErrorType = {
  FetchFailed:          'https://alexgo.io/errors/fetch-failed',
  RouteNotFound:        'https://alexgo.io/errors/route-not-found',
  TooManyPools:         'https://alexgo.io/errors/too-many-pools',
  TokenMappingNotFound: 'https://alexgo.io/errors/token-mapping-not-found',
} as const
