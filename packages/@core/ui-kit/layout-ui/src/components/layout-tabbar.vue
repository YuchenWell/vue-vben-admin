<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

interface Props {
  /**
   * 类名
   */
  class?: any;
  /**
   * 高度
   */
  height: number;
}

const props = defineProps<Props>();

const style = computed((): CSSProperties => {
  const { height } = props;
  return {
    height: `${height}px`,
  };
});
</script>

<template>
  <section
    :style="style"
    :class="
      cn(
        'border-border bg-background flex w-full border-b transition-all',
        props.class,
      )
    "
  >
    <slot></slot>
  </section>
</template>
