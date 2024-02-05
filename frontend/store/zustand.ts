import { create } from 'zustand'

type Store = {
  latencyCheckIntervalMs: number
  latencyThresholdsMs: {
    red: number
    orange: number
    green: number
  }
}

export const useStore = create<Store>((set) => ({
  latencyCheckIntervalMs: 1000,
  latencyThresholdsMs: {
    red: 500,
    orange: 250,
    green: 100,
  }
}))
