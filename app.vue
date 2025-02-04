<template>
  <UContainer>
    <Panel class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h1>Welcome to Nuxt UI Starter</h1>
          <ColorScheme><USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" /></ColorScheme>
        </div>
      </template>
      <UButton icon="i-heroicons-book-open" to="https://ui.nuxt.com" target="_blank">Open Nuxt UI Documentation</UButton>
    </Panel>


    <Panel class="mt-10">
      <Table :data="data" :columns="columns" :pagination="{
        pageSize:5
      }" />
    </Panel>

    <Panel class="mt-10">
      <Table :data="data" :columns="columns" :filter-bar="true" :pagination="{
        pageSize:10
      }"/>
    </Panel>
  </UContainer>
</template>
<script setup lang="ts">
 
import Panel from "./src/components/Panel.vue";
import Table from "./src/components/data/table/Table.vue";
import fakeUseData from "./data/users";
const columns:any[]=[
  {
    key: 'name',
    label: 'Name',
    resize: true,
    filter: {
      type: 'string',
      props: {
        placeholder: 'Search name...'
      }
    }
  },
  {
    key: 'surname',
    label: 'Surname',
    sortable: true,
    filter: {
      type: 'select',
      props: {
        placeholder:  'Search surname...' ,
        data:[
          'Wade Cooper',
          'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer'
        ]
      }
    }
  },
  {
    key: 'userAnalyticsDetail.lastLoginDate',
    label: 'Tarih',
    filter: {
      type: 'datepicker',
      props: {
        placeholder: 'Tarih seçin',
        format: 'dd.MM.yyyy'
      }
    }
  },
  { key: 'roles', label: 'Roles', xtype: 'UBadgeList' , propsData: { color:"gray",size:"xs", onclick:(row:any)=>{} }},
  { key: 'email', label: 'Email' ,filter: {
      type: 'string',
      props: {
        placeholder: 'Search surname...'
      }
    }},

  { key: 'developerId', label: 'Developer ID' },
  { key: 'companyRole', label: 'Company Role' },
  { key: 'userType', label: 'User Type', width: '200px' },
];
const data:any[]=fakeUseData;
</script>