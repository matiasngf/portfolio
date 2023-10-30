import { useCallback, useMemo, useRef } from 'react'

export interface Uniform<T = unknown> {
  value: T
}

export type Uniforms<T = Record<string, unknown>> = {
  [K in keyof T]: Uniform<T[K]>
}

export const useUniforms = <T extends Record<string, unknown>>(
  state: T | (() => T)
) => {
  const uniformsObject = useMemo(() => {
    const u: Partial<Uniforms<T>> = {}
    const initialState = typeof state === 'function' ? state() : state
    Object.entries(initialState).forEach(([key, value]) => {
      ; (u as any)[key] = { value }
    })
    return u as Uniforms<T>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // create ref
  const uniformsRef = useRef(uniformsObject)

  const updateUniforms = useCallback((state: Partial<T>) => {
    Object.entries(state).forEach(([key, value]) => {
      ; (uniformsRef.current as any)[key].value = value
    })
  }, [])

  return [uniformsRef.current, updateUniforms] as const
}
