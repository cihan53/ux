<script setup lang="ts">
import type { BadgeSize,BadgeColor,BadgeVariant } from '#ui/types'

interface Props {
  value: string[]
  size?: BadgeSize
  color?: BadgeColor
  variant?: BadgeVariant
  onclick?: (row: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  variant: 'subtle'
})

</script>

<template>
  <div class="flex gap-2 flex-wrap">
    <UBadge 
      v-for="item in value" 
      :key="item"
      :label="item"
      :size="size"
      :color="color"
      :variant="variant"
      @click="onclick ? onclick(item) : null"
    />
  </div>
</template> 