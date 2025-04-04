<template>
  <DropdownMenuGroup v-bind="props">
    <slot></slot>
  </DropdownMenuGroup>
</template>

<script setup lang="ts">
import type { DropdownMenuGroupProps } from 'radix-vue';

import { DropdownMenuGroup } from 'radix-vue';

const props = defineProps<DropdownMenuGroupProps>();
</script>
