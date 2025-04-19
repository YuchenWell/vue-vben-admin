<script lang="ts" setup>
import { computed } from 'vue';

import { preferences } from '@vben/preferences';

defineOptions({ name: 'AppSmallLogo' });

const appName = computed(() => preferences.app.name);

const logoSrc = computed(() => {
  return new URL('/brand/images/logo.png', import.meta.url).href;
});
</script>

<template>
  <img :alt="appName" :src="logoSrc" class="block" />
</template>
