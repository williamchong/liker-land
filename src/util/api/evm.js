import querystring from 'querystring';
import { LIKE_NFT_EVM_INDEXER_API, EVM_CHAIN_VIEW_TX } from '../../constant';

export const getChainExplorerTx = hash => `${EVM_CHAIN_VIEW_TX}/${hash}`;

export const getChainNFTClassMetadataEndpoint = classId =>
  `${LIKE_NFT_EVM_INDEXER_API}/booknft/${classId}`;

export const getChainNFTMetadataEndpoint = (classId, nftId) =>
  `${LIKE_NFT_EVM_INDEXER_API}/token/${classId}/${nftId}`;

export const getWalletOwnedClass = ({ wallet, key, reverse, limit = 100 }) => {
  const payload = {};
  if (key) payload['pagination.key'] = key;
  if (limit) payload['pagination.limit'] = limit;
  if (reverse) payload['pagination.reverse'] = reverse;
  return `${LIKE_NFT_EVM_INDEXER_API}/account/${wallet}/booknfts?${querystring.stringify(
    payload
  )}`;
};

export const getWalletOwnedNFTs = ({ wallet, key, reverse, limit = 100 }) => {
  const payload = {};
  if (key) payload['pagination.key'] = key;
  if (limit) payload['pagination.limit'] = limit;
  if (reverse) payload['pagination.reverse'] = reverse;
  return `${LIKE_NFT_EVM_INDEXER_API}/account/${wallet}/tokens?${querystring.stringify(
    payload
  )}`;
};

export const getNFTClassEvents = ({ classId, page, limit = 100 }) => {
  const payload = {};
  if (page) payload.page = page;
  if (limit) payload.limit = limit;
  return `${LIKE_NFT_EVM_INDEXER_API}/events/${classId}?${querystring.stringify(
    payload
  )}`;
};
