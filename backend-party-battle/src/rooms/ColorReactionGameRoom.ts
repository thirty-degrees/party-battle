import { Client, Delayed } from '@colyseus/core'
import { ArraySchema } from '@colyseus/schema'
import { COLOR_NAME_TO_RGB } from 'types-party-battle/consts/config'
import {
  ColorReactionGameSchema,
  ColorSchema,
  selectionType,
} from 'types-party-battle/types/color-reaction/ColorReactionGameSchema'
import { GameType } from 'types-party-battle/types/GameSchema'
import {
  RGBColor,
  RGBColorSchema,
  fromRgbColor,
  rgbColorToString,
} from 'types-party-battle/types/RGBColorSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { assignScoresByOrder } from '../scores/assignScoresByOrder'

export class ColorReactionGameRoom extends BaseGameRoom<ColorReactionGameSchema> {
  static readonly gameType: GameType = 'color-reaction'
  static readonly roomName: string = 'color_reaction_game_room'
  private countdownInterval: Delayed | null = null
  private currentRound = 0
  private totalRounds = 0

  override getGameType(): GameType {
    return ColorReactionGameRoom.gameType
  }

  override onCreate(_options: { lobbyRoomId: string; players: { name: string; color: RGBColor }[] }) {
    this.clock.start()
    this.state = new ColorReactionGameSchema('waiting')

    super.onCreate(_options)

    this.totalRounds = Math.max(this.state.players.length - 1, 0)
    this.currentRound = 0

    this.resetGame()

    this.onMessage<RGBColorSchema>('ColorPressed', (client, color) => {
      this.handleColorPressed(client, color)
    })

    this.startGameWhenReady()
  }

  private handleColorPressed(client: Client, color: RGBColorSchema) {
    console.log('Color pressed:', color)

    this.state.colorIdButtons = new ArraySchema<RGBColorSchema>()

    console.log('sessionid', client.sessionId)
    const playerName = this.findPlayerBySessionId(client.sessionId)
    if (playerName) {
      console.log('Player found:', playerName)
      this.state.guesserName = playerName
    } else {
      console.log('Player not found')
    }

    const selectedColorString = rgbColorToString(color)

    if (this.state.selectiontype === 'color') {
      this.state.correctGuess = this.state.currentSelection?.color === selectedColorString
    } else if (this.state.selectiontype === 'word') {
      const selectedColorName = this.findColorNameByRgb(color)
      this.state.correctGuess = this.state.currentSelection?.word === selectedColorName
    } else {
      this.state.correctGuess = false
    }

    this.currentRound += 1

    this.clock.setTimeout(() => {
      if (this.currentRound >= this.totalRounds) {
        this.finishGame()
      } else {
        this.resetGame()
        this.startGame()
      }
    }, 1500)
  }

  private resetGame() {
    this.state.selectiontype = 'color' as selectionType
    this.state.currentSelection = null
    this.state.currentCountdownNumber = null
    this.state.guesserName = null
    this.state.correctGuess = null

    this.setIdButtons()
  }
  private setIdButtons() {
    const colors = Object.values(COLOR_NAME_TO_RGB).map(fromRgbColor)
    const shuffled = this.shuffleRgbColors(colors)
    this.state.colorIdButtons = new ArraySchema<RGBColorSchema>(...shuffled)
  }

  protected startGame() {
    if (this.currentRound >= this.totalRounds) {
      this.finishGame()
      return
    }
    this.state.status = 'playing'
    this.initNewRound(3, this.setCurrentColorAndType.bind(this))
  }

  override getScores(): Score[] {
    const playerGroups: string[][] = []
    // TODO: handle Scores of players
    return assignScoresByOrder(playerGroups)
  }

  override onDispose() {
    if (this.countdownInterval) {
      this.countdownInterval.clear()
      this.countdownInterval = null
    }
    super.onDispose()
  }

  private initNewRound(from: number, onDone: () => void) {
    if (this.countdownInterval) {
      this.countdownInterval.clear()
      this.countdownInterval = null
    }
    this.state.currentCountdownNumber = from
    this.countdownInterval = this.clock.setInterval(() => {
      const nextValue = (this.state.currentCountdownNumber ?? 0) - 1
      this.state.currentCountdownNumber = nextValue
      if (nextValue <= 0) {
        if (this.countdownInterval) {
          this.countdownInterval.clear()
          this.countdownInterval = null
        }
        onDone()
      }
    }, 1000)
  }

  private setCurrentColorAndType() {
    this.state.currentCountdownNumber = null

    this.state.selectiontype = this.setCurrentType()

    const names = Object.keys(COLOR_NAME_TO_RGB) as (keyof typeof COLOR_NAME_TO_RGB)[]
    const chosenName = names[(Math.random() * names.length) | 0]
    const chosenColor = COLOR_NAME_TO_RGB[chosenName]
    this.setCurrentColor(chosenName, chosenColor)
  }

  private setCurrentColor(chosenName: keyof typeof COLOR_NAME_TO_RGB, chosenColor: RGBColor) {
    const names = Object.keys(COLOR_NAME_TO_RGB) as (keyof typeof COLOR_NAME_TO_RGB)[]
    const pickRandomName = (): keyof typeof COLOR_NAME_TO_RGB => {
      return names[(Math.random() * names.length) | 0]
    }

    if (!this.state.currentSelection) {
      this.state.currentSelection = new ColorSchema()
    }

    if (this.state.selectiontype === 'color') {
      let wrongName = pickRandomName()
      while (wrongName === chosenName) {
        wrongName = pickRandomName()
      }
      this.state.currentSelection.word = wrongName
      this.state.currentSelection.color = rgbColorToString(chosenColor)
    } else {
      let wrongName = pickRandomName()
      while (wrongName === chosenName) {
        wrongName = pickRandomName()
      }
      this.state.currentSelection.word = chosenName
      this.state.currentSelection.color = rgbColorToString(COLOR_NAME_TO_RGB[wrongName])
    }
  }

  private setCurrentType(): selectionType {
    const types: selectionType[] = ['color', 'word']
    return types[(Math.random() * types.length) | 0]
  }

  private findColorNameByRgb(color: RGBColorSchema): string | null {
    const colorString = rgbColorToString(color)
    for (const [name, rgbColor] of Object.entries(COLOR_NAME_TO_RGB)) {
      if (rgbColorToString(rgbColor) === colorString) {
        return name
      }
    }
    return null
  }

  private shuffleRgbColors(list: RGBColorSchema[]): RGBColorSchema[] {
    return list.sort(() => Math.random() - 0.5)
  }
}
