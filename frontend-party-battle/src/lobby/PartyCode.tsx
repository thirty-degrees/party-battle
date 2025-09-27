import BlurredText from '@/components/blurred-text'
import { Button, ButtonIcon } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { View } from 'react-native'
import { useIsPartyCodeVisible } from '../storage/userPreferencesStore'

export default function PartyCode() {
  const roomId = useLobbyStore((state) => state.roomId)
  const partyCode = roomId || ''
  const { isPartyCodeVisible, setIsPartyCodeVisible } = useIsPartyCodeVisible()

  const handleToggleVisibility = () => {
    setIsPartyCodeVisible(!isPartyCodeVisible)
  }

  return (
    <View className="flex-col items-left">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-sm text-typography-600 dark:text-typography-400 text-left">Party Code</Text>
        <Button size="xs" variant="link" className="px-2" onPress={handleToggleVisibility}>
          <ButtonIcon as={isPartyCodeVisible ? EyeOffIcon : EyeIcon} />
        </Button>
      </View>
      <BlurredText text={partyCode} isBlurred={!isPartyCodeVisible} onPress={handleToggleVisibility} />
    </View>
  )
}
