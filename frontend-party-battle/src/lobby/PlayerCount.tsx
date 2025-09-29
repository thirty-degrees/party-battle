import { Text } from '@/components/ui/text'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { MAX_AMOUNT_OF_PLAYERS } from 'types-party-battle/consts/config'

export default function PlayerCount() {
  const playerCount = useLobbyStore((state) => Object.keys(state.view.players).length)

  return (
    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      Players ({playerCount} / {MAX_AMOUNT_OF_PLAYERS})
    </Text>
  )
}
