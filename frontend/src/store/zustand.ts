import { create } from 'zustand'

export interface AppSettingsStore {
  latencyAggregateType: 'latest' | 'avg'
  lessAnimations: boolean

  setLatencyAggregateType: (latencyAggregateType: AppSettingsStore['latencyAggregateType']) => void
  setLessAnimations: (lessAnimations: AppSettingsStore['lessAnimations']) => void
  toggleLessAnimations: () => void
}

export const useAppSettingsStore = create<AppSettingsStore>((set) => ({
  latencyAggregateType: 'latest',
  lessAnimations: false,

  toggleLessAnimations: () => set((state) => ({ lessAnimations: !state.lessAnimations })),
  setLatencyAggregateType: (latencyAggregateType: AppSettingsStore['latencyAggregateType']) => set({ latencyAggregateType }),
  setLessAnimations: (lessAnimations: AppSettingsStore['lessAnimations']) => set({ lessAnimations }),
}))
