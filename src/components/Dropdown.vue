<template>
  <div>
    <DropdownMenu
      ref="dropdown"
      class="w-[inherit]"
      :direction="direction"
      :close-on-click-outside="closeOnClickOutside"
      :overlay="false"
      v-on="$listeners"
    >
      <template #trigger>
        <slot v-bind="{ toggle }" name="trigger" />
      </template>

      <template #body>
        <div @click="handleBodyClick">
          <slot />
        </div>
      </template>
    </DropdownMenu>
  </div>
</template>

<script>
import DropdownMenu from 'v-dropdown-menu/vue2';

export default {
  components: {
    DropdownMenu,
  },
  props: {
    direction: {
      type: String,
      default: 'right',
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    closeOnChildClick: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    toggle() {
      // TODO: Deprecated. Remove this method in the future.
    },
    handleBodyClick() {
      if (this.closeOnChildClick && this.$refs.dropdown) {
        this.$refs.dropdown.hide();
      }
    },
  },
};
</script>

<style>
.v-dropdown-menu .v-dropdown-menu__container {
  overflow: unset;

  margin: 8px 0;

  background-color: transparent;
  border: none;
}
</style>
