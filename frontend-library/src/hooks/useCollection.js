import { useCallback, useEffect, useRef, useState } from 'react'

export function useCollection(loadFn) {
  const [state, setState] = useState({
    data: [],
    loading: true,
    refreshing: false,
    error: null,
  })
  const sequence = useRef(0)
  const loadRef = useRef(loadFn)
  loadRef.current = loadFn

  const reload = useCallback(async () => {
    const ticket = ++sequence.current
    setState((current) => ({
      ...current,
      loading: current.data.length === 0,
      refreshing: current.data.length > 0,
      error: null,
    }))

    try {
      const result = await loadRef.current()
      if (ticket !== sequence.current) return
      setState({
        data: Array.isArray(result) ? result : [],
        loading: false,
        refreshing: false,
        error: null,
      })
    } catch (error) {
      if (ticket !== sequence.current) return
      setState((current) => ({
        ...current,
        loading: false,
        refreshing: false,
        error,
      }))
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { ...state, reload }
}
