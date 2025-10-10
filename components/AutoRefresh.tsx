"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AutoRefreshProps {
  /**
   * Refresh interval in milliseconds. Defaults to 60 seconds.
   */
  intervalMs?: number
  /**
   * When true, the page will refresh immediately after regaining focus.
   * Enabled by default so data catches up when the tab becomes visible again.
   */
  refreshOnFocus?: boolean
}

export default function AutoRefresh({
  intervalMs = 60_000,
  refreshOnFocus = true,
}: AutoRefreshProps) {
  const router = useRouter()

  useEffect(() => {
    let isActive = true
    const normalizedInterval = Math.max(5_000, intervalMs)

    const refresh = () => {
      if (!isActive) {
        return
      }

      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return
      }

      router.refresh()
    }

    const intervalId = window.setInterval(refresh, normalizedInterval)

    const handleVisibilityChange = () => {
      if (!refreshOnFocus) {
        return
      }

      if (document.visibilityState === "visible") {
        refresh()
      }
    }

    if (refreshOnFocus && typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange)
    }

    return () => {
      isActive = false
      window.clearInterval(intervalId)

      if (refreshOnFocus && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    }
  }, [intervalMs, refreshOnFocus, router])

  return null
}
