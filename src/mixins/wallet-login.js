import { mapActions } from 'vuex';

import alertMixin from '~/mixins/alert';
import { logTrackerEvent } from '~/util/EventLogger';
import { setSessionStorageItem } from '~/util/misc';

export default {
  mixins: [alertMixin],
  methods: {
    ...mapActions([
      'openConnectWalletModal',
      'disconnectWallet',
      'initWallet',
      'initWalletAndLogin',
      'initIfNecessary',
      'restoreSession',
      'signLogin',
    ]),
    async connectWallet() {
      try {
        logTrackerEvent(
          this,
          'user',
          'connect_wallet_start',
          'connect_wallet_start',
          1
        );
        setSessionStorageItem('USER_POST_AUTH_ROUTE', this.$route.fullPath);
        if (this.getAddress) {
          const res = await this.initWalletAndLogin();
          if (res) {
            logTrackerEvent(
              this,
              'user',
              `connect_wallet_done_with_login`,
              'connect_wallet_done',
              1
            );
            if (this.$route.name.startsWith('index') && !res.isNew) {
              this.$router.push(this.localeLocation({ name: 'bookshelf' }));
            }
          }
        } else {
          await this.openConnectWalletModal(async () => {
            logTrackerEvent(
              this,
              'user',
              `connected_wallet_${this.walletMethodType}`,
              'connected_wallet',
              1
            );
            const res = await this.initWalletAndLogin();
            if (res) {
              logTrackerEvent(
                this,
                'user',
                `connect_wallet_done_with_login`,
                'connect_wallet_done',
                1
              );
              if (this.$route.name.startsWith('index') && !res.isNew) {
                this.$router.push(this.localeLocation({ name: 'bookshelf' }));
              }
            }
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        this.alertPromptError(err);
      }
    },
    handleConnectWalletEvent({ type, ...payload }) {
      switch (type) {
        case 'toggle_collapsible_connection_method_list':
          logTrackerEvent(
            this,
            'user',
            `ConnectWalletMethodList${
              payload.isCollapsed ? 'Collapsed' : 'Expanded'
            }`,
            `ConnectWalletMethodListToggle`,
            1
          );
          break;

        case 'select_connection_method':
          logTrackerEvent(
            this,
            'user',
            `ConnectWalletSelected_${payload.method}`,
            `ConnectWalletSelected`,
            1
          );
          break;

        default:
          break;
      }
    },
  },
};
