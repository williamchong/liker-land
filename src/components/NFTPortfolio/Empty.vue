<template>
  <NFTPortfolioCard class="!bg-shade-gray">
    <div class="p-[8px] w-full h-[140px]">
      <div
        class="z-[5] h-full w-full bg-repeat-space"
        :style="{
          backgroundImage: `url(/images/NFT/background_cross.png)`,
        }"
      />
    </div>
    <div class="w-full pb-[32px] bg-shade-gray border-t-[1px] border-white">
      <div class="flex flex-col justify-center items-center mt-[-21px]">
        <div
          class="w-[42px] h-[42px] rounded-[50%] bg-shade-gray border-[2px] border-white"
        />
        <Label class="text-medium-gray mt-[12px]" :text="cardText" />
        <NuxtLink
          v-if="shouldShowIntercom"
          class="mt-[12px] text-like-green font-600"
          :to="localeLocation({ name: 'bookstore' })"
        >
          {{ $t('portfolio_collected_tab_get_more_item') }}
        </NuxtLink>
        <i18n
          v-if="shouldShowIntercom"
          class="flex items-center text-medium-gray text-[14px] mt-[24px]"
          path="nft_claim_claimed_empty_collected_help"
        >
          <button
            place="help"
            class="cursor-pointer text-like-green font-600 mx-[4px] hover:underline"
            @click="handleClickHelp"
          >
            {{ $t('nft_claim_claimed_help') }}
          </button>
        </i18n>
      </div>
    </div>
  </NFTPortfolioCard>
</template>

<script>
import intercomMixin from '~/mixins/intercom';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'NFTPortfolioEmpty',
  mixins: [intercomMixin],
  props: {
    // The preset of empty card, option: collected and created
    preset: {
      type: String,
      default: 'collected',
    },
  },
  computed: {
    cardText() {
      return this.preset === 'collected'
        ? this.$t('portfolio_collected_tab_no_item')
        : this.$t('portfolio_created_tab_no_item');
    },
    shouldShowIntercom() {
      return (
        this.$route.name.includes('bookshelf') && this.preset === 'collected'
      );
    },
  },
  methods: {
    handleClickHelp() {
      logTrackerEvent(this, 'bookshelf', 'bookshelf_intercom_click', '', 1);
      const res = this.openIntercom();
      if (!res) {
        if (process.env.INTERCOM_APP_ID) {
          window.open('mailto:cs@3ook.com');
        } else {
          window.open(
            'https://discord.com/channels/763001015712350231/814761730349596712'
          );
        }
      }
    },
  },
};
</script>
