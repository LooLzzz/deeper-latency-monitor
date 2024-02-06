
export interface MonitoredWebsiteResponse {
  url: string
  redThresholdMs: number
  orangeThresholdMs: number
  greenThresholdMs: number
  frequencySec: number
  isActive: boolean
  id: number
  createdAt: string
  updatedAt: string
}

export interface MonitoredWebsite extends MonitoredWebsiteResponse {
  createdAt: Date
  updatedAt: Date
}

export interface MonitoredWebsiteCreate {
  url: string
  redThresholdMs: number
  orangeThresholdMs: number
  greenThresholdMs: number
  frequencySec: number
  isActive: boolean
}
export interface MonitoredWebsiteUpdate {
  id: number
  url?: string
  redThresholdMs?: number
  orangeThresholdMs?: number
  greenThresholdMs?: number
  frequencySec?: number
  isActive?: boolean
}

export interface HistoryRecordResponse {
  latencyMs: number
  websiteId: number
  id: number
  createdAt: string
}

export interface HistoryRecordClearResponse {
  affectedRows: number
  id: number
}

export interface HistoryRecord extends HistoryRecordResponse {
  createdAt: Date
}
