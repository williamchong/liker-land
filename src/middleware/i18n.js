export default function({ store, i18n }) {
  if (process.server) return;
  const { locale } = store.state.ui;
  if (i18n.locale !== locale) {
    i18n.setLocale(locale);
  }
}
