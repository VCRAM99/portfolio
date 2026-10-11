import { useEffect, useRef, useState } from 'react'
import { contact } from '../data/contact'

const SUCCESS_MESSAGE_MS = 3000
const FAILURE_MESSAGE_MS = 5000

type CopyStatus = 'idle' | 'copied' | 'error'

export function useCopyEmail() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')
  const requestId = useRef(0)
  const dismissTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      requestId.current += 1
      if (dismissTimer.current !== null) {
        window.clearTimeout(dismissTimer.current)
        dismissTimer.current = null
      }
    }
  }, [])

  function showFeedback(status: Exclude<CopyStatus, 'idle'>, request: number) {
    if (request !== requestId.current) return

    if (dismissTimer.current !== null) {
      window.clearTimeout(dismissTimer.current)
    }

    setCopyStatus(status)
    dismissTimer.current = window.setTimeout(() => {
      dismissTimer.current = null
      setCopyStatus('idle')
    }, status === 'copied' ? SUCCESS_MESSAGE_MS : FAILURE_MESSAGE_MS)
  }

  async function copyEmail() {
    const request = ++requestId.current

    if (dismissTimer.current !== null) {
      window.clearTimeout(dismissTimer.current)
      dismissTimer.current = null
    }

    const writeText = navigator.clipboard?.writeText

    if (!writeText) {
      showFeedback('error', request)
      return
    }

    try {
      await writeText.call(navigator.clipboard, contact.email)
      showFeedback('copied', request)
    } catch {
      showFeedback('error', request)
    }
  }

  const copyMessage =
    copyStatus === 'copied' ? 'Email copied!' : copyStatus === 'error' ? 'Could not copy email.' : ''

  return { copyEmail, copyMessage }
}
