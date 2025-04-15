<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { VbenSpinner } from '@vben/common-ui';
import { useAppConfig } from '@vben/hooks';
import { useAccessStore } from '@vben/stores';

const accessStore = useAccessStore();
const spining = ref<boolean>(true);

const route = useRoute();

const query = route.query;

const { v2URL } = useAppConfig(import.meta.env, import.meta.env.PROD);

const src = `${v2URL}/#/embed-in-v3?token=${accessStore.accessToken}&pagePermission=${query.permission}`;

const onIframeLoad = () => {
  spining.value = false;
};
</script>

<template>
  <div class="relative size-full">
    <VbenSpinner :spinning="spining" />

    <iframe class="size-full" :src="src" @load="onIframeLoad"></iframe>
  </div>
</template>
