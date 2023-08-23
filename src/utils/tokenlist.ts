export type TokenInfo = {
  type: 'fungibleToken',
  id: string,
  name: string
  displayPrecision: number,
  icon: string,
  availableInSwap: boolean,
  contractAddress: string,
  decimals: number
}

export function fetchTokenList(): Promise<TokenInfo[]> {
  return fetch('https://token-list.alexlab.co', {
    mode: 'cors'
  })
    .then(res => res.json())
    .then(data => data.tokens)
}
