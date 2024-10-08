<template>
  <div class="flex flex-col gap-[8px] justify-center items-center">
    <ButtonV2
      :text="buttonText"
      :theme="theme"
      :preset="isCollectable ? 'secondary' : 'tertiary'"
      :is-disabled="isDisabled"
      @click="handleClickCollectButton"
    >
      <template v-if="isCollectable && theme === 'classic'" #prepend>
        <IconPrice />
      </template>
    </ButtonV2>
    <div
      v-if="shouldShowExpiryTime"
      class="flex gap-[4px] justify-center items-center"
      :class="expiryTimeTextClass"
    >
      <IconClock />
      <div class="text-[12px]">{{ collectExpiryTimeForDisplay }}</div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { normalizeLocaleForDayjs } from '~/locales';

export default {
  props: {
    buttonText: {
      type: String,
      default: '',
    },
    isCollectable: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    collectExpiryTime: {
      type: Number,
      default: 0,
    },
    shouldShowExpiryTimeBeforeExpired: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: 'classic',
    },
  },
  computed: {
    isCollectExpiringSoon() {
      if (!this.collectExpiryTime) return false;

      const timeLeft = this.collectExpiryTime - Date.now();
      const threshold = 4 * 7 * 24 * 60 * 60 * 1000; // 4 weeks
      return timeLeft > 0 && timeLeft <= threshold;
    },
    collectExpiryTimeForDisplay() {
      if (!this.collectExpiryTime) return '';

      const timeLeft = this.collectExpiryTime - Date.now();
      if (timeLeft <= 0) return '';

      const dateTime = dayjs(this.collectExpiryTime);
      if (this.isCollectExpiringSoon) {
        const duration = dateTime
          .locale(normalizeLocaleForDayjs(this.$i18n.locale))
          .fromNow(true);
        return this.$t('nft_collect_expiry_time_near', { duration });
      }
      const date = dateTime.format('YYYY-MM-DD');
      return this.$t('nft_collect_expiry_time_far', { date });
    },
    expiryTimeTextClass() {
      return this.isCollectExpiringSoon
        ? 'text-pending-orange'
        : 'text-inherit';
    },
    shouldShowExpiryTime() {
      return (
        this.collectExpiryTimeForDisplay &&
        (this.isCollectExpiringSoon || this.shouldShowExpiryTimeBeforeExpired)
      );
    },
  },
  methods: {
    handleClickCollectButton() {
      this.$emit('click-collect-button');
    },
  },
};
</script>
