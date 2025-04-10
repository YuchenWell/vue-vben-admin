<script lang="ts" setup>
import { computed } from 'vue';

import { preferences } from '@vben/preferences';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.fullSource);
</script>

<template>
  <img :alt="appName" :src="logo" class="block" />
</template>
