<template>
  <div :class="colClasses" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  span: {
    type: [Number, String],
    default: 1,
    validator: (value: string | number) => {
      const num = Number(value)
      return num >= 1 && num <= 12
    }
  },
  offset: {
    type: [Number, String],
    default: 0,
    validator: (value: string | number) => {
      const num = Number(value)
      return num >= 0 && num <= 11
    }
  },
  align: {
    type: String,
    default: 'start',
    validator: (value: string) => ['start', 'center', 'end', 'stretch'].includes(value)
  },
  class: {
    type: String,
    default: ''
  }
})

const colClasses = computed(() => [
  `col-span-${props.span}`,
  props.offset > 0 ? `col-start-${Number(props.offset) + 1}` : '',
  `items-${props.align}`,
  props.class
])

const style = computed(() => ({
  gridColumn: props.span === 'full' ? '1 / -1' : undefined
}))
</script> 