import { Client, Delayed } from '@colyseus/core'
import { GameType } from 'types-party-battle/types/GameSchema'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { SimonSaysGameSchema, SimonSide } from 'types-party-battle/types/simon-says/SimonSaysGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { assignScoresByRank } from '../scores/assignScoresByRank'

type PlayerResult = 'pending' | 'correct' | 'wrong'

type RoundData = {
  feints: Array<{
    side: SimonSide
    startTime: number
    holdDuration: number
    feintEndTime: number
  }>
  finalSide: SimonSide
  finalDelay: number
}

export class SimonSaysGameRoom extends BaseGameRoom<SimonSaysGameSchema> {
  static readonly gameType: GameType = 'simon-says'
  static readonly roomName: string = 'simon_says_game_room'

  private eliminatedGroups: string[][] = []
  private playerResult = new Map<string, PlayerResult>()
  private playerPressedSide = new Map<string, SimonSide>()
  private activeTimers: Delayed[] = []
  private currentRound = 0
  private currentRoundData: RoundData | null = null
  private readonly interRoundWaitDuration = 2000
  private readonly slideBackAnimationDuration = 300

  private getDifficultyPhase(): 1 | 2 | 3 {
    if (this.currentRound < 2) return 1
    if (this.currentRound < 3) return 2
    return 3
  }

  private getDecisionWindowDuration(): number {
    const phase = this.getDifficultyPhase()
    if (phase === 1) return 1500
    if (phase === 2) return 1000
    return 800
  }

  private getMaxFeintCount(): number {
    const phase = this.getDifficultyPhase()
    if (phase === 1) return 0
    if (phase === 2) return 2
    return 3
  }

  private getMinFeintCount(): number {
    const phase = this.getDifficultyPhase()
    if (phase === 1) return 0
    return 1
  }

  private getFinalDelayAfterLastFeint(): number {
    const phase = this.getDifficultyPhase()
    const minDelay = this.slideBackAnimationDuration + 50
    if (phase === 3) return minDelay
    return Math.max(minDelay, 500)
  }

  override getGameType(): GameType {
    return SimonSaysGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; players: { name: string; color: RGBColor }[] }) {
    this.clock.start()
    this.state = new SimonSaysGameSchema('waiting')

    super.onCreate(options)

    options.players.forEach((player) => {
      this.state.remainingPlayers.push(player.name)
    })

    this.onMessage<SimonSide>('SidePressed', (client, side) => {
      this.handleSidePressed(client, side)
    })

    this.startGameWhenReady()
  }

  protected startGame() {
    this.state.status = 'playing'
    this.startRound()
  }

  private generateRoundData(): RoundData {
    const phase = this.getDifficultyPhase()
    const minFeints = this.getMinFeintCount()
    const maxFeints = this.getMaxFeintCount()
    const feintCount = minFeints + Math.floor(Math.random() * (maxFeints - minFeints + 1))
    const finalDelayAfterLastFeint = this.getFinalDelayAfterLastFeint()
    const totalDelayToFinal = 2000 + Math.floor(Math.random() * 8000)

    const feints: RoundData['feints'] = []
    let currentTime = 0
    let lastFeintEndTime = 0

    for (let i = 0; i < feintCount; i++) {
      const holdDuration = 800 + Math.floor(Math.random() * 400)
      const minGapDuration = this.slideBackAnimationDuration + 50
      const gapDuration =
        phase === 3
          ? minGapDuration + Math.floor(Math.random() * 200)
          : minGapDuration + Math.floor(Math.random() * 500)

      const feintTotalDuration = holdDuration + gapDuration
      const maxEndTime = totalDelayToFinal - finalDelayAfterLastFeint

      if (currentTime + feintTotalDuration >= maxEndTime) {
        break
      }

      const side: SimonSide = Math.random() < 0.5 ? 'left' : 'right'
      const feintEndTime = currentTime + holdDuration

      feints.push({
        side,
        startTime: currentTime,
        holdDuration,
        feintEndTime,
      })

      currentTime += feintTotalDuration
      lastFeintEndTime = currentTime
    }

    const finalDelay = lastFeintEndTime > 0 ? lastFeintEndTime + finalDelayAfterLastFeint : totalDelayToFinal
    const finalSide: SimonSide = Math.random() < 0.5 ? 'left' : 'right'

    return {
      feints,
      finalSide,
      finalDelay,
    }
  }

  private startRound() {
    this.clearAllTimers()
    this.resetRoundState()

    this.currentRoundData = this.generateRoundData()
    const decisionWindowDuration = this.getDecisionWindowDuration()

    this.currentRoundData.feints.forEach((feint) => {
      const showFeintTimer = this.clock.setTimeout(() => {
        this.state.side = feint.side
        this.state.isFinalSide = false

        const hideFeintTimer = this.clock.setTimeout(() => {
          this.state.side = null
          this.state.isFinalSide = false
        }, feint.holdDuration)

        this.activeTimers.push(hideFeintTimer)
      }, feint.startTime)

      this.activeTimers.push(showFeintTimer)
    })

    const finalTimer = this.clock.setTimeout(() => {
      this.state.side = this.currentRoundData!.finalSide
      this.state.isFinalSide = true
      this.state.timeWhenDecisionWindowEnds = this.clock.currentTime + decisionWindowDuration

      const decisionTimer = this.clock.setTimeout(() => {
        this.clearAllTimers()
        this.processRoundEnd()
      }, decisionWindowDuration + 1000)

      this.activeTimers.push(decisionTimer)
    }, this.currentRoundData.finalDelay)

    this.activeTimers.push(finalTimer)
  }

  private evaluatePress(playerName: string, pressedSide: SimonSide, correctSide: SimonSide) {
    if (pressedSide === correctSide) {
      this.playerResult.set(playerName, 'correct')
    } else {
      this.playerResult.set(playerName, 'wrong')
    }
  }

  private processRoundEliminations() {
    const currentRoundEliminations: string[] = []

    this.state.remainingPlayers.forEach((playerName) => {
      const result = this.playerResult.get(playerName)
      const hasPressed = this.state.playersWhoPressed.includes(playerName)

      if (hasPressed && result === 'wrong') {
        currentRoundEliminations.push(playerName)
      } else if (!hasPressed) {
        currentRoundEliminations.push(playerName)
      }
    })

    if (currentRoundEliminations.length > 0) {
      this.eliminatedGroups.push([...currentRoundEliminations])

      currentRoundEliminations.forEach((playerName) => {
        const index = this.state.remainingPlayers.indexOf(playerName)
        if (index !== -1) {
          this.state.remainingPlayers.splice(index, 1)
        }
      })
    }
  }

  private processRoundEnd() {
    this.processRoundEliminations()

    if (this.state.remainingPlayers.length <= 1) {
      this.clock.setTimeout(() => {
        this.finishGame()
      }, 500)
    } else {
      this.currentRound += 1
      this.interRound()
    }
  }

  private interRound() {
    this.state.side = null
    this.state.isFinalSide = false
    this.state.timeWhenDecisionWindowEnds = 0

    const waitTimer = this.clock.setTimeout(() => {
      this.startRound()
    }, this.interRoundWaitDuration)

    this.activeTimers.push(waitTimer)
  }

  private handleSidePressed(client: Client, pressedSide: SimonSide) {
    if (!this.currentRoundData) {
      throw new Error('SidePressed received before round data was initialized')
    }

    const playerName = this.findPlayerBySessionId(client.sessionId)

    if (this.state.playersWhoPressed.includes(playerName)) {
      return
    }

    this.playerPressedSide.set(playerName, pressedSide)
    this.state.playersWhoPressed.push(playerName)

    this.evaluatePress(playerName, pressedSide, this.currentRoundData.finalSide)
  }

  private resetRoundState() {
    this.playerResult.clear()
    this.playerPressedSide.clear()
    this.state.playersWhoPressed.clear()
    this.state.side = null
    this.state.isFinalSide = false
    this.state.timeWhenDecisionWindowEnds = 0
  }

  private clearAllTimers() {
    this.activeTimers.forEach((timer) => {
      timer.clear()
    })
    this.activeTimers = []
  }

  override getScores(): Score[] {
    const playerGroups: string[][] = []

    if (this.state.remainingPlayers.length > 0) {
      playerGroups.push([...this.state.remainingPlayers])
    }

    for (const group of [...this.eliminatedGroups].reverse()) {
      playerGroups.push([...group])
    }

    const scores = assignScoresByRank(playerGroups)
    return scores
  }

  override onDispose() {
    this.clearAllTimers()
    super.onDispose()
  }
}
