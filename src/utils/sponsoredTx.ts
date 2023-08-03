import { configs } from '../config';

export async function broadcastSponsoredTx(tx: string): Promise<string> {
  const response = await fetch(configs.SPONSORED_TX_EXECUTOR, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `mutation run($tx:String!) {
  execute(tx:$tx)
}`,
      variables: {
        tx,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const result = await response.json();
  if (result.data == null) {
    throw new Error(result.errors?.[0]?.message ?? 'Unknown Error');
  }
  const {
    data: { execute: txId },
  } = result;
  return await retry(() => tryToFetchTxId(txId), 10);
}

async function tryToFetchTxId(txId: string): Promise<string | null> {
  const response = await fetch(configs.SPONSORED_TX_EXECUTOR, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query checkStatus($txId: bytea!) {
  user_operations(where:{tx_id:{_eq:$txId}}) {
    sponsor_tx_id
    error
  }
}`,
      variables: {
        txId: hexAddressToHasuraAddress(txId),
      },
    }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const {
    data: { user_operations },
  } = await response.json();
  if (user_operations.length === 0) {
    return null;
  }
  const operation = user_operations[0];
  if (operation.error) {
    throw new Error(operation.error);
  } else if (operation.sponsor_tx_id) {
    return hasuraAddressToHex(operation.sponsor_tx_id);
  }
  return null;
}

async function retry<T>(
  action: () => Promise<T | null>,
  count = 10
): Promise<T> {
  for (let i = 0; i < count; i++) {
    const result = await action();
    if (result === null) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }
    return result;
  }
  throw new Error('Timeout waiting for response');
}

export function hexAddressToHasuraAddress(input: string): string {
  return '\\x' + input;
}

export function hasuraAddressToHex(input: string): string {
  return input.replace(/\\x/, '0x').toLowerCase();
}
