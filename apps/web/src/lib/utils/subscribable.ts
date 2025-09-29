export type Unsiscribe = () => void

export interface Subscribable<T extends Function = () => void> {
  addCallback: (callback: T) => [Unsiscribe, string]
  removeCallback: (id: string) => void
  getCallbacks: () => T[]
}

export const subscribable = <T extends Function = () => void>() => {
  const callbacks: Record<string, T> = {}

  const removeCallback = (id: string) => {
    delete callbacks[id]
  }

  const addCallback = (callback: T) => {
    const id = Math.random().toString()
    callbacks[id] = callback
    return [() => removeCallback(id), id]
  }

  const getCallbacks = () => Object.values(callbacks)

  return {
    addCallback,
    removeCallback,
    getCallbacks
  } as Subscribable<T>

}
