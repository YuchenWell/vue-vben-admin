<template>
  <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
    <p class="text-foreground mb-2 text-lg font-bold">
      <slot name="welcome"></slot>
    </p>

    <h2
      class="text-foreground mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl"
    >
      <slot name="title"></slot>
    </h2>
  </div>
</template>
