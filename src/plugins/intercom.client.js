import Vue from 'vue';
import Intercom, {
  show,
  boot,
  hide,
  showMessages,
  update,
  shutdown,
} from '@intercom/messenger-js-sdk';

if (process.env.INTERCOM_APP_ID) {
  Intercom({
    app_id: process.env.INTERCOM_APP_ID,
  });

  const intercom = {
    boot: userData => {
      boot(userData);
    },
    show: () => {
      show();
    },
    hide: () => {
      hide();
    },
    showMessages: () => {
      showMessages();
    },
    update: userData => {
      update(userData);
    },
    shutdown: () => {
      shutdown();
    },
  };

  Vue.prototype.$intercom = intercom;
}
