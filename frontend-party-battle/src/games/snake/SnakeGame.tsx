import { usePlayerName } from '@/src/storage/PlayerNameProvider'
import { View } from 'react-native'
import { Player, PlayerSchema } from 'types-party-battle/types/PlayerSchema'
import { toRgbColor } from 'types-party-battle/types/RGBColorSchema'
import { toCell } from 'types-party-battle/types/snake/CellSchema'
import { Direction } from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import useColyseusState from '../../colyseus/useColyseusState'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { ArrowButtons } from './ArrowButtons'
import { Board } from './Board'

export const SnakeGame: GameComponent<SnakeGameSchema> = ({ gameRoom }) => {
  const { board, width, height, players } = useColyseusState(gameRoom, (state) => ({
    board: Array.from(state.board, (cell) => toCell(cell)),
    width: state.width,
    height: state.height,
    players: Array.from<PlayerSchema, Player>(state.players, (player) => ({
      name: player.name,
      color: toRgbColor(player.color),
    })),
  }))
  const { trimmedPlayerName } = usePlayerName()
  const currentPlayer = players.find((player) => player.name === trimmedPlayerName)

  return (
    <BasicGameView>
      <View className="flex-1 justify-start items-center">
        <Board board={board} width={width} height={height} players={players} />

        {currentPlayer && (
          <ArrowButtons
            style={{ width: 400, height: 400, opacity: 0.3 }}
            color={{ r: currentPlayer.color.r, g: currentPlayer.color.g, b: currentPlayer.color.b, a: 255 }}
            onUp={() => {
              gameRoom.send<Direction>('ChangeDirection', 'up')
            }}
            onRight={() => {
              gameRoom.send<Direction>('ChangeDirection', 'right')
            }}
            onDown={() => {
              gameRoom.send<Direction>('ChangeDirection', 'down')
            }}
            onLeft={() => {
              gameRoom.send<Direction>('ChangeDirection', 'left')
            }}
          />
        )}
      </View>
    </BasicGameView>
  )
}
