import { mapActions, mapGetters } from 'vuex';
import { getIdenticonAvatar } from '~/util/api';
import {
  getLikerIdSettingsURL,
  getExportSeedWordWidgetURL,
} from '~/util/links';
import { escapeCSVField, downloadCSV } from '~/util/misc';

import walletLoginMixin from './wallet-login';

export default {
  mixins: [walletLoginMixin],
  computed: {
    ...mapGetters([
      'getAddress',
      'getSigner',
      'getLikerInfo',
      'getLikerId',
      'getLocale',
      'getUserInfoByAddress',
      'walletTotalSales',
      'walletTotalRoyalty',
      'walletTotalResales',
      'walletSalesDetails',
      'walletRoyaltyDetails',
      'walletResalesDetails',
      'walletFollowees',
      'walletFollowers',
      'walletIsFetchingFollowers',
      'walletMethodType',
      'walletEmail',
      'walletEmailUnverified',
      'walletHasVerifiedEmail',
      'walletLIKEBalance',
      'walletLIKEBalanceFetchPromise',
      'walletHasLoggedIn',
      'walletIsMatchedSession',
      'walletIsLoggingIn',
      'loginAddress',
      'getAccessToken',
      'getSessionWallet',
      'getIsRestoringSession',
    ]),
    hasConnectedWallet() {
      return !!this.getAddress && !!this.walletMethodType;
    },
    isWalletUserCivicLiker() {
      return this.getLikerInfo && this.getLikerInfo.isSubscribedCivicLiker;
    },
    isWalletUserAuthcore() {
      return this.walletMethodType === 'liker-id';
    },
    walletUserAvatar() {
      return (
        (this.getLikerInfo && this.getLikerInfo.avatar) ||
        getIdenticonAvatar(this.getAddress)
      );
    },
    walletUserDisplayName() {
      return this.getLikerInfo?.displayName || this.getAddress;
    },
    likerIdSettingsURL() {
      return getLikerIdSettingsURL({
        wallet: this.getAddress || '',
        language: this.getLocale.startsWith('zh') ? 'zh' : 'en',
      });
    },
    exportSeedWordURL() {
      return getExportSeedWordWidgetURL({
        language: this.getLocale.startsWith('zh') ? 'zh' : 'en',
      });
    },
    populatedFollowers() {
      return this.walletFollowers.map(follower => ({
        displayName:
          this.getUserInfoByAddress(follower)?.displayName || follower,
        wallet: follower,
        avatar: this.getUserInfoByAddress(follower)?.avatar,
        isCivicLiker: this.getUserInfoByAddress(follower)
          ?.isSubscribedCivicLiker,
      }));
    },
  },
  watch: {
    getAddress: {
      handler(newAddress) {
        if (newAddress) this.walletFetchLIKEBalance();
      },
    },
  },
  methods: {
    ...mapActions([
      'walletFetchLIKEBalance',
      'walletFetchFollowees',
      'walletFetchFollowers',
      'walletUnfollowCreator',
      'walletFollowCreator',
      'signLogin',
      'walletFetchTotalRoyalty',
      'walletFetchTotalSales',
      'walletFetchTotalResales',
    ]),
    navigateToMyDashboard() {
      this.$router.push(
        this.localeLocation({
          name: 'feed',
          query: { view: 'town', login: '1' },
        })
      );
    },
    navigateToSettings() {
      window.open(
        this.likerIdSettingsURL,
        'settings',
        'menubar=no,location=no,width=576,height=768'
      );
    },
    exportFollowerList() {
      const header = [
        this.$t('portfolio_follower_export_ID'),
        this.$t('portfolio_follower_export_wallet'),
      ];
      const contents = this.populatedFollowers.map(
        ({ displayName, wallet }) => [escapeCSVField(displayName), wallet]
      );

      // Convert list to CSV string
      const csvString = `${header.join(',')}\n${contents
        .map(row => row.join(','))
        .join('\n')}`;

      downloadCSV(csvString, 'my-followers.csv');
    },
    async handleClickFollow({ followOwner }) {
      const isFollowed = this.walletFollowees?.includes(followOwner) || false;
      try {
        if (!this.walletHasLoggedIn) {
          try {
            await this.signLogin();
          } catch (err) {
            this.alertPromptError(err);
          }
          if (!this.walletHasLoggedIn) {
            return;
          }
        }
        if (isFollowed) {
          await this.walletUnfollowCreator(followOwner);
          return;
        }
        this.walletFollowCreator(followOwner);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
};
