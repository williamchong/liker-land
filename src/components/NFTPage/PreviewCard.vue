<template>
  <CardV2
    :class="['flex', 'flex-col', 'border-[1px]', 'border-shade-gray']"
    :has-padding="false"
  >
    <component
      :is="url ? 'a' : 'div'"
      class="rounded-t-[inherit] overflow-hidden"
      v-bind="
        url
          ? {
              href: url,
              target: '_blank',
              rel: 'noopener ugc',
            }
          : {}
      "
    >
      <NFTCover
        v-if="animationUrl"
        :src="imageUrl"
        :video-src="animationUrl"
        :bg-color="imageBgColor"
      />
      <NFTBookCoverWithFrame
        v-else
        class="w-full !rounded-none"
        :src="imageUrl"
        :alt="nftName"
        :cover-resize="450"
        :background-color="imageBgColor"
        class-aspect-ratio="aspect-[1]"
      />
    </component>
    <div
      :class="[
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'whitespace-pre-line',
        'break-normal',
        'px-[24px]',
        'pt-[48px]',
        'py-[24px]',
        'relative',
      ]"
    >
      <div class="flex flex-col items-center justify-center mt-[-70px] w-full">
        <Identity
          :avatar-url="avatarUrl"
          :avatar-size="avatarSize"
          :is-avatar-outlined="isAvatarOutlined"
        />
        <NuxtLink
          class="flex mt-[8px] w-full"
          :to="
            classOwner
              ? localeLocation({
                  name: 'id',
                  params: { id: classOwner },
                  query: { tab: 'created' },
                })
              : ''
          "
          @click.native="onClickAvatar"
        >
          <Label
            class="w-full text-like-green font-[600]"
            content-class="min-w-0"
            align="center"
          >
            <span class="text-medium-gray">by</span>&nbsp;
            <span class="truncate">{{ displayName }}</span>
          </Label>
        </NuxtLink>

        <div
          v-if="classAuthorName"
          class="my-[1rem] flex flex-col items-center text-center min-w-0 w-full"
        >
          <span class="text-like-cyan-gray text-10">{{
            $t('identity_type_author')
          }}</span>
          <span class="w-full truncate text-dark-gray">{{
            classAuthorName
          }}</span>
        </div>
      </div>
      <Label
        class="mt-[12px]"
        content-class="line-clamp-2"
        preset="h5"
        align="center"
        :text="nftName"
      />
      <Label
        class="mt-[12px]"
        content-class="line-clamp-4"
        preset="p5"
        :text="nftDescription | ellipsisDescription"
      />

      <Separator v-if="isPrimitive || url" class="my-[16px]" />

      <NFTViewOptionList
        :class-id="classId"
        :content-urls="contentUrls"
        :external-url="externalUrl"
        :is-nft-book="isNftBook"
        :nft-id="nftId"
        :is-content-viewable="isContentViewable"
        :is-content-downloadable="isContentDownloadable"
        @view-content="handleClickViewContent"
        @view-content-url="handleClickViewContentURL"
      />

      <div
        v-if="isWritingNFT"
        class="grid grid-flow-col gap-[16px] items-center justify-center mt-[18px] text-[12px]"
      >
        <div class="flex items-center text-medium-gray">
          <IconMint />
          <div class="ml-[4px]">{{ collectedCount }}</div>
        </div>
        <div class="flex items-center text-medium-gray">
          <IconOwner />
          <div class="ml-[4px]">{{ collectorCount }}</div>
        </div>
        <div v-if="nftPrice > 0" class="flex items-center text-like-green">
          <IconPrice />
          <div class="ml-[4px]">{{ nftPrice | formatNumberWithUSD }}</div>
        </div>
      </div>
      <Label
        v-else-if="classCollectionName"
        class="mt-[16px] mx-auto rounded-full bg-shade-gray text-dark-gray font-[600] w-min px-[12px] py-[2px]"
        preset="p6"
        >{{ classCollectionName }}</Label
      >
    </div>
  </CardV2>
</template>

<script>
import { ellipsis, ellipsisDescription, formatNumberWithUSD } from '~/util/ui';

import nftClassCollectionMixin from '~/mixins/nft-class-collection';

export default {
  name: 'NFTPagePreviewCard',
  filters: {
    ellipsis,
    ellipsisDescription,
    formatNumberWithUSD,
  },
  mixins: [nftClassCollectionMixin],
  props: {
    contentUrls: {
      type: Array,
      default: () => [],
    },

    // BackgroundImg
    imageBgColor: {
      type: String,
      default: undefined,
    },
    imageUrl: {
      type: String,
      default: undefined,
    },
    animationUrl: {
      type: String,
      default: undefined,
    },

    // Identity
    avatarUrl: {
      type: String,
      default: undefined,
    },
    avatarSize: {
      type: Number,
      default: 40,
    },
    isAvatarOutlined: {
      type: Boolean,
      default: false,
    },

    // Creater Info
    classOwner: {
      type: String,
      default: undefined,
    },
    classAuthorName: {
      type: String,
      default: undefined,
    },
    externalUrl: {
      type: String,
      default: undefined,
    },
    displayName: {
      type: String,
      default: undefined,
    },

    // NFT Info
    classId: {
      type: String,
      default: undefined,
    },
    nftId: {
      type: String,
      default: '',
    },
    nftName: {
      type: String,
      default: undefined,
    },
    nftDescription: {
      type: String,
      default: undefined,
    },
    nftPrice: {
      type: Number,
      default: undefined,
    },
    classCollectionType: {
      type: String,
      default: '',
    },
    classCollectionName: {
      type: String,
      default: '',
    },

    // Mint Info
    collectedCount: {
      type: Number,
      default: 0,
    },
    collectorCount: {
      type: Number,
      default: 0,
    },

    isContentViewable: {
      type: Boolean,
      default: true,
    },
    isContentDownloadable: {
      type: Boolean,
      default: true,
    },
    isNftBook: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClickViewContent() {
      this.$emit('view-content');
    },
    handleClickViewContentURL(e, url, type) {
      this.$emit('view-content-url', type);
    },
    onClickAvatar(e) {
      this.$emit('click-avatar', e);
    },
  },
};
</script>
