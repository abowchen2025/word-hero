import { useEffect } from 'react'

export function useKeyboardControls(onKeyDown) {
  useEffect(() => {
    if (!onKeyDown) return undefined

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])
}
