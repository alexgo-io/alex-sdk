import { configs } from '../config';

export enum SponsoredTxErrorCode {
  // The submitted tx payload is invalid
  'invalid_tx' = 'invalid_tx',
  // The requested contract / function aren't whitelisted
  'operation_not_supported' = 'operation_not_supported',
  // Current user already have a pending sponsored transaction
  'pending_operation_exists' = 'pending_operation_exists',
  // The requested tx exceed the capacity of the pool
  'capacity_exceed' = 'capacity_exceed',
  // Current user have pending operation, we require the submitted nonce to be immediate nonce
  'invalid_nonce' = 'invalid_nonce',
  // Worker failed to broadcast the tx
  'broadcast_error' = 'broadcast_error',
  'unknown_error' = 'unknown_error',
}

export class SponsoredTxError extends Error {
  constructor(readonly code: SponsoredTxErrorCode, message: string) {
    super(message);
  }
}

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
    throw new SponsoredTxError(
      SponsoredTxErrorCode.unknown_error,
      response.statusText
    );
  }
  const result = await response.json();
  if (result.data == null) {
    const message = result.errors?.[0]?.message ?? 'Unknown Error';
    const errorCode = result.errors?.[0]?.extensions?.code;
    const code = Object.values(SponsoredTxErrorCode).includes(errorCode)
      ? errorCode
      : SponsoredTxErrorCode.unknown_error;
    throw new SponsoredTxError(code, message);
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
    throw new SponsoredTxError(
      SponsoredTxErrorCode.unknown_error,
      response.statusText
    );
  }
  const {
    data: { user_operations },
  } = await response.json();
  if (user_operations.length === 0) {
    return null;
  }
  const operation = user_operations[0];
  if (operation.error) {
    throw new SponsoredTxError(
      SponsoredTxErrorCode.broadcast_error,
      operation.error
    );
  } else if (operation.sponsor_tx_id) {
    return hasuraAddressToHex(operation.sponsor_tx_id);
  }
  return null;
}

async function retry<T>(
  action: () => Promise<T | null>,
  count = 20
): Promise<T> {
  for (let i = 0; i < count; i++) {
    const result = await action();
    if (result === null) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }
    return result;
  }
  throw new SponsoredTxError(
    SponsoredTxErrorCode.broadcast_error,
    'Timeout waiting for broadcast'
  );
}

function hexAddressToHasuraAddress(input: string): string {
  return '\\x' + input;
}

function hasuraAddressToHex(input: string): string {
  return input.replace(/\\x/, '0x').toLowerCase();
}

export async function isSponsoredSwapEnabled(): Promise<boolean> {
  const response = await fetch(configs.SPONSORED_TX_EXECUTOR, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query {
  isSwapServiceAvailable {
    status
  }
}`,
    }),
  });
  if (!response.ok) {
    return false;
  }
  const result = await response.json();
  return result?.data.isSwapServiceAvailable.status === 'ok';
}
