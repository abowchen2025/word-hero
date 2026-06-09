import { useEffect, useRef } from 'react'

export function useKeyboardControls({ onAnswer, onEnter, enabled = true }) {
  const handlersRef = useRef({ onAnswer, onEnter })

  useEffect(() => {
    handlersRef.current = { onAnswer, onEnter }
  }, [onAnswer, onEnter])

  useEffect(() => {
    if (!enabled) return undefined

    function handleKeyDown(event) {
      const target = event.target
      const isEditable =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA')

      if (
        isEditable ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return
      }

      if (/^[1-4]$/.test(event.key)) {
        event.preventDefault()
        handlersRef.current.onAnswer?.(Number(event.key) - 1)
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        handlersRef.current.onEnter?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled])
}
