import querystring from 'querystring';
import {
  LIKECOIN_CHAIN_VIEW_TX,
  LIKECOIN_CHAIN_API,
  LIKECOIN_NFT_API_WALLET,
} from '../../constant';

export const getTopNFTClasses = ({ before, after }) => {
  const qsPayload = {
    ignore_list: LIKECOIN_NFT_API_WALLET,
  };
  if (after !== undefined) qsPayload.after = after;
  if (before !== undefined) qsPayload.before = before;
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/ranking?${querystring.stringify(
    qsPayload
  )}`;
};

export const getTotalSalesByAddress = address => {
  const qsPayload = {
    address,
    is_iscn_owner: true,
    action_type: '/cosmos.nft.v1beta1.MsgSend',
  };
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/income?${querystring.stringify(
    qsPayload
  )}`;
};

export const getTotalRoyaltyByAddress = address => {
  const qsPayload = {
    address,
    is_royalty: true,
    is_iscn_owner: false,
  };
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/income?${querystring.stringify(
    qsPayload
  )}`;
};

export const getTotalResalesByAddress = address => {
  const qsPayload = {
    address,
    is_royalty: false,
    action_type: 'buy_nft',
  };
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/income?${querystring.stringify(
    qsPayload
  )}`;
};

export const getChainExplorerTx = hash => `${LIKECOIN_CHAIN_VIEW_TX}/${hash}`;

export const getChainNFTClassMetadataEndpoint = classId =>
  `${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/classes/${classId}`;

export const getChainNFTMetadataEndpoint = (classId, nftId) =>
  `${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/nfts/${classId}/${nftId}`;

export const getTopCollectorOfUser = (creator, count = 5) =>
  `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/collector?pagination.limit=${count}&price_by=nft&creator=${creator}&ignore_list=${LIKECOIN_NFT_API_WALLET}&include_owner=false`;

export const getTopCreatorOfUser = (collector, count = 5) =>
  `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/creator?pagination.limit=${count}&price_by=nft&collector=${collector}&ignore_list=${LIKECOIN_NFT_API_WALLET}&include_owner=false`;

export const getCollectorTopRankedCreators = (collector, top = 5) =>
  `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/collector-top-ranked-creators?collector=${collector}&ignore_list=${LIKECOIN_NFT_API_WALLET}&include_owner=false&top=${top}`;

export const getAccountBalance = (account, denom) =>
  `${LIKECOIN_CHAIN_API}/cosmos/bank/v1beta1/balances/${account}/by_denom?denom=${encodeURIComponent(
    denom
  )}`;

export const getNFTCountByClassId = (classId, owner) =>
  `${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/balance/${owner}/${classId}`;

export const getISCNRecord = iscnId => {
  const qsPayload = {
    iscn_id: iscnId,
  };
  return `${LIKECOIN_CHAIN_API}/iscn/records/id?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTClassesPartial = ({
  classOwner,
  nftOwner,
  expand,
  reverse,
  limit,
  key,
  nocache,
}) => {
  const qsPayload = {}; // TODO: support account based query
  if (classOwner) qsPayload.iscn_owner = classOwner;
  if (nftOwner) qsPayload.owner = nftOwner;
  if (expand) qsPayload.expand = expand;
  if (reverse) qsPayload['pagination.reverse'] = reverse;
  if (limit) qsPayload['pagination.limit'] = limit;
  if (key) qsPayload['pagination.key'] = key;
  if (nocache) qsPayload.ts = `${Math.round(new Date().getTime() / 1000)}`;
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/class?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTOwners = (classId, nocache) => {
  const qsPayload = {
    class_id: classId,
  };
  if (nocache) qsPayload.ts = `${Math.round(new Date().getTime() / 1000)}`;
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/owner?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTEvents = ({
  classId,
  nftId,
  sender,
  receiver,
  creator,
  involver,
  limit,
  key,
  actionType,
  ignoreToList,
  ignoreFromList,
  reverse,
}) => {
  const qsPayload = {};
  if (classId) qsPayload.class_id = classId;
  if (nftId) qsPayload.nft_id = nftId;
  if (sender) qsPayload.sender = sender;
  if (creator) qsPayload.creator = creator;
  if (receiver) qsPayload.receiver = receiver;
  if (involver) qsPayload.involver = involver;
  if (actionType) qsPayload.action_type = actionType;
  if (ignoreToList) qsPayload.ignore_to_list = ignoreToList;
  if (ignoreFromList) qsPayload.ignore_from_list = ignoreFromList;
  if (key) qsPayload['pagination.key'] = key;
  if (limit) qsPayload['pagination.limit'] = limit;
  if (reverse) qsPayload['pagination.reverse'] = reverse;
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/event?${querystring.stringify(
    qsPayload
  )}`;
};
