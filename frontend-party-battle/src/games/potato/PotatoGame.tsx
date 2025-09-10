import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { SafeAreaView, Text, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { GameComponent } from '../GameComponent'
import { assignPlayerSlotPositions } from './assignPlayerSlotPositions'
import { PlayerSlot } from './PlayerSlot'
import PotatoStack from './PotatoStack'

export const PotatoGame: GameComponent<PotatoGameSchema> = ({ gameRoom }) => {
  const { trimmedPlayerName } = usePlayerName()
  const message = useColyseusState(gameRoom, (state) => state.message)
  const playerWithPotato = useColyseusState(gameRoom, (state) => state.playerWithPotato)
  const remainingPlayers = useColyseusState(gameRoom, (state) => [...state.remainingPlayers])
  const playerSlotAssignments = assignPlayerSlotPositions(remainingPlayers, trimmedPlayerName)

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1">
        <View className="flex-row items-center pt-6">
          <PlayerSlot playerName={playerSlotAssignments.topLeft} playerWithPotato={playerWithPotato} />
          <PlayerSlot playerName={playerSlotAssignments.topCenterLeft} playerWithPotato={playerWithPotato} />
          <PlayerSlot playerName={playerSlotAssignments.top} playerWithPotato={playerWithPotato} />
          <PlayerSlot playerName={playerSlotAssignments.topCenterRight} playerWithPotato={playerWithPotato} />
          <PlayerSlot playerName={playerSlotAssignments.topRight} playerWithPotato={playerWithPotato} />
        </View>

        <View className="flex-row items-center pt-6">
          <PlayerSlot playerName={playerSlotAssignments.left} playerWithPotato={playerWithPotato} />
          <PlayerSlot playerName={playerSlotAssignments.right} playerWithPotato={playerWithPotato} />
        </View>

        <View className="flex-1 justify-center items-center space-y-6">
          <Text className="text-black dark:text-white text-xl">{message}</Text>
          {playerWithPotato === trimmedPlayerName && <PotatoStack style={{ width: 200 }} />}
        </View>
      </View>
    </SafeAreaView>
  )
}
