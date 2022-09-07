<template>
  <NFTPortfolioCard>
    <div
      class="h-[180px]"
      :style="`background-color: ${imageBgColor}`"
    >
      <img
        v-if="imageSrc"
        class="object-cover w-full h-full max-h-[180px]"
        :src="imageSrc"
      >
      <img
        v-else
        class="object-cover w-full h-full max-h-[180px]"
        src="~/assets/images/nft/primitive-nft.png"
      >
    </div>
    <div
      :class="[
        'flex',
        'flex-col',
        'text-center',
        'whitespace-pre-line',
        'px-[24px]',
        'pt-[48px]',
        'py-[24px]',
        'relative',
      ]"
    >
      <div class="flex flex-col items-center justify-center mt-[-70px]">
        <Identity
          :avatar-url="userAvatarSrc"
          :avatar-size="40"
          :is-avatar-outlined="isUserCivicLiker"
        />
        <div class="flex mt-[8px]">
          <Label class="text-medium-gray">by</Label>
          <Label
            class="text-like-green ml-[4px] font-[600]"
          >{{ userDisplayName | ellipsis }}</Label>
        </div>
      </div>
      <Label preset="h5" class="mt-[12px] break-all" align="center">{{ title }}</Label>
      <div
        v-if="price !== undefined"
        class="z-[500] flex justify-center mt-[16px]"
      >
        <ProgressIndicator v-if="isCollecting" />
        <ButtonV2
          v-else
          preset="secondary"
          @click.stop.prevent="handleClickCollect"
        >
          <span>{{ formattedPrice }}</span>
          <template #prepend>
            <IconPrice />
          </template>
        </ButtonV2>
      </div>
      <div class="grid grid-flow-col gap-[16px] items-center justify-center mt-[16px]">
        <div class="flex items-center text-medium-gray">
          <IconMint />
          <div class="ml-[4px]">{{ collectedCount }}</div>
        </div>
        <div class="flex items-center text-medium-gray">
          <IconOwner />
          <div class="ml-[4px]">{{ collectorCount }}</div>
        </div>
      </div>
    </div>
  </NFTPortfolioCard>
</template>

<script>
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  props: {
    classId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: undefined,
    },
    collectedCount: {
      type: Number,
      default: 0,
    },
    collectorCount: {
      type: Number,
      default: 0,
    },
    isCollecting: {
      type: Boolean,
      default: false,
    },
    imageSrc: {
      type: String,
      default: '',
    },
    imageBgColor: {
      type: String,
      default: '#f7f7f7',
    },
    userAvatarSrc: {
      type: String,
      default: '',
    },
    userDisplayName: {
      type: String,
      default: '',
    },
    isUserCivicLiker: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedPrice() {
      return `${this.price.toLocaleString('en') || '-'} LIKE`;
    },
  },
};
</script>