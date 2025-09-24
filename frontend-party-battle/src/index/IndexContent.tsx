import { useState } from 'react'
import { View } from 'react-native'
import { JoinSection } from './JoinSection'
import { LogoSection } from './LogoSection'
import { NameSection } from './NameSection'

export function IndexContent() {
  const [validationError, setValidationError] = useState<string | undefined>(undefined)

  return (
    <View className="flex-1 w-full justify-around items-center">
      <NameSection validationError={validationError} setValidationError={setValidationError} />
      <LogoSection />
      <JoinSection setValidationError={setValidationError} />
    </View>
  )
}
