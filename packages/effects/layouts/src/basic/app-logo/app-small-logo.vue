<script lang="ts" setup>
import { computed } from 'vue';

import { preferences } from '@vben/preferences';

interface Props {
  /**
   * @zh_CN 是否显示logo
   */
  size?: number;
}

defineProps<Props>();

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.smallSource);
</script>

<template>
  <img :alt="appName" :src="logo" :width="size" />
</template>
