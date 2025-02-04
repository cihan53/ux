<script setup lang="ts">
// @ts-ignore
import type { ProgressColor, ProgressAnimation } from '#ui/types'
// @ts-ignore
import type { StoreDefinition } from 'pinia';

import UBadgeList from './../../BadgeList.vue'
import UGrid from './../../UGrid.vue'
import UCol from './../../UCol.vue'


const StringFilter = defineAsyncComponent(() =>
  import('./filter-bar/StringFilter.vue')
)

const SelectFilter = defineAsyncComponent(() =>
  import('./filter-bar/SelectFilter.vue')
)

const DatepickerFilter = defineAsyncComponent(() =>
  import('./filter-bar/DatePickerFilter.vue')
)


const filterComponents: any = {
  StringFilter,
  SelectFilter,
  DatepickerFilter,
};

// const { asyncComponent, loadError } = useAsyncComponent(selectedComponent);


export interface Column {
  key: string
  label: string
  sortable?: boolean
  direction?: 'asc' | 'desc'
  class?: string
  rowClass?: string
  width?: string
  hidden?: boolean
  resize?: boolean
  sort?: (a: any, b: any) => number
  filter?: boolean | {
    type: 'select' | 'datepicker' | 'string' | 'numeric' | 'boolean'
    props?: Record<string, any>
  }
  render?: (row: any) => any
  xtype?: string
  propsData?: Record<string, any>
}

interface Pagination {
  enabled?: boolean
  pageSize?: number
  totalCount?: number
  currentPage?: number
  showFirst?: boolean
  showLast?: boolean
  onPageChange?: (page: number) => void
}

interface Props {
  store?: StoreDefinition

  data: any[]
  columns: Column[]
  pagination?: boolean | Pagination
  loading?: boolean
  filterBar?: boolean
  filterInline?: boolean
  progress?: {
    color: ProgressColor,
    animation: ProgressAnimation
  }
  loadingState?: {
    icon: string
    label: string
  }
  modelValue?: any[]
  emptyState?: () => string
}

/**
 * Props
 */
const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: any[]]
}>()

const selection = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
})


// const { ui: { table } } = useAppConfig()
const sortButton = ref({ icon: "i-heroicons-arrows-up-down-20-solid" })
const sortAscIcon = 'i-heroicons-bars-arrow-up-20-solid'
const sortDescIcon = 'i-heroicons-bars-arrow-down-20-solid'
const headerMenuItems = computed(() => [
  [{
    label: 'ASC',
    key: 'sort-asc',
    icon: 'i-heroicons-bars-arrow-up-20-solid',
    click: () => {
      console.log('Edit')
    }
  }, {
    label: 'DESC',
    key: 'sort-desc',
    icon: 'i-heroicons-bars-arrow-down-20-solid',
  }],
  ...(!props.filterBar ? [[{
    label: 'Filter',
    key: 'filter-bar',
    icon: 'i-heroicons-funnel-solid'
  }]] : []),
  [{
    label: 'Columns',
    icon: 'i-heroicons-table-cells-20-solid',
    children: [props.columns.map((col: any) => ({
      label: col.label,
      key: col.key,
      icon: 'i-heroicons-check',
      //checked: visibleColumns.value.has(col.key),
      //disabled: visibleColumns.value.size === 1 && visibleColumns.value.has(col.key),
      click: () => {
        toggleColumn(col.key)
      }
    }))]
  }]
])

/**
 * Variables
 */
const totalCount = ref(props.data.length)
const currentPage = ref(1)
const filterValue = ref('');
const storeData = ref<any[]>([])
const internalLoading = ref(false)
const internalTotalCount = ref(0)
const visibleColumns = ref(props.columns.map((col: any) => col.key));
const columns = ref(props.columns);

// Resize işlemleri için yeni ref'ler ekleyelim
const isResizing = ref(false)
const resizingColumn = ref<string | null>(null)
const startX = ref(0)
const startWidth = ref(0)



const selectedColumns = computed(() => {
  let c =  columns.value.map((col: any) => {
    if (props.filterBar) {
      return {
        width: col.width ? `${Math.max(parseInt(col.width), 100)}px` : '100px',
        ...col,
        hidden: !visibleColumns.value.includes(col.key)
      }
    }
    return {
      ...col,
      hidden: !visibleColumns.value.includes(col.key)
    }
  }); 
  
  return c
});



// Store yönetimi
const storeInstance = computed(() => props.store ? props.store() : null)


// Data kaynağını belirle
const resolvedData = computed(() => {
  return props.store ? storeData.value : paginateData(props.data, currentPage.value, paginationConfig.value.pageSize)
})

/**
 * Pagination Config
 */
const paginationConfig = computed(() => {
  if (typeof props.pagination === 'boolean') {
    return {
      enabled: props.pagination,
      pageSize: 20,
      showFirst: true,
      showLast: true,
      totalCount: props.store ? internalTotalCount.value : totalCount.value,
      currentPage: currentPage.value
    }
  }
  return {
    enabled: true,
    pageSize: 20,
    showFirst: true,
    showLast: true,
    totalCount: props.store ? internalTotalCount.value : totalCount.value,
    currentPage: currentPage.value,
    ...props.pagination
  }
})


defineExpose({
  currentPage
})


// Store'dan veri yükleme
async function loadStoreData() {
  if (!storeInstance.value?.list) return

  try {
    internalLoading.value = true
    const response = await storeInstance.value.list({
      page: currentPage.value,
      pageSize: paginationConfig.value.pageSize
    })

    storeData.value = response.data
    internalTotalCount.value = response.totalCount
  } finally {
    internalLoading.value = false
  }
}

const paginateData = (data: any, currentPage: number, pageSize: number) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}



/**
 * Toggle Column
 */
const toggleColumn = (key: string) => {
  if (visibleColumns.value.includes(key)) {
    if (visibleColumns.value.length > 1) { // En az bir kolon görünür olmalı
      visibleColumns.value = visibleColumns.value.filter((k: any) => k !== key)
    }
  } else {
    visibleColumns.value = [...visibleColumns.value, key]
  }
}
/**
 * Capitalize
 */
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Handle Filter
 */
const handleFilter = (key: string, value: any) => {
  // Filter işlemleri burada yapılacak
  console.log(`Filtering ${key} with value:`, value)
}

// Resize işlemlerini yöneten fonksiyonlar
const startResize = (e: MouseEvent, columnKey: string, currentWidth: string) => {
  const column = columns.value.find((col: any) => col.key === columnKey)
  // Eğer resize özelliği açık değilse işlemi engelle
  if (!column?.resize) return

  isResizing.value = true
  resizingColumn.value = columnKey
  startX.value = e.pageX
  startWidth.value = parseInt(currentWidth || '200')

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResize)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isResizing.value) return
  const diff = e.pageX - startX.value
  const newWidth = Math.max(100, startWidth.value + diff) // minimum 100px

  // Kolonun genişliğini güncelle
  const columnIndex = columns.value.findIndex((col: any) => col.key === resizingColumn.value)
  if (columnIndex !== -1) {
    columns.value[columnIndex].width = `${newWidth}px`
  }

}

const stopResize = () => {
  isResizing.value = false
  resizingColumn.value = null
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
}

const thClass = computed(() => {
  return {
    checkbox: {
      padding: props.filterBar ? 'pe-4' : 'ps-4'
    },
    th: {
      base: `text-left rtl:text-right relative ${props.filterBar ? 'border border-gray-200 dark:divide-gray-700 dark:border-gray-700 whitespace-nowrap' : 'border border-gray-200 dark:border-gray-700'}`,
      padding: props.filterBar ? 'px-0 py-0' : 'px-4 py-3.5',
    },
    td: {
      base: 'whitespace-nowrap'
    }
  }
})


// Throttle fonksiyonu ekleyelim
const throttle = (fn: Function, wait: number) => {
  let time = Date.now()
  return function (...args: any[]) {
    if ((time + wait - Date.now()) < 0) {
      fn(...args)
      time = Date.now()
    }
  }
}

// handleMouseMove'u throttle edelim
//const throttledMouseMove = throttle(handleMouseMove, 16) // 60fps



watch(() => props.data.length, (newLength) => {
  totalCount.value = newLength
})

watch(() => paginationConfig.value.currentPage, (newPage) => {
  currentPage.value = newPage
})

watch(() => currentPage.value, (newPage) => {
  if (typeof props.pagination === 'object' && props.pagination.onPageChange) {
    props.pagination.onPageChange(newPage)
  }
})


// TotalCount'u güncelle
watch(() => props.store, async (newStore) => {
  if (newStore) await loadStoreData()
})

// Pagination değişikliklerini izle
watch([currentPage, paginationConfig], async () => {
  if (props.store) await loadStoreData()
})




// Initial load
onMounted(async () => {
  if (props.store) await loadStoreData()
})

 
</script>

<template>
  <div>
    <UTable v-model="selection" :rows="resolvedData" :loading="loading || internalLoading" :columns="selectedColumns.filter((col:any) => col.hidden === false)"
      :progress="progress" :loading-state="loadingState" :ui="{
        wrapper: 'min-h-full',
        ...thClass,
      }" :pagination="paginationConfig">

      <template v-for="col in columns" :key="'data-row-' + col.key" #[`${col.key}-data`]="{ row }">
        <ClientOnly>
        <template v-if="col.xtype">
          <UBadgeList v-if="col.xtype === 'UBadgeList'" :value="row[col.key]" v-bind="col.propsData || {}" />
          <component v-else :is="col.xtype" :value="row[col.key]" />
        </template>
        <template v-else-if="col.render">
          {{ col.render(row) }}
        </template>
        <template v-else>
          {{ row[col.key] }}
        </template>
      </ClientOnly>
      </template>

      <template #empty-state>
        <template v-if="props.emptyState">
          {{ props.emptyState() }}
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm">No one here!</span>
            <!-- <UButton label="Add people" /> -->
          </div>
        </template>
      </template>

      <!-- Filter Bar -->
      <template v-for="col in columns" :key="'header-' + col.key" #[`${col.key}-header`]="{ column, sort, onSort }">
        <ClientOnly>
          <div class="flex flex-col group relative" :style="{ minWidth: column.width }" v-if="props.filterBar">
            <div class="w-full gap-1 pl-2 divide-x divide-gray-200 border-b border-gray-200 dark:divide-gray-700 dark:border-gray-700  flex items-center justify-between ">
              <span class="text-sm py-2 ">{{ column.label }}</span>
              <UDropdown class="opacity-0 group-hover:opacity-100 h-full h-fit h-8" :items="headerMenuItems"
                :popper="{ placement: 'bottom-start', padding: 'p-1 dropdown-item dropdown' }">
                <UButton variant="ghost" size="2xs" color="gray" class="rounded-none  ">
                  <UIcon name="i-heroicons-chevron-down-16-solid" />
                </UButton>
                <template #item="{ item }">
                  <template v-if="!item.children">
                    <span class="truncate">{{ item.label }}</span>
                    <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                  </template>
                  <template v-else>
                    <UDropdown :close-delay="400" mode="hover" :items="item.children" :ui="{ wrapper: 'w-full' }"
                      :popper="{ placement: 'right-start', padding: 'p-1 dropdown-item dropdown' }">
                      <span class="truncate">{{ item.label }}</span>
                      <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                      <template #item="{ item: subItem }">
                        <span class="truncate"
                          :class="{ 'text-gray-400': (!visibleColumns.has(subItem.key) || subItem.hidden) }">{{
                            subItem.label
                          }}</span>
                        <UIcon color="gray" :name="subItem.icon"
                          class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                      </template>
                    </UDropdown>
                  </template>

                </template>
              </UDropdown>
            </div>
            <div class="h-8 ">
              <component class="h-8 border-b-0" v-if="typeof col.filter === 'object' && col.filter.type"
                :is="filterComponents[`${capitalize(col.filter.type)}Filter`]" :value="filterValue"
                :placeholder="col.filter.props?.placeholder" v-bind="column.filter.props || {}"
                @update:model-value="(value: any) => handleFilter(column.key, value)" />
            </div>
            
          </div>
          <div v-else-if="props.filterInline" class="flex items-center justify-between gap-1">
            <span class="flex-2">{{ column.label }}</span>
            <div class="flex items-end">
              <UButton v-if="column.sortable"
                :icon="(!sort.column || sort.column !== column.key) ? (sortButton.icon) : sort.direction === 'asc' ? sortAscIcon : sortDescIcon"
                color="gray" variant="ghost" size="xs" @click="onSort(column)" />
              <UPopover v-if="column.filter" :ui="{
                container: 'z-50 group !overflow-visible ',
                base: 'min-w-[200px] !overflow-visible ',
              }" :popper="{ arrow: true }">
                <UButton icon="i-heroicons-funnel-solid" color="gray" variant="ghost" size="xs" />
                <template #panel>
                  <div class="p-2">
                    <component v-if="typeof column.filter === 'object'" :is="`U${capitalize(column.filter.type)}`"
                      v-bind="column.filter.props || {}"
                      @update:model-value="(value: any) => handleFilter(column.key, value)" />
                    <UInput v-else placeholder="Search..."
                      @update:model-value="value => handleFilter(column.key, value)" />
                  </div>
                </template>
              </UPopover>
            </div>
          </div>
          <div v-else class="flex items-center justify-between gap-1 divide-x divide-gray-200  dark:border-gray-700">
            <span class="flex-2">{{ column.label }}</span>
            <UDropdown :items="headerMenuItems" :popper="{ placement: 'bottom-start' }">
              <UButton variant="ghost" size="2xs" color="gray" class="rounded-none">
                <UIcon name="i-heroicons-chevron-down-16-solid" />
              </UButton>
              <template #panel>
                <div class="p-2">
                  <UInput placeholder="Search..." />
                </div>
              </template>
            </UDropdown>
          </div>
          <div v-if="column.resize"
              class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-500 opacity-100 group-hover:opacity-100 transition-opacity"
              @mousedown="(e: any) => startResize(e, column.key, column.width)">
              
            </div>
        </ClientOnly>
      </template>


    </UTable>
    <div class="flex items-end gap-1" v-if="paginationConfig.enabled">
      <div class="ml-auto flex items-center gap-4">
        <div class="flex items-center gap-2">
          <UPagination v-model="currentPage" :page-count="paginationConfig.pageSize" :total="totalCount"
            :show-first="paginationConfig.showFirst" :show-last="paginationConfig.showLast" :ui="{ wrapper: 'mt-4' }" />
        </div>
        <div class="  place-self-end  ">
          <UPopover :popper="{ placement: 'top-end' }">
            <UButton icon="i-heroicons-cog-8-tooth" size="sm" variant="ghost" color="gray" class="flex items-center" />
            <template #panel="{ close }">
              <div class="p-4 w-[500px]">
                <UGrid :columns="2" :gap="4">
                  <UCol>
                    <UFormGroup label="Page Size" class="mb-4">
                      <USelect v-model="paginationConfig.pageSize" :options="[10, 20, 50, 100]" />
                    </UFormGroup>
                    <UFormGroup label="Current Page" class="mb-4">
                      <UInput type="number" v-model.number="currentPage" :min="1"
                        :max="Math.ceil(totalCount / paginationConfig.pageSize)" />
                    </UFormGroup>
                  </UCol>
                  <UCol>
                    <UFormGroup label="Visible Columns">
                      <div class="space-y-2" :class="{ 'max-h-96 overflow-y-auto': columns.length > 5 }">
                        <div v-for="col in columns" :key="col.key" class="flex items-center justify-between">
                          <span>{{ col.label }}</span>
                          <UToggle :model-value="visibleColumns.includes(col.key)"
                            @update:model-value="toggleColumn(col.key)" />
                        </div>
                      </div>
                    </UFormGroup>
                  </UCol>
                </UGrid>
              </div>

            </template>
          </UPopover>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
 
/* Resize sırasında text seçimini engelle */
:deep(*) {
  user-select: none;
}
/* Resize işlemleri için stiller */
:deep(.cursor-col-resize) {
  cursor: col-resize;
  background-color: var(--color-primary-500);
}



/* Resize çizgisi için hover efekti */
:deep(.group:hover .cursor-col-resize) {
  background-color: var(--color-primary-500);
}

/* Resize işlemi sırasında body cursor'ını değiştir */
:global(body.resizing) {
  cursor: col-resize;
}
</style>