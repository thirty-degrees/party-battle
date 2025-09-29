import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { View } from 'react-native'
import { Direction } from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { useShallow } from 'zustand/react/shallow'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { ArrowButtons } from './ArrowButtons'
import { Board } from './Board'
import { useSnakeGameStore } from './useSnakeStore'

export const SnakeGame: GameComponent = () => {
  const { board, width, height, players, sendMessage } = useSnakeGameStore(
    useShallow((state) => ({
      board: state.view.board,
      width: state.view.width,
      height: state.view.height,
      players: state.view.players,
      sendMessage: state.sendMessage,
    }))
  )
  const { playerName } = usePlayerName()
  const currentPlayer = players.find((player) => player.name === playerName)

  return (
    <BasicGameView>
      <View className="flex-1 justify-start items-center">
        <Board board={board} width={width} height={height} players={players} />

        {currentPlayer && (
          <View className="absolute top-0 left-0 w-full h-full items-center justify-end pb-10">
            <ArrowButtons
              style={{ width: 250, height: 250, opacity: 0.5 }}
              color={{
                r: currentPlayer.color.r,
                g: currentPlayer.color.g,
                b: currentPlayer.color.b,
                a: 255,
              }}
              onUp={() => {
                sendMessage<Direction>('ChangeDirection', 'up')
              }}
              onRight={() => {
                sendMessage<Direction>('ChangeDirection', 'right')
              }}
              onDown={() => {
                sendMessage<Direction>('ChangeDirection', 'down')
              }}
              onLeft={() => {
                sendMessage<Direction>('ChangeDirection', 'left')
              }}
            />
          </View>
        )}
      </View>
    </BasicGameView>
  )
}
