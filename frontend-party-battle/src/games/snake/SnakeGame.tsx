import { View } from 'react-native'
import { Player, PlayerSchema } from 'types-party-battle/types/PlayerSchema'
import { toCell } from 'types-party-battle/types/snake/CellSchema'
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
      color: player.color,
    })),
  }))

  return (
    <BasicGameView>
      <View className="flex-1 justify-start items-center">
        <Board board={board} width={width} height={height} players={players} />

        <ArrowButtons
          style={{ width: 400, height: 400 }}
          color={{ r: 0, g: 255, b: 0, a: 100 }}
          onUp={() => {
            console.log('up')
          }}
          onRight={() => {
            console.log('right')
          }}
          onDown={() => {
            console.log('down')
          }}
          onLeft={() => {
            console.log('left')
          }}
        />
      </View>
    </BasicGameView>
  )
}
