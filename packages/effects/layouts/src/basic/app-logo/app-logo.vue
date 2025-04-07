<template>
  <div v-if="logo" class="absolute left-0 top-0 z-10 flex flex-1">
    <div
      class="text-foreground lg:text-foreground ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6"
    ></div>
  </div>

  <img :alt="appName" :src="logo" class="mr-2" width="242" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { preferences } from '@vben/preferences';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);
</script>
