import { apiRoutes } from '@/routes'
import type {
  HistoryRecord,
  HistoryRecordClearResponse,
  HistoryRecordResponse,
  MonitoredWebsite,
  MonitoredWebsiteCreate,
  MonitoredWebsiteResponse,
  MonitoredWebsiteUpdate,
} from '@/types'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'

interface PaginationOptions {
  offset?: number
  limit?: number
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

export const useGetLatestWebsiteHistory = (id: number) => {
  return useQuery<HistoryRecord>(
    ['history', id, 'latest'],
    async () => {
      const resp = await axios.get<HistoryRecordResponse>(
        apiRoutes.getLatestWebsiteHistory(id),
      )
      return {
        ...resp.data,
        createdAt: new Date(resp.data.createdAt),
      }
    }
  )
}

export const useGetAllMonitoredWebsites = () => {
  return useQuery<MonitoredWebsite[]>(
    ['monitored-websites'],
    async () => {
      const resp = await axios.get<MonitoredWebsiteResponse[]>(
        apiRoutes.getAllMonitoredWebsites,
      )
      return resp.data.map((website) => ({
        ...website,
        createdAt: new Date(website.createdAt),
        updatedAt: new Date(website.updatedAt),
      }))
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
    }
  )
}
