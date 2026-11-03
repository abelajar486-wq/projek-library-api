import { useSyncExternalStore } from 'react'
import { getRequestLogs, subscribeToLogs } from '../api'

export function useRequestLogs() {
  return useSyncExternalStore(subscribeToLogs, getRequestLogs, getRequestLogs)
}
