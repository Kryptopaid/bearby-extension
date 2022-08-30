import type { NetwrokConfig } from 'types';


export const NETWORK: NetwrokConfig = {
  mainnet: {
    PROVIDERS: ['https://massa.net/api/v2'],
    VERSION: 0
  },
  testnet: {
    PROVIDERS: ['https://test.massa.net/api/v2'],
    VERSION: 0
  },
  custom: {
    PROVIDERS: ['http://127.0.0.1:33034'],
    VERSION: 0
  }
}
export const NETWORK_KEYS = Object.keys(NETWORK);