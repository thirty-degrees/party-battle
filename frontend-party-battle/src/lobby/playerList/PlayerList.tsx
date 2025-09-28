import { View } from 'react-native'
import { useTotalScores } from '../useTotalScroes'
import { PlayerListEntry } from './PlayerListEntry'

export default function PlayerList() {
  const totalScores = useTotalScores()

  const sortedPlayerNames = Object.keys(totalScores).sort((a, b) => totalScores[b] - totalScores[a])

  return (
    <View className="flex-1">
      {sortedPlayerNames.map((playerName) => (
        <PlayerListEntry key={playerName} playerName={playerName} />
      ))}
    </View>
  )
}
