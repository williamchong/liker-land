<template>
  <section class="bg-like-green rounded-[24px] overflow-hidden py-[2rem]">
    <div
      v-if="normalizedList.length && shouldShowIscnOwner"
      class="flex items-center justify-between px-[2rem]"
    >
      <NFTMessageIdentity
        :type="iscnWorkAuthor ? 'publisher' : 'creator'"
        class="flex-shrink-0"
        :wallet-address="iscnOwner"
        :avatar-size="40"
        @click.native="handleHeaderAvatarClick"
      />
      <ButtonV2
        v-if="shouldShowFollowButton"
        :preset="isFollowed ? 'tertiary' : 'secondary'"
        size="mini"
        @click="handleFollowButtonClick"
      >
        {{ isFollowed ? $t('unfollow') : $t('follow') }}
      </ButtonV2>
    </div>
    <h2 v-else class="px-[2rem] text-like-cyan-light text-[1rem] font-[600]">
      {{ $t('nft_recommendation_list_other_title') }}
    </h2>

    <div
      v-if="isLoading"
      class="flex items-center justify-center min-h-[450px]"
    >
      <ProgressIndicator />
    </div>
    <div v-else class="relative mt-[1.5rem]">
      <Swiper
        ref="recommendationSwiper"
        :options="swiperOptions"
        @slider-move="handleSliderMove"
      >
        <SwiperSlide
          v-for="nft in normalizedList"
          :key="nft.classId"
          style="width: 310px;"
        >
          <NFTPortfolioItem
            class="shadow-lg mb-[12px] mx-auto"
            :class-id="nft.classId"
            :portfolio-wallet="iscnOwner"
            :should-fetch-when-visible="true"
            @click.native="handleItemClick(nft.classId)"
            @collect="handleItemCollect(nft.classId)"
          />
        </SwiperSlide>
      </Swiper>

      <div
        class="absolute inset-0 pointer-events-none flex justify-between items-center z-10 px-[1rem]"
      >
        <div
          class="absolute inset-y-0 left-0 w-[32px] bg-gradient-to-r from-like-green/25 to-like-green/0"
        />
        <div
          class="absolute inset-y-0 right-0 w-[32px] bg-gradient-to-l from-like-green/25 to-like-green/0"
        />
        <ButtonV2
          class="relative shadow-lg pointer-events-auto"
          preset="tertiary"
          :circle="true"
          @click="handleClickPrev"
        >
          <IconArrowLeft class="w-[20px]" />
        </ButtonV2>
        <ButtonV2
          class="relative shadow-lg pointer-events-auto"
          preset="tertiary"
          :circle="true"
          @click="handleClickNext"
        >
          <IconArrowLeft class="w-[20px] rotate-180" />
        </ButtonV2>
      </div>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

import { DEFAULT_RECOMMENDATIONS_LIST } from '~/constant';

import bookstoreMixin from '~/mixins/bookstore';

export default {
  name: 'NFTPageRecommendation',
  components: {
    Swiper,
    SwiperSlide,
  },
  mixins: [bookstoreMixin],
  props: {
    iscnOwner: {
      type: String,
      default: undefined,
    },
    isFollowed: {
      type: Boolean,
      default: false,
    },
    recommendedList: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    shouldShowFollowButton: {
      type: Boolean,
      default: false,
    },
    isBookNft: {
      type: Boolean,
      default: false,
    },
    displayItemCount: {
      type: [Number, String],
      default: 5,
    },
    shouldShowIscnOwner: {
      type: Boolean,
      default: true,
    },
    iscnWorkAuthor: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      nftFeaturedWNFT: DEFAULT_RECOMMENDATIONS_LIST.WNFT.map(nft => ({
        classId: nft,
      })),
    };
  },
  computed: {
    swiperOptions() {
      return {
        slidesPerView: 'auto',
        slidesOffsetAfter: 32,
        slidesOffsetBefore: 32,
        spaceBetween: 24,
      };
    },
    swiper() {
      return this.$refs.recommendationSwiper.$swiper;
    },
    nftFeaturedBooks() {
      return this.bookstoreListItemForLandingPage.length
        ? this.bookstoreListItemForLandingPage
        : [...DEFAULT_RECOMMENDATIONS_LIST.BOOK.map(nft => ({ classId: nft }))];
    },
    normalizedList() {
      const normalizedRecommendedList = [...this.recommendedList];
      const displayItemCount = Number(this.displayItemCount);
      if (this.recommendedList.length < displayItemCount) {
        let index = 0;
        let sourceData = this.isBookNft
          ? this.nftFeaturedBooks
          : this.nftFeaturedWNFT;
        // TODO: remove filter after recommendation support collection
        sourceData = sourceData.filter(nft =>
          // TODO: find out and fix classId undefined reason
          nft.classId?.startsWith('likenft1')
        );
        while (
          normalizedRecommendedList.length < displayItemCount &&
          index < sourceData.length
        ) {
          const itemToAdd = sourceData[index];
          const alreadyExists = normalizedRecommendedList.some(
            item => item.classId === itemToAdd.classId
          );

          if (!alreadyExists) {
            normalizedRecommendedList.push(itemToAdd);
          }
          index += 1;
        }
      }
      return normalizedRecommendedList;
    },
  },
  watch: {
    async recommendedList(list) {
      if (this.isBookNft && list.length < +this.displayItemCount) {
        try {
          await this.fetchBookstoreItemsFromCMSForLandingPage();
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
  methods: {
    handleHeaderAvatarClick() {
      this.$emit('header-avatar-click');
    },
    handleFollowButtonClick() {
      this.$emit('follow-button-click');
    },
    handleItemClick(classId) {
      this.$emit('item-click', classId);
    },
    handleItemCollect(classId) {
      this.$emit('item-collect', classId);
    },
    handleClickPrev() {
      this.$emit('slide-prev');
      this.swiper.slidePrev();
    },
    handleClickNext() {
      this.$emit('slide-next');
      this.swiper.slideNext();
    },
    handleSliderMove() {
      this.$emit('slider-move');
    },
  },
};
</script>

<style lang="scss">
@import 'swiper/swiper.scss';
</style>
