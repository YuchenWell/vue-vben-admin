<template>
  <HoverCardRoot v-bind="forwarded">
    <slot></slot>
  </HoverCardRoot>
</template>

<script setup lang="ts">
import type { HoverCardRootEmits, HoverCardRootProps } from 'radix-vue';

import { HoverCardRoot, useForwardPropsEmits } from 'radix-vue';

const props = defineProps<HoverCardRootProps>();
const emits = defineEmits<HoverCardRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>
