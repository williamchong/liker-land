<template>
  <div class="flex items-center justify-center">
    <ProgressIndicator />
  </div>
</template>

<script>
export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(localeLocation({ name: 'bookshelf', query }));
  },
};
</script>
