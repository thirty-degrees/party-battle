import AnimatedBorder from '@/components/animated-border'
import { View } from 'react-native'
import { usePlayerName } from '../../storage/userPreferencesStore'
import { useLobbyStore } from '../useLobbyStore'
import { usePlayerColorString } from '../usePlayerColorString'
import { LastRoundScoreCell } from './cells/LastRoundScoreCell'
import { NameCell } from './cells/NameCell'
import { PlaceCell } from './cells/PlaceCell'
import { TotalScoreCell } from './cells/TotalScoreCell'

type PlayerListEntryProps = {
  playerName: string
}

export function PlayerListEntry({ playerName }: PlayerListEntryProps) {
  const ready = useLobbyStore(
    (state) =>
      Object.values(state.view.players).find((p: { name: string; ready?: boolean }) => p.name === playerName)
        ?.ready ?? false
  )
  const playerColorString = usePlayerColorString(playerName)
  const { playerName: currentPlayerName } = usePlayerName()
  const isCurrentPlayer = playerName === currentPlayerName

  return (
    <AnimatedBorder
      isActive={ready}
      borderColor={playerColorString}
      borderWidth={2}
      borderRadius={4}
      duration={1000}
      style={{ marginBottom: 8 }}
    >
      <View
        className={`p-[10px] rounded border border-outline-200 dark:border-outline-800 flex-row items-center ${isCurrentPlayer ? 'bg-zinc-200 dark:bg-zinc-800' : ''}`}
      >
        <PlaceCell playerName={playerName} />

        <NameCell playerName={playerName} />

        <View className="flex-row gap-4">
          <LastRoundScoreCell playerName={playerName} />
          <TotalScoreCell playerName={playerName} />
        </View>
      </View>
    </AnimatedBorder>
  )
}
