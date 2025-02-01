<template>
  <div :class="gridClasses"  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  columns: {
    type: Number,
    default: 1
  },
  gap: {
    type: [Number, String],
    default: 4
  },
  class: {
    type: String,
    default: ''
  }
})

const gridClasses = computed(() => {
  return [
    'grid',
    `grid-cols-${props.columns}`,
    `gap-${props.gap}`,
    props.class
  ]
})

 
</script> 