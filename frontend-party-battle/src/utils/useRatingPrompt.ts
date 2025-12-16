import { useCallback, useRef } from 'react'
import { Platform } from 'react-native'
import { useRatingState } from '../storage/userPreferencesStore'

const IS_NATIVE = Platform.OS !== 'web'

const MIN_SESSIONS_FOR_RATING = 3
const DAYS_BEFORE_RE_PROMPT = 7

function daysSinceDate(dateString: string | null): number {
  if (!dateString) return Infinity
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function useRatingPrompt() {
  const {
    completedLobbySessions,
    hasRequestedRating,
    setHasRequestedRating,
    lastRatingRequestDate,
    setLastRatingRequestDate,
  } = useRatingState()

  const hasTriggeredThisSession = useRef(false)

  const shouldRequestReview = useCallback((): boolean => {
    if (!IS_NATIVE) return false
    if (hasTriggeredThisSession.current) return false
    if (completedLobbySessions < MIN_SESSIONS_FOR_RATING) return false

    if (hasRequestedRating && lastRatingRequestDate) {
      const daysSinceRequest = daysSinceDate(lastRatingRequestDate)
      if (daysSinceRequest < DAYS_BEFORE_RE_PROMPT) return false
    }

    return true
  }, [completedLobbySessions, hasRequestedRating, lastRatingRequestDate])

  const triggerRatingPrompt = useCallback(async () => {
    if (!shouldRequestReview()) return

    hasTriggeredThisSession.current = true
    setHasRequestedRating(true)
    setLastRatingRequestDate(new Date().toISOString())

    try {
      const StoreReview = await import('expo-store-review')
      const isAvailable = await StoreReview.isAvailableAsync()
      if (isAvailable) {
        await StoreReview.requestReview()
      }
    } catch (error) {
      console.warn('Store review request failed:', error)
    }
  }, [shouldRequestReview, setHasRequestedRating, setLastRatingRequestDate])

  return { triggerRatingPrompt }
}
