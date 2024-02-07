import { apiRoutes } from '@/routes'
import type {
  HistoryRecord,
  HistoryRecordClearResponse,
  HistoryRecordResponse,
  MonitoredWebsite,
  MonitoredWebsiteCreate,
  MonitoredWebsiteResponse,
  MonitoredWebsiteUpdate,
  MonitorSettings,
  MonitorSettingsUpdate,
} from '@/types'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query'

interface PaginationOptions {
  offset?: number
  limit?: number
}


export const useGetMonitorSettings = (options: UseQueryOptions<MonitorSettings> = {}) => {
  return useQuery<MonitorSettings>(
    ['settings'],
    async () => {
      const resp = await axios.get<MonitorSettings>(apiRoutes.getSettings)
      return resp.data
    },
    {
      ...options
    }
  )
}

export const useUpdateMonitorSettings = () => {
  const queryClient = useQueryClient()

  return useMutation<MonitorSettings, unknown, MonitorSettingsUpdate>(
    async (settings: MonitorSettingsUpdate) => {
      const resp = await axios.patch(apiRoutes.updateSettings, settings)
      return resp.data
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['settings'], data)
      },
      onMutate: async (settings) => {
        // preform optimistic update
        const previousData = queryClient.getQueryData<MonitorSettings>(['settings'])
        queryClient.setQueryData(
          ['settings'],
          {
            ...previousData,
            ...settings,
          }
        )
        return { previousData }
      },
    }
  )
}

export const useGetWebsiteHistory = (id: number, paginationOptions: PaginationOptions = {}) => {
  const queryClient = useQueryClient()

  return useQuery<HistoryRecord[]>(
    ['history', id, paginationOptions].join('-'),
    async () => {
      const resp = await axios.get<HistoryRecordResponse[]>(
        apiRoutes.getWebsiteHistory(id),
        { params: paginationOptions },
      )
      return resp.data.map((record) => ({
        ...record,
        createdAt: new Date(record.createdAt),
      }))
    },
    {
      onSuccess: (data) => {
        if (data.length === 0) {
          queryClient.setQueryData(['history', id, 'latest'], {})
        } else {
          queryClient.setQueryData(['history', id, 'latest'], data[0])
        }
      }
    }
  )
}

export const useClearWebsiteHistory = () => {
  const queryClient = useQueryClient()

  return useMutation<HistoryRecordClearResponse, unknown, number>(
    async (id: number) => {
      const resp = await axios.delete(apiRoutes.clearWebsiteHistory(id))
      return {
        ...resp.data,
        id,
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['history', data.id])
      },
    }
  )
}

export const useGetLatestWebsiteHistory = (id: number, kind: 'latest' | 'avg', options: UseQueryOptions<HistoryRecord> = {}) => {
  return useQuery<HistoryRecord>(
    ['history', id, 'latest', kind],
    async () => {
      const resp = await axios.get<HistoryRecordResponse>(
        apiRoutes.getLatestWebsiteHistory(id),
        { params: { kind } },
      )
      return {
        ...resp.data,
        createdAt: new Date(resp.data.createdAt),
      }
    },
    {
      ...options
    }
  )
}

export const useGetAllMonitoredWebsites = (options: UseQueryOptions<MonitoredWebsite[]> = {}) => {
  return useQuery<MonitoredWebsite[]>(
    ['monitored-websites'],
    async () => {
      const resp = await axios.get<MonitoredWebsiteResponse[]>(
        apiRoutes.getAllMonitoredWebsites,
      )
      return resp
        .data
        .map((website) => ({
          ...website,
          createdAt: new Date(website.createdAt),
          updatedAt: new Date(website.updatedAt),
        }))
        .sort((a, b) => a.id - b.id)
    },
    {
      ...options
    }
  )
}

export const useCreateMonitoredWebsite = () => {
  const queryClient = useQueryClient()

  return useMutation<MonitoredWebsite, unknown, MonitoredWebsiteCreate>(
    async (website: MonitoredWebsiteCreate) => {
      const resp = await axios.put(apiRoutes.createMonitoredWebsite, website)
      return {
        ...resp.data,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['monitored-websites'])
        queryClient.invalidateQueries(['history'])
      }
    }
  )
}

export const useDeleteMonitoredWebsite = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (id: number) => axios.delete(apiRoutes.deleteMonitoredWebsite(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['monitored-websites'])
      },
      onMutate: (id) => {
        // preform optimistic update
        const previousData = queryClient.getQueryData<MonitoredWebsite[]>(
          ['monitored-websites']
        )
        if (previousData) {
          queryClient.setQueryData<MonitoredWebsite[]>(
            ['monitored-websites'],
            previousData.filter((item) => item.id !== id)
          )
        }
        return { previousData }
      }
    }
  )
}

export const useUpdateMonitoredWebsite = () => {
  const queryClient = useQueryClient()

  return useMutation<MonitoredWebsite, unknown, MonitoredWebsiteUpdate>(
    async (website: MonitoredWebsiteUpdate) => {
      const { id, ...rest } = website
      const resp = await axios.patch(
        apiRoutes.updateMonitoredWebsite(id),
        rest
      )
      return {
        ...resp.data,
        createdAt: new Date(resp.data.createdAt),
        updatedAt: new Date(resp.data.updatedAt),
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['monitored-websites'])
      },
      onMutate: async (website) => {
        // preform optimistic update

        await queryClient.cancelQueries(['history', website.id])
        const previousData = queryClient.getQueryData<MonitoredWebsite[]>(
          ['monitored-websites']
        )
        if (previousData) {
          queryClient.setQueryData<MonitoredWebsite[]>(
            ['monitored-websites'],
            previousData.map((item) =>
              item.id === website.id ? { ...item, ...website } : item
            )
          )
        }
        return { previousData }
      },
    }
  )
}
