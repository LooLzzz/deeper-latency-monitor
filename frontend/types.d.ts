
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

export interface HistoryRecordResponse {
  latencyMs: number
  websiteId: number
  id: number
  createdAt: string
}

export interface HistoryRecord extends HistoryRecordResponse {
  createdAt: Date
}
