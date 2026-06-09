import { useCallback } from 'react'

export function useSpeech() {
  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    window.speechSynthesis.speak(utterance)
  }, [])

  return { speak, isSupported: 'speechSynthesis' in window }
}
