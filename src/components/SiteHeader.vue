<template>
  <div
    :class="[
      'flex',
      'items-center',
      'justify-between',
      'gap-x-[24px]',
      'w-full',
      'pl-[32px]',
      'pr-[24px]',
      'py-[40px]',
      'laptop:pr-[32px]',
      'laptop:pl-[56px]',
    ]"
  >
    <NuxtLink
      class="w-[90px] hover:scale-105 active:scale-100 transition-transform"
      :disabled="getHomeRoute.name === $route.name"
      :to="getHomeRoute"
    >
      <Logo class="fill-current" />
    </NuxtLink>

    <div class="relative flex items-center gap-x-[16px] laptop:gap-x-[24px]">
      <!-- locale -->
      <Dropdown>
        <template v-slot:trigger="{ toggle }">
          <ButtonV2
            preset="tertiary"
            @click="toggle"
          >
            <GlobeIcon class="w-20 h-20 fill-like-green" />
          </ButtonV2>
        </template>
        <Menu
          :items="availableLocales"
          :selected-value="currentLocale"
          @select="handleSelectLocale"
        />
      </Dropdown>

      <ButtonV2
        v-if="!getAddress"
        class="hidden laptop:flex"
        preset="secondary"
        :text="$t('header_button_connect_to_wallet')"
        @click="connectWallet"
      >
        <template #prepend>
          <IconLogin />
        </template>
      </ButtonV2>

      <Dropdown>
        <template v-slot:trigger="{ toggle }">
          <ButtonV2
            v-if="!getAddress"
            class="-mr-[8px]"
            preset="plain"
            @click="toggle"
          >
            <IconNav />
          </ButtonV2>
          <Identity
            v-else
            class="cursor-pointer"
            :avatar-url="walletUserAvatar"
            :avatar-size="42"
            :is-avatar-outlined="isWalletUserCivicLiker"
            @click="toggle"
          />
        </template>
        <Menu
          :items="mainMenuItems"
          @select="handleSelectMenuItem"
        >
          <template
            v-if="getAddress"
            #prepend
          >
            <a
              class="flex flex-col items-center px-[24px] py-[12px] cursor-pointer"
              href="https://dao.like.co/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <div
                class="text-center text-like-green text-[32px] font-600"
              >{{ balance }}</div>
              <div
                class="text-medium-gray text-[12px] leading-[1]"
              >{{ $t('header_menu_LIKE') }}</div>
            </a>
          </template>
        </Menu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import walletMixin from '~/mixins/wallet';
import { ellipsis } from '~/util/ui';

import Logo from '~/assets/icons/logo.svg?inline';
import GlobeIcon from '~/assets/icons/globe.svg?inline';

export default {
  name: 'SiteHeader',
  filters: {
    ellipsis,
  },
  components: {
    Logo,
    GlobeIcon,
  },
  mixins: [walletMixin],
  computed: {
    ...mapGetters([
      'getHomeRoute',
      'getAvailableLocales',
      'getLocale',
      'getUserId',
    ]),
    currentLocale() {
      return this.getLocale;
    },
    availableLocales() {
      return this.getAvailableLocales.map(locale => ({
        value: locale,
        name: this.$t(`Locale.${locale}`),
      }));
    },
    mainMenuItems() {
      const options = [
        { value: 'profile', name: 'Profile' },
        { value: 'civic', name: 'Civic Liker' },
      ];

      if (this.getUserId) {
        options.push({ value: 'setting', name: 'Setting' });
      }

      if (this.getAddress) {
        options.push({ value: 'signOut', name: 'Sign Out' });
      }

      return options;
    },
  },
  async mounted() {
    await this.initIfNecessary();
  },
  methods: {
    ...mapActions(['updatePreferences']),
    handleSelectLocale(value) {
      this.$i18n.locale = value;
      this.updatePreferences({ locale: value });
    },
    async handleSelectMenuItem(value) {
      switch (value) {
        case 'profile': {
          await this.navigateToWalletDashboard();
          break;
        }

        case 'civic':
          this.$router.push({ name: 'civic' });
          break;

        case 'setting':
          this.$router.push({ name: 'setting' });
          break;

        case 'signOut':
          this.disconnectWallet();
          break;

        default:
          break;
      }
    },
  },
};
</script>