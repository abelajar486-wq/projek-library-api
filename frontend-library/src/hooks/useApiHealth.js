import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'

export function useApiHealth() {
  const [health, setHealth] = useState({
    status: 'checking',
    latency: null,
    checkedAt: null,
    message: '',
  })

  const probe = useCallback(async () => {
    const startedAt = performance.now()

    try {
      await api.system.ok()
      setHealth({
        status: 'online',
        latency: Math.round(performance.now() - startedAt),
        checkedAt: Date.now(),
        message: 'Tembok API merespons dengan baik.',
      })
    } catch (error) {
      setHealth({
        status: 'offline',
        latency: null,
        checkedAt: Date.now(),
        message: error.message,
      })
    }
  }, [])

  const check = useCallback(() => {
    setHealth((current) => ({ ...current, status: 'checking', message: '' }))
    return probe()
  }, [probe])

  useEffect(() => {
    // probe hanya menyetel state setelah await, bukan sinkron di body effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    probe()
    const timer = setInterval(probe, 60000)
    return () => clearInterval(timer)
  }, [probe])

  return { ...health, check }
}
