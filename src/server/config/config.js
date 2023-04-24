const config = {};

config.IS_TESTNET = process.env.IS_TESTNET;

config.FIRESTORE_USER_ROOT = process.env.FIRESTORE_USER_ROOT;
config.FIRESTORE_NFT_MINT_SUBSCRIPTION_ROOT =
  process.env.FIRESTORE_NFT_MINT_SUBSCRIPTION_ROOT;
config.FIRESTORE_WALLET_USER_ROOT = process.env.FIRESTORE_WALLET_USER_ROOT;

config.LIKE_CO_CLIENT_ID = process.env.LIKE_CO_CLIENT_ID;
config.LIKE_CO_CLIENT_SECRET = process.env.LIKE_CO_CLIENT_SECRET;

config.COOKIE_SECRET = process.env.COOKIE_SECRET;

config.CRISP_USER_HASH_SECRET = process.env.CRISP_USER_HASH_SECRET;

config.PAYPAL_PDT_HOOK = process.env.PAYPAL_PDT_HOOK;
config.LIKEPAY_HOOK = process.env.LIKEPAY_HOOK;

config.EXTERNAL_URL = process.env.EXTERNAL_URL;

config.GET_WALLET_API_SECRET = process.env.GET_WALLET_API_SECRET;

module.exports = config;
