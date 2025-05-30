import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueGtag from 'vue-gtag';

export default (ctx, inject) => {
  const {
    app: { router },
    store,
    query,
  } = ctx;
  if (process.env.GA_TRACKING_ID) {
    const includes = [];
    if (process.env.AD_CONVERSION_ID) {
      includes.push({
        id: process.env.AD_CONVERSION_ID.split('/')[0],
      });
    }
    Vue.use(
      VueGtag,
      {
        config: {
          id: process.env.GA_TRACKING_ID,
          allow_enhanced_conversions: !(
            window.doNotTrack || navigator.doNotTrack
          ),
        },
        includes,
      },
      router
    );
    if (query.ga_client_id && query.ga_session_id) {
      Vue.$gtag.config({
        client_id: query.ga_client_id,
        session_id: query.ga_session_id,
      });
    }
    ctx.$gtag = Vue.$gtag;
    inject('gtag', Vue.$gtag);
    Vue.$gtag.query('get', process.env.GA_TRACKING_ID, 'client_id', id => {
      store.dispatch('setGaClientId', id);
    });
    Vue.$gtag.query('get', process.env.GA_TRACKING_ID, 'session_id', id => {
      store.dispatch('setGaSessionId', id);
    });
  }
};
