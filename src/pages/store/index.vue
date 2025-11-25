<script>
import { BOOK3_HOSTNAME } from '~/constant';

export default {
  fetch({ redirect, query }) {
    redirect(
      301,
      `https://${BOOK3_HOSTNAME}/store?${new URLSearchParams(query).toString()}`
    );
  },
};
</script>
