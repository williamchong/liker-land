<template>
  <div>
    <header
      v-if="!isSingleColumn"
      v-t="
        isCollectable
          ? 'campaign_nft_item_header_hint'
          : 'campaign_nft_item_header_hint_uncollectable'
      "
      class="text-black text-[12px] leading-[5/3] mb-[8px]"
    />
    <div
      :class="[
        { grid: !isSingleColumn },
        'laptop:grid-cols-2',
        'grid-cols-row',
        'gap-[16px]',
        { 'flex flex-col items-center': isSingleColumn },
      ]"
    >
      <div
        :class="{
          'order-2': !!storyTitle,
          'max-w-[440px]': isSingleColumn,
        }"
      >
        <NFTWidgetBaseCard class="flex flex-col items-center w-full">
          <NFTWidgetContentPreview
            :class="[
              hoverClass,
              'transition-shadow',
              'cursor-pointer',
              'w-full',
              { 'min-h-[300px]': !isSingleColumn },
            ]"
            :title="title"
            :description="description"
            :img-src="imgSrc"
            :img-bg-color="imgBgColor"
            :is-fixed-height="isSingleColumn"
            v-bind="contentPreviewProps"
            @click="handleClickNFTDetails"
          />
          <a
            class="transition-colors cursor-pointer hover:text-like-cyan-dark flex items-center justify-center text-medium-gray mt-[8px]"
            :href="isContentViewable ? url : ''"
            target="_blank"
            rel="noopener ugc"
            @click="handleClickViewContent"
          >
            <NFTWidgetIconEye class="w-[17px]" />
            <span class="underline ml-[6px] text-[12px] leading-[5/3]">{{
              viewDetailsLabel
            }}</span>
          </a>
        </NFTWidgetBaseCard>
        <NuxtLink
          v-if="!storyTitle"
          class="mt-[8px] flex items-center text-like-green group -my-[8px]"
          :to="
            ownerAddress
              ? localeLocation({
                  name: 'id',
                  params: { id: ownerAddress },
                  query: { tab: 'created' },
                })
              : ''
          "
        >
          <Identity
            :avatar-url="ownerAvatarSrc"
            :avatar-size="32"
            :is-avatar-disabled="true"
            :is-avatar-outlined="isCivicLiker"
            :is-lazy-loaded="true"
          />
          <span class="ml-[8px] group-hover:underline font-[600]">{{
            ownerName | ellipsis
          }}</span>
        </NuxtLink>
      </div>
      <div>
        <template v-if="storyTitle">
          <NuxtLink
            :to="
              localeLocation({ name: 'nft-class-classId', params: { classId } })
            "
          >
            <h3
              class="text-[24px] leading-[1.3] font-[700] text-like-green font-serif"
            >
              {{ storyTitle }}
            </h3>
          </NuxtLink>
          <NuxtLink
            class="mt-[16px] flex items-center text-like-green group -my-[8px]"
            :to="
              ownerAddress
                ? localeLocation({
                    name: 'id',
                    params: { id: ownerAddress },
                    query: { tab: 'created' },
                  })
                : ''
            "
          >
            <Identity
              :avatar-url="ownerAvatarSrc"
              :avatar-size="32"
              :is-avatar-disabled="true"
              :is-avatar-outlined="isCivicLiker"
              :is-lazy-loaded="true"
            />
            <span class="ml-[8px] group-hover:underline font-[600]">{{
              ownerName | ellipsis
            }}</span>
          </NuxtLink>
          <NuxtLink
            :to="
              localeLocation({ name: 'nft-class-classId', params: { classId } })
            "
          >
            <p
              class="mt-[24px] text-[20px] leading-[1.5] text-gray-4a font-serif"
            >
              {{ storyDescription }}
            </p>
          </NuxtLink>
        </template>
        <NFTSupplyTable
          v-else-if="!isSingleColumn"
          class="w-full laptop:mt-[8px] laptop:pr-[8px]"
          :sold-count="soldCount"
          :base-price="basePrice"
          :should-collapse-in-mobile="true"
          :should-show-indicator="true"
          :is-disabled="!isCollectable"
          @collect="handleClickCollect"
        />
        <div class="mt-[16px] flex items-center justify-between">
          <ul class="grid grid-flow-col gap-[8px]">
            <li class="laptop:min-w-[80px]">
              <div class="text-[24px] leading-[1.5] font-600 text-like-green">
                {{ soldCount }}
              </div>
              <div
                class="mt-[4px] flex items-center text-[12px] leading-[5/3] font-600 text-medium-gray"
              >
                <NFTWidgetIconNFT class="w-[16px] hidden laptop:block" />
                <span class="laptop:ml-[8px]">{{ soldCountLabel }}</span>
              </div>
            </li>
            <li class="laptop:min-w-[80px]">
              <div class="text-[24px] leading-[1.5] font-600 text-like-green">
                {{ ownerCount }}
              </div>
              <div
                class="mt-[4px] flex items-center text-[12px] leading-[5/3] font-600 text-medium-gray"
              >
                <NFTWidgetIconOwner class="w-[16px] hidden laptop:block" />
                <span class="laptop:ml-[8px]">{{ ownerCountLabel }}</span>
              </div>
            </li>
            <li v-if="ownCount" class="laptop:min-w-[80px]">
              <div class="text-[24px] leading-[1.5] font-600 text-like-green">
                {{ ownCount }}
              </div>
              <div
                class="mt-[4px] flex items-center text-[12px] leading-[5/3] font-600 text-like-green"
              >
                <IconCheck class="w-[16px] hidden laptop:block" />
                <span class="laptop:ml-[8px]">{{ ownCountLabel }}</span>
              </div>
            </li>
          </ul>
          <ProgressIndicator v-if="isLoading" />
          <CollectButton
            v-else-if="isCollectable"
            class="text-medium-gray"
            :button-text="$t('nft_widget_button_collect')"
            :is-collectable="isCollectable"
            :collect-expiry-time="collectExpiryTime"
            @click-collect-button="handleClickCollect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  props: {
    // UI
    viewDetailsLabel: {
      type: String,
      default: 'View Content',
    },
    likeActionLabel: {
      type: String,
      default: undefined,
    },
    ownerCountLabel: {
      type: String,
      default: 'Collectors',
    },
    soldCountLabel: {
      type: String,
      default: 'Collected',
    },
    ownCountLabel: {
      type: String,
      default: 'Own',
    },

    // Owner
    ownerAddress: {
      type: String,
      default: '',
    },
    ownerAvatarSrc: {
      type: String,
      default: '',
    },
    ownerName: {
      type: String,
      default: '',
    },
    isCivicLiker: {
      type: Boolean,
      default: false,
    },

    // Content
    classId: {
      type: String,
      default: '',
    },

    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    imgSrc: {
      type: String,
      default: '',
    },
    imgBgColor: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    contentPreviewProps: {
      type: Object,
      default: undefined,
    },

    price: {
      type: Number,
      default: 0,
    },
    basePrice: {
      type: Number,
      // NOTE: Let child component handle default value
      default: undefined,
    },
    ownerCount: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    ownCount: {
      type: Number,
      default: 0,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isContentViewable: {
      type: Boolean,
      default: true,
    },
    isCollectable: {
      type: Boolean,
      default: false,
    },
    collectExpiryTime: {
      type: Number,
      default: 0,
    },

    storyTitle: {
      type: String,
      default: '',
    },
    storyDescription: {
      type: String,
      default: '',
    },

    isSingleColumn: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hoverClass() {
      const color = this.imgBgColor.toLowerCase();
      switch (color) {
        case '#f7f7f7':
          return 'hover:shadow-[0_0_0_2px_#f7f7f7]';
        case '#ebebeb':
          return 'hover:shadow-[0_0_0_2px_#ebebeb]';
        case '#d0d0d0':
          return 'hover:shadow-[0_0_0_2px_#d0d0d0]';
        case '#50e3c2':
          return 'hover:shadow-[0_0_0_2px_#50e3c2]';
        case '#6ccaff':
          return 'hover:shadow-[0_0_0_2px_#6ccaff]';
        case '#fdafff':
          return 'hover:shadow-[0_0_0_2px_#fdafff]';
        case '#ffd748':
          return 'hover:shadow-[0_0_0_2px_#ffd748]';
        case '#ff6464':
          return 'hover:shadow-[0_0_0_2px_#ff6464]';
        case '#c0e1ff':
          return 'hover:shadow-[0_0_0_2px_#c0e1ff]';
        default:
          return 'hover:shadow-[0_0_0_2px_#aaf1e7]';
      }
    },
  },
  methods: {
    handleClickNFTDetails() {
      this.$emit('view-details');
    },
    handleClickViewContent() {
      if (this.isContentViewable) {
        this.$emit('view-content');
      }
    },
    handleClickCollect() {
      this.$emit('collect');
    },
    handleClickLike() {
      this.$emit('like');
    },
  },
};
</script>
