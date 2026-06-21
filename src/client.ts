import { XpozClient } from "@xpoz/xpoz";

export interface XpozToolOptions {
  apiKey?: string;
  serverUrl?: string;
  timeoutMs?: number;
  _getClient?: () => Promise<XpozClient>;
}

export function createLazyClient(options: XpozToolOptions): () => Promise<XpozClient> {
  if (options._getClient) return options._getClient;

  let connectionPromise: Promise<XpozClient> | null = null;

  return (): Promise<XpozClient> => {
    if (!connectionPromise) {
      const client = new XpozClient({
        apiKey: options.apiKey,
        serverUrl: options.serverUrl,
        timeoutMs: options.timeoutMs,
        versionCheck: false,
      });
      connectionPromise = client.connect().then(() => client);
    }
    return connectionPromise;
  };
}
