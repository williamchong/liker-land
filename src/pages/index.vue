<script>
export default {
  fetch({ redirect, localeLocation, store, i18n }) {
    redirect(
      302,
      localeLocation(
        { name: 'writing-nft' },
        store.getters.walletHasLoggedIn ? store.getters.getLocale : i18n.locale
      )
    );
  },
};
</script>
