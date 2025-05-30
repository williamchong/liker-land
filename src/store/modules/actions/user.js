import * as types from '@/store/mutation-types';
import * as api from '@/util/api';
import { normalizeLocaleForLikeCo } from '@/locales';

export async function postLoginToken(
  { commit, dispatch },
  { authCode, state }
) {
  const user = await this.$api.$post(api.getOAuthCallbackAPI(), {
    authCode,
    state,
  });
  commit(types.USER_SET_USER_INFO, user);
  if (user && user.locale) {
    await dispatch('setLocale', user.locale);
  }
  return user;
}

export async function fetchLoginStatus({ commit, dispatch }) {
  try {
    const user = await this.$api.$get(api.getLoginStatus());
    commit(types.USER_SET_USER_INFO, user);
    if (user && user.locale) {
      await dispatch('setLocale', user.locale);
    }

    return user;
  } catch (err) {
    return false;
  }
}

export async function userLogout({ commit }) {
  await this.$api.$post(api.getLogoutAPI());
  commit(types.USER_SET_USER_INFO, {});
  if (this.$crisp) {
    this.$crisp.push(['do', 'session:reset']);
  }
}

export function setUserCivicLiker({ commit }, { civicLikerVersion = 1 } = {}) {
  commit(types.USER_UPDATE_USER_INFO, {
    isSubscribedCivicLiker: true,
    civicLikerVersion,
  });
}

export function setGaClientId({ commit }, gaClientId) {
  commit(types.USER_SET_GA_CLIENT_ID, gaClientId);
  if (this.$gre) {
    this.$gre.setVisitorId(gaClientId);
  }
}

export function setGaSessionId({ commit }, gaSessionId) {
  commit(types.USER_SET_GA_SESSION_ID, gaSessionId);
}

export async function updatePreferences(
  { dispatch, getters },
  { locale } = {}
) {
  const preferences = {};
  if (locale) {
    await dispatch('setLocale', locale);
    preferences.locale = normalizeLocaleForLikeCo(locale);
    if (getters.walletHasLoggedIn) {
      await this.$api.$post(api.getUserV2LocaleURL(), { locale });
    }
  }
  if (Object.keys(preferences).length) {
    if (getters.getUserId)
      await this.$api.$post(api.userPreferences(), preferences);
  }
}
