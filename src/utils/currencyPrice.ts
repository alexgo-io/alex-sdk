import { Currency } from '../currency';

export async function fetchLatestPrices(): Promise<
  Partial<{
    [currency in Currency]: number;
  }>
> {
  const res = await fetch('https://gql.alexlab.co/v1/graphql', {
    body: JSON.stringify({
      query: `
        query FetchLatestPrices {
          laplace_current_token_price {
            avg_price_usd
            token
          }
        }
      `,
    }),
  }).then((a) => a.json());
  const result: Partial<{ [currency in Currency]: number }> = {};
  for (const value of Object.values(Currency)) {
    const external = res.data.laplace_current_token_price.find(
      (a: any) => a.token === value + '-external' && a.avg_price_usd != null
    );
    if (external) {
      result[value] = external.avg_price_usd!;
    } else {
      const nonExternal = res.data.laplace_current_token_price.find(
        (a: any) => a.token === value && a.avg_price_usd != null
      );
      if (nonExternal) {
        result[value] = nonExternal.avg_price_usd!;
      }
    }
  }
  return result;
}
