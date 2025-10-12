import { decode } from 'html-entities'
import { shuffle } from 'lodash'
import { TriviaQuestion } from 'types-party-battle/types/trivia/TriviaQuestionSchema'

interface OpenTriviaResponse {
  response_code: number
  results: OpenTriviaQuestion[]
}

interface OpenTriviaQuestion {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface TriviaServiceOptions {
  amount?: number
  difficulty?: 'easy' | 'medium' | 'hard'
}

export class TriviaService {
  private readonly baseUrl = 'https://opentdb.com/api.php'

  async fetchQuestions(options: TriviaServiceOptions = {}): Promise<TriviaQuestion[]> {
    const { amount = 10, difficulty } = options

    const params = new URLSearchParams()
    params.append('amount', amount.toString())
    params.append('category', '9')
    params.append('type', 'multiple')

    if (difficulty) {
      params.append('difficulty', difficulty)
    }

    const url = `${this.baseUrl}?${params.toString()}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: OpenTriviaResponse = await response.json()

      if (data.response_code !== 0) {
        throw new Error(`API error! response code: ${data.response_code}`)
      }

      return this.transformQuestions(data.results)
    } catch (error) {
      console.error('Failed to fetch trivia questions:', error)
      throw new Error(
        `Failed to fetch trivia questions: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private transformQuestions(apiQuestions: OpenTriviaQuestion[]): TriviaQuestion[] {
    return apiQuestions.map((apiQuestion) => {
      const correctAnswer = decode(apiQuestion.correct_answer)
      const incorrectAnswers = apiQuestion.incorrect_answers.map((answer) => decode(answer))

      const allAnswers = shuffle([correctAnswer, ...incorrectAnswers])
      const correctAnswerIndex = allAnswers.indexOf(correctAnswer)

      return {
        question: decode(apiQuestion.question),
        allAnswers,
        correctAnswerIndex,
      }
    })
  }
}

export const triviaService = new TriviaService()
