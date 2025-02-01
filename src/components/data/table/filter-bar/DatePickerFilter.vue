<script setup lang="ts">
import {sub, format, isSameDay, type Duration} from 'date-fns'
import DatePicker from "~/components/DatePicker.vue";
// const { t } = useI18n();

const props = defineProps<{
  value?: string
  placeholder?: string
  data?: any
  format?: string
}>()

const emit = defineEmits(['filter'])



const menuItems = computed(() => [
  [
      {
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
  },  {
    label: 'Between',
    key: 'between',
    icon: 'i-heroicons-arrows-right-left',
    click: () => {
      selectedFilterType.value = {
        label: 'Between',
        key: 'between',
        icon: 'i-heroicons-arrows-right-left',
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

const ranges = [
  {label: 'Last 7 days', duration: {days: 7}},
  {label: 'Last 14 days', duration: {days: 14}},
  {label: 'Last 30 days', duration: {days: 30}},
  {label: 'Last 3 months', duration: {months: 3}},
  {label: 'Last 6 months', duration: {months: 6}},
  {label: 'Last year', duration: {years: 1}}
]

const selectedFilterType = ref( {
  label: 'Contains',
  key: 'contains',
  icon: 'i-heroicons-magnifying-glass'
} )
const selectedDate = ref(null)
const selectedRange = ref({start: sub(new Date(), {days: 14}), end: new Date()})
const dateFormat = ref(props.format || 'd MMM, yyy')
const emitFilter = (value: any) => {
  emit('filter', {
    type: selectedFilterType.key,
    value: value,
    format: props.format,
    data: props.data
  })
}


function isRangeSelected(duration: Duration) {
  return isSameDay(selectedRange.value.start, sub(new Date(), duration)) && isSameDay(selectedRange.value.end, new Date())
}

function selectRange(duration: Duration) {
  selectedRange.value = {start: sub(new Date(), duration), end: new Date()}
}

watch(() => selectedDate.value, () => {
  emitFilter(selectedDate.value)
})

watch(() => selectedRange.value, () => {
  emitFilter(selectedRange.value)
})


</script>

<template>
  <div class="flex divide-x divide-gray-200  items-center justify-between">
    <div class="flex-1">
      <UDropdown :items="menuItems" :popper="{ placement: 'bottom-start', padding: 'p-1 dropdown-item dropdown' }">
        <UButton variant="ghost" size="2xs" color="gray" class="rounded-none  ">
          <UIcon :name="selectedFilterType.icon || ''" class="w-3 h-3"/>
        </UButton>
      </UDropdown>
    </div>

    <div class="flex-2 w-full">
      <UPopover :ui="{ base: 'min-w-[200px]' }">
        <div class="flex items-center">
          <UInput variant="none" size="2xs" readonly
                  :model-value="selectedDate && selectedFilterType.key !== 'between' ? format(selectedDate, dateFormat) : selectedRange && selectedFilterType.key === 'between' ? format(selectedRange.start, dateFormat) + ' - ' + format(selectedRange.end, dateFormat) : ''"
                  :placeholder="placeholder"/>
          <UIcon name="i-heroicons-calendar-20-solid"
                 class="flex-shrink-0 h-4 w-4 mr-1 text-gray-400 dark:text-gray-500"/>
        </div>
        <template #panel="{ close }">
          <DatePicker v-if="selectedFilterType.key !== 'between'" v-model="selectedDate"
                      :placeholder="placeholder"/>
          <template v-if="selectedFilterType.key === 'between'">
            <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
              <div class="hidden sm:flex flex-col py-4">
                <UButton v-for="(range, index) in ranges" :key="index" :label="range.label" color="gray"
                         variant="ghost" class="rounded-none px-6"
                         :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
                         truncate @click="selectRange(range.duration)"/>
              </div>

              <DatePicker v-model="selectedRange" @close="close"/>
            </div>
          </template>

        </template>
      </UPopover>
    </div>
  </div>
</template>