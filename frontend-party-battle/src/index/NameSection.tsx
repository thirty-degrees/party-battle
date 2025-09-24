import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { usePlayerName } from '@/src/storage/PlayerNameProvider'
import { View } from 'react-native'
import { PLAYER_NAME_MAX_LENGTH } from 'types-party-battle/consts/config'

interface NameSectionProps {
  validationError?: string
  setValidationError: (error: string | undefined) => void
}

export function NameSection({ validationError, setValidationError }: NameSectionProps) {
  const { playerName, setPlayerName } = usePlayerName()

  const onChangePlayerName = (name: string) => {
    setPlayerName(name)
    setValidationError(undefined)
  }

  return (
    <View className="flex-col items-center gap-4 w-full">
      <Text size="xl" style={{ width: 200, textAlign: 'center' }}>
        Name
      </Text>
      <Input
        variant="outline-with-bg"
        size="xl"
        isInvalid={!!validationError}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 200,
        }}
      >
        <InputField
          aria-label="Username"
          value={playerName || ''}
          onChangeText={onChangePlayerName}
          placeholder="Enter your name..."
          autoComplete="username"
          maxLength={PLAYER_NAME_MAX_LENGTH}
          style={{ width: 200, textAlign: 'center' }}
        />
      </Input>
    </View>
  )
}
