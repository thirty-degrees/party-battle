import { useCallback } from 'react'
import { useStorage } from './StorageProvider'

export const useIsPartyCodeVisible = () => {
  const { value, setValue, isLoading } = useStorage('isPartyCodeVisible')

  const setIsVisible = useCallback(
    (isVisible: boolean) => {
      setValue(isVisible ? 'true' : 'false')
    },
    [setValue]
  )

  return {
    isVisible: value === 'true',
    setIsVisible,
    isLoading,
  }
}
