import { Client, Delayed } from '@colyseus/core'
import { ArraySchema } from '@colyseus/schema'
import { GameType } from 'types-party-battle/types/GameSchema'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import { Score, ScoreSchema } from 'types-party-battle/types/ScoreSchema'
import { TriviaGameSchema } from 'types-party-battle/types/trivia/TriviaGameSchema'
import { TriviaQuestion, TriviaQuestionSchema } from 'types-party-battle/types/trivia/TriviaQuestionSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { triviaService } from '../games/trivia'
import { assignScoresByRank } from '../scores/assignScoresByRank'

export class TriviaGameRoom extends BaseGameRoom<TriviaGameSchema> {
  static readonly gameType: GameType = 'trivia'
  static readonly roomName: string = 'trivia_game_room'
  private countdownInterval: Delayed | null = null
  private answerTimerInterval: Delayed | null = null
  private readonly answerTimeoutMs = 15000
  private currentRound = 0
  private readonly totalRounds = 5
  private playerScores = new Map<string, number>()
  private questions: TriviaQuestion[] = []
  private answersSubmitted = new Map<string, string>()

  override getGameType(): GameType {
    return TriviaGameRoom.gameType
  }

  override async onCreate(options: { lobbyRoomId: string; players: { name: string; color: RGBColor }[] }) {
    this.clock.start()
    this.state = new TriviaGameSchema('waiting')
    super.onCreate(options)

    this.currentRound = 0
    this.state.totalRounds = this.totalRounds
    this.state.currentRound = 0

    this.state.playerScores = new ArraySchema<ScoreSchema>()
    this.state.currentCountdownNumber = null
    this.state.currentQuestion = null
    this.state.answerTimeRemaining = null
    this.state.timeWhenTimerIsOver = 0

    this.state.players.forEach((player) => {
      this.playerScores.set(player.name, 0)
    })

    this.questions = await this.fetchTriviaQuestions()

    this.onMessage<string>('SubmitAnswer', (client, answer) => {
      this.handleSubmitAnswer(client, answer)
    })

    this.startGameWhenReady()
  }

  protected startGame() {
    if (this.currentRound >= this.totalRounds) {
      this.finishGame()
      return
    }
    this.state.status = 'playing'
    this.initNewRound()
  }

  private initNewRound() {
    this.answersSubmitted.clear()
    this.state.currentQuestion = null
    this.state.answerTimeRemaining = null
    this.state.currentCountdownNumber = 3

    if (this.countdownInterval) {
      this.countdownInterval.clear()
      this.countdownInterval = null
    }
    this.countdownInterval = this.clock.setInterval(() => {
      const next = (this.state.currentCountdownNumber ?? 0) - 1
      this.state.currentCountdownNumber = next
      if (next <= 0) {
        if (this.countdownInterval) {
          this.countdownInterval.clear()
          this.countdownInterval = null
        }
        this.displayQuestion()
      }
    }, 1000)
  }

  private displayQuestion() {
    if (this.questions.length === 0) {
      this.finishGame()
      return
    }
    this.state.currentCountdownNumber = null
    this.state.currentRound = this.currentRound + 1
    const question = this.questions[this.currentRound % this.questions.length]
    const schema = new TriviaQuestionSchema()
    schema.question = question.question
    schema.allAnswers = new ArraySchema<string>(...question.allAnswers)
    schema.correctAnswerIndex = question.correctAnswerIndex
    this.state.currentQuestion = schema
    this.state.roundState = 'answering'

    this.state.answerTimeRemaining = null
    if (this.answerTimerInterval) {
      this.answerTimerInterval.clear()
      this.answerTimerInterval = null
    }

    this.state.timeWhenTimerIsOver = this.clock.currentTime + this.answerTimeoutMs
    this.answerTimerInterval = this.clock.setTimeout(() => {
      this.endRound()
    }, this.answerTimeoutMs)
  }

  private handleSubmitAnswer(client: Client, answer: string) {
    const playerName = this.findPlayerBySessionId(client.sessionId)
    if (!playerName) return
    if (!this.state.currentQuestion) return
    if (this.state.roundState !== 'answering') return
    if (this.clock.currentTime >= this.state.timeWhenTimerIsOver) return

    if (this.answersSubmitted.has(playerName)) return
    this.answersSubmitted.set(playerName, answer)

    const correctAnswer = this.state.currentQuestion.allAnswers[this.state.currentQuestion.correctAnswerIndex]
    const isCorrect = answer === correctAnswer
    const currentScore = this.playerScores.get(playerName) || 0
    this.playerScores.set(playerName, isCorrect ? currentScore + 1 : currentScore)

    if (this.answersSubmitted.size >= this.state.players.length) {
      this.endRound()
    }
  }

  private endRound() {
    this.state.currentCountdownNumber = null
    this.state.roundState = 'results'
    if (this.answerTimerInterval) {
      this.answerTimerInterval.clear()
      this.answerTimerInterval = null
    }
    this.state.timeWhenTimerIsOver = 0

    this.state.playerScores = new ArraySchema<ScoreSchema>(
      ...Array.from(this.playerScores.entries()).map(([name, value]) => new ScoreSchema(name, value))
    )

    this.clock.setTimeout(() => {
      this.currentRound += 1
      if (this.currentRound >= this.totalRounds) {
        this.finishGame()
      } else {
        this.initNewRound()
      }
    }, 3000)
  }

  override getScores(): Score[] {
    const scoreGroups: string[][] = []
    const map = new Map<number, string[]>()
    for (const [player, score] of this.playerScores.entries()) {
      if (!map.has(score)) map.set(score, [])
      map.get(score)!.push(player)
    }
    const sorted = Array.from(map.keys()).sort((a, b) => b - a)
    sorted.forEach((s) => scoreGroups.push(map.get(s)!))
    return assignScoresByRank(scoreGroups)
  }

  override onDispose() {
    if (this.countdownInterval) {
      this.countdownInterval.clear()
      this.countdownInterval = null
    }
    if (this.answerTimerInterval) {
      this.answerTimerInterval.clear()
      this.answerTimerInterval = null
    }
    super.onDispose()
  }

  private async fetchTriviaQuestions(): Promise<TriviaQuestion[]> {
    try {
      const questions = await triviaService.fetchQuestions({
        amount: this.totalRounds,
        difficulty: 'medium',
      })
      return questions
    } catch (error) {
      console.error('Failed to fetch trivia questions, ending game:', error)
      this.finishGame()
      return []
    }
  }
}
