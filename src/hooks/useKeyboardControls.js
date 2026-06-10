import { useEffect, useRef } from 'react'

export function useKeyboardControls({
  onAnswer,
  onEnter,
  onSpace,
  enabled = true,
}) {
  const handlersRef = useRef({ onAnswer, onEnter, onSpace })

  useEffect(() => {
    handlersRef.current = { onAnswer, onEnter, onSpace }
  }, [onAnswer, onEnter, onSpace])

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
        return
      }

      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault()
        handlersRef.current.onSpace?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled])
}
