<template>
  <main class="redirect-page">
    <div class="flex flex-col items-center my-48">
      <h1 class="text-24">{{ $t('RedirectPage.title') }}</h1>
      <LcLoadingIndicator class="text-like-cyan mx-auto" />
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { logTrackerEvent } from '~/util/EventLogger';
import { getFromSessionStorage, removeSessionStorageItem } from '~/util/misc';

export default {
  name: 'AuthRedirect',
  layout: 'empty',
  head() {
    return {
      title: this.$t('RedirectPage.title'),
    };
  },
  computed: {
    ...mapGetters(['getHomeRoute', 'walletEmail', 'walletEmailUnverified']),
  },
  async mounted() {
    const { error, method, code } = this.$route.query;

    let postAuthRoute = this.localeLocation(this.getHomeRoute);
    const storedRoute = getFromSessionStorage('USER_POST_AUTH_ROUTE', true);
    if (storedRoute) {
      postAuthRoute = storedRoute;
    }

    if (method && code) {
      try {
        const { isNew, user, idToken } = await this.handleConnectorRedirect({
          method,
          params: { code },
        });
        if (
          user?.primary_email &&
          !this.walletEmail &&
          !this.walletEmailUnverified
        ) {
          try {
            await this.walletUpdateEmail({
              email: user?.primary_email,
              verify: user?.primary_email_verified,
              authcoreIdToken: idToken,
            });
          } catch (error) {
            console.error(error);
            // ignore
          }
        }
        this.$router.replace(postAuthRoute);
        if (!isNew && this.$route.name.startsWith('index')) {
          this.$router.push(this.localeLocation({ name: 'bookshelf' }));
        }
      } catch (err) {
        const errData = err.response || err;
        const errMessage = errData.data || errData.message || errData;
        console.error(errMessage); // eslint-disable-line no-console
        logTrackerEvent(
          this,
          'RedirectLogin',
          'RedirectLoginError',
          errMessage,
          1
        );
        if (errData.status === 403) {
          // random 403 from authcore tokens endpoint
          // but user is already logged in
          this.$router.replace(postAuthRoute);
        } else {
          this.$nuxt.error({
            statusCode: errData.status || 400,
            message: errMessage,
          });
        }
      }
    } else {
      logTrackerEvent(this, 'RedirectLogin', 'RedirectLoginFail', error, 1);
      removeSessionStorageItem('USER_POST_AUTH_ROUTE');
      this.$nuxt.error({
        statusCode: 400,
        message: error,
      });
    }
  },
  methods: {
    ...mapActions(['handleConnectorRedirect', 'walletUpdateEmail']),
  },
};
</script>
