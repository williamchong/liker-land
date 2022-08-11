import { LikeCoinWalletConnector } from '@likecoin/wallet-connector';

import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import { getAddressLikerIdMinApi } from '~/util/api';
import * as types from '@/store/mutation-types';

export function initConnector({ state, commit }, { onInit } = {}) {
  if (state.connector) {
    return state.connector;
  }
  const connector = new LikeCoinWalletConnector({
    ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
    onInit: async ({ accounts, offlineSigner }) => {
      if (!accounts[0]) return;
      const { address } = accounts[0];
      commit(types.WALLET_SET_ADDRESS, address);
      commit(types.WALLET_SET_SIGNER, offlineSigner);
      try {
        const userInfo = await this.$api.$get(getAddressLikerIdMinApi(address));
        commit(types.WALLET_SET_LIKERINFO, userInfo);
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
      if (onInit) {
        onInit();
      }
    },
  });
  commit(types.WALLET_SET_CONNECTOR, connector);
  return connector;
}

export async function connectWallet({ dispatch }, options) {
  const connector = await dispatch('initConnector', options);
  connector.openConnectWalletModal();
}

export function disconnectWallet({ state, commit }) {
  if (state.connector) {
    state.connector.disconnect();
  }
  commit(types.WALLET_SET_ADDRESS, '');
  commit(types.WALLET_SET_SIGNER, null);
  commit(types.WALLET_SET_CONNECTOR, null);
  commit(types.WALLET_SET_LIKERINFO, null);
}

export async function initIfNecessary({ dispatch }) {
  const connector = await dispatch('initConnector');
  connector.initIfNecessary();
}
