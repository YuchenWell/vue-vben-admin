<template>
  <ContextMenuGroup v-bind="props">
    <slot></slot>
  </ContextMenuGroup>
</template>

<script setup lang="ts">
import type { ContextMenuGroupProps } from 'radix-vue';

import { ContextMenuGroup } from 'radix-vue';

const props = defineProps<ContextMenuGroupProps>();
</script>
