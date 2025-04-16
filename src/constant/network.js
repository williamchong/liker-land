import {
  LIKECOIN_CHAIN_ID,
  LIKECOIN_CHAIN_NFT_RPC,
  LIKECOIN_CHAIN_API,
  LIKECOIN_CHAIN_DENOM,
  LIKECOIN_CHAIN_MIN_DENOM,
  CIVIC_LIKER_V3_STAKING_ENDPOINT,
  EXTERNAL_HOST,
} from '.';

// eslint-disable-next-line prefer-destructuring
const IS_TESTNET = process.env.IS_TESTNET;

export const LIKECOIN_WALLET_CONNECTOR_CONFIG = {
  magicLinkAPIKey: 'pk_live_5E14E3184484268D',
  rpcURL: IS_TESTNET
    ? 'https://sepolia.optimism.io'
    : 'https://mainnet.optimism.io',
  chainId: IS_TESTNET ? 11155420 : 10,
};

export default LIKECOIN_WALLET_CONNECTOR_CONFIG;
