import { Room } from 'colyseus.js'
import { ReactElement } from 'react'
import { GameSchema } from 'types-party-battle/types/GameSchema'

interface GameComponentProps<T extends GameSchema = GameSchema> {
  gameRoom: Room<T>
}

export type GameComponent<T extends GameSchema = GameSchema> = (props: GameComponentProps<T>) => ReactElement
