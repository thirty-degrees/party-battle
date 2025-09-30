import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { View } from 'react-native'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { PotatoGameContent } from './PotatoGameContent'
import { usePotatoGameStore } from './usePotatoStore'

export const PotatoGame: GameComponent = () => {
  const { playerName } = usePlayerName()
  const isCurrentPlayerDying = usePotatoGameStore(
    (state) => state.view.status === 'paused' && state.view.playerWithPotato === playerName
  )

  return (
    <BasicGameView className={isCurrentPlayerDying ? 'bg-orange-500 dark:bg-orange-500' : ''}>
      <View className="flex-1 relative">
        <PotatoGameContent />
      </View>
    </BasicGameView>
  )
}
