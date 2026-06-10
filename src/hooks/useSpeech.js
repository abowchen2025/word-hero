import { useCallback, useEffect, useRef, useState } from 'react'

function supportsSpeechSynthesis() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef(null)
  const isSupported = supportsSpeechSynthesis()

  const stop = useCallback(() => {
    if (!isSupported) return

    utteranceRef.current = null
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  const speak = useCallback(
    (text) => {
      if (!isSupported || typeof text !== 'string' || !text.trim()) {
        return false
      }

      stop()

      const utterance = new window.SpeechSynthesisUtterance(text.trim())
      const englishVoice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLowerCase() === 'en-us')

      if (englishVoice) {
        utterance.voice = englishVoice
        utterance.lang = englishVoice.lang
      }

      utterance.onstart = () => {
        if (utteranceRef.current === utterance) {
          setIsSpeaking(true)
        }
      }
      utterance.onend = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null
          setIsSpeaking(false)
        }
      }
      utterance.onerror = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null
          setIsSpeaking(false)
        }
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      return true
    },
    [isSupported, stop],
  )

  useEffect(
    () => () => {
      if (isSupported) {
        utteranceRef.current = null
        window.speechSynthesis.cancel()
      }
    },
    [isSupported],
  )

  return { speak, isSupported, isSpeaking }
}
