<script lang="ts" setup>
import { computed } from 'vue';

import { preferences } from '@vben/preferences';

defineOptions({ name: 'AppSmallLogo' });

const appName = computed(() => preferences.app.name);
</script>

<template>
  <img :alt="appName" src="/brand/images/logo.png" class="block" />
</template>
