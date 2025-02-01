import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
  actions: {
    async list(params: { page: number, pageSize: number }) {
      const { data }:any = await useFetch('/api/users', { params })
      return {
        data: data.value.items,
        totalCount: data.value.total
      }
    }
  }
}) 