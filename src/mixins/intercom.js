import { mapGetters } from 'vuex';

export const IntercomMixinFactory = (options = { isBootAtMounted: true }) => ({
  computed: {
    ...mapGetters([
      'getAddress',
      'loginAddress',
      'getLikerInfo',
      'walletEmail',
    ]),
  },
  mounted() {
    if (options.isBootAtMounted) this.showIntercom();
  },
  beforeDestroy() {
    if (options.isBootAtMounted) this.hideIntercom();
  },
  methods: {
    showIntercom() {
      if (!this.$intercom) return false;
      try {
        const email = this.walletEmail;
        const wallet = this.loginAddress || this.getAddress;
        const displayName = this.getLikerInfo?.displayName || wallet;

        const userData = {};
        if (email) userData.email = email;
        if (displayName) userData.name = displayName;
        if (wallet) userData.like_wallet = wallet;

        this.$intercom.boot(userData);
        return true;
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
      return false;
    },
    openIntercom() {
      if (!this.$intercom) return false;
      try {
        this.showIntercom();
        return true;
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
      return false;
    },
    hideIntercom() {
      if (!this.$intercom) return;
      this.$intercom.hide();
    },
  },
});

export default IntercomMixinFactory();
