<script lang="ts" setup>
import type { ThemeModeType } from '@vben/types';

import { computed } from 'vue';

import { preferences } from '@vben/preferences';

defineOptions({ name: 'AppFullLogo' });

interface Props {
  /**
   * 主题
   */
  theme?: ThemeModeType;
}

// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
});

const appName = computed(() => preferences.app.name);

const logoSrc = computed(() => {
  return props.theme === 'light'
    ? '/brand/images/logo-full-light.png'
    : '/brand/images/logo-full-dark.png';
});
</script>
<template>
  <img :alt="appName" :src="logoSrc" class="block" />
</template>
