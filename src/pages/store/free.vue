<script>
import { BOOK3_HOSTNAME } from '~/constant';

export default {
  fetch({ redirect, query }) {
    const search = new URLSearchParams(query);
    search.set('tag', 'free');
    redirect(301, `https://${BOOK3_HOSTNAME}/store?${search.toString()}`);
  },
};
</script>
