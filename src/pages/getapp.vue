<template>
  <div class="getapp-page">
    <main class="page-content">
      <GetAppPage :from="$route.query.from" v-bind="getUtmProps()" />
    </main>
  </div>
</template>

<script>
import GetAppPage from '~/components/GetAppPage/GetAppPage';

import utmMixin from '~/mixins/utm';

export default {
  components: {
    GetAppPage,
  },
  mixins: [utmMixin],
  layout: 'default',
  head() {
    return {
      title: this.$t('GetAppPage.Title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('GetAppPage.Og.Title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('GetAppPage.Og.Description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('GetAppPage.Og.Description'),
        },
      ],
    };
  },
};
</script>
