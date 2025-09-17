import BlurredText from '@/components/blurred-text'
import { Button, ButtonIcon } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import { useIsPartyCodeVisible } from '../storage/useIsPartyCodeVisible'

interface PartyCodeProps {
  partyCode: string
}

export default function PartyCode({ partyCode }: PartyCodeProps) {
  const { isVisible, setIsVisible } = useIsPartyCodeVisible()

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <View className="flex-col items-left">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-sm text-typography-600 dark:text-typography-400 text-left">Party Code</Text>
        <Button size="sm" variant="link" className="px-2" onPress={handleToggleVisibility}>
          <ButtonIcon as={isVisible ? EyeOffIcon : EyeIcon} />
        </Button>
      </View>
      <BlurredText text={partyCode} isBlurred={!isVisible} />
    </View>
  )
}
