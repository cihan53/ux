<script setup lang="ts">
const props = defineProps<{
  value?: string
  placeholder?: string
}>()

const emit = defineEmits(['filter'])


const menuItems = computed(() => [
  [{
    label: 'Contains',
    key: 'contains',
    icon: 'i-heroicons-magnifying-glass',
    click: () => {
      selectedFilterType.value = {
        label: 'Contains',
        key: 'contains',
        icon: 'i-heroicons-magnifying-glass',
      };
    }
  }, {
    label: 'Equals',
    key: 'equals',
    icon: 'i-heroicons-equals',
    click: () => {
      selectedFilterType.value = {
        label: 'Equals',
        key: 'equals',
        icon: 'i-heroicons-equals',
      };
    }
  },
    {
      label: 'Start With',
      key: 'startsWith',
      icon: 'i-heroicons-play',
      click: () => {
        selectedFilterType.value = {
          label: 'Start With',
          key: 'startsWith',
          icon: 'i-heroicons-play',
        };
      }
    },
    {
      label: 'End With',
      key: 'endsWith',
      icon: 'i-heroicons-play-pause',
      click: () => {
        selectedFilterType.value = {
          label: 'End With',
          key: 'endsWith',
          icon: 'i-heroicons-play-pause',
        };
      }
    }

  ]
])


const selectedFilterType = ref({label: 'Equals', key: 'equals', icon: 'i-heroicons-equals'},)
const searchText = ref(props.value || '')

const emitFilter = () => {
  emit('filter', {
    type: selectedFilterType.value,
    value: searchText.value,
  })
}

watch(() => props.value, (newValue) => {
  searchText.value = newValue || ''
})
</script>

<template>
  <div class="flex divide-x divide-gray-200 relative   items-center justify-between">
    <div class="flex-1">
      <UDropdown :items="menuItems"
                 :popper="{ placement: 'bottom-start', padding: 'p-1 dropdown-item dropdown' }">
        <UButton variant="ghost" size="2xs" color="gray" class="rounded-none  ">
          <UIcon :name="selectedFilterType.icon || ''" class="w-3 h-3"/>
        </UButton>
      </UDropdown>
    </div>

    <div class="flex-2 w-full">
      <UInput v-model="searchText" variant="none" size="2xs" :placeholder="placeholder"
              @update:model-value="emitFilter"/>
    </div>
  </div>
</template>
