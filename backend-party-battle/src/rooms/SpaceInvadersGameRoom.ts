import { ArraySchema } from '@colyseus/schema'
import { Delayed } from '@colyseus/core'
import { GameType } from 'types-party-battle/types/GameSchema'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import {
  BulletSchema,
  FIRE_COOLDOWN_MS,
  SpaceInvadersGameSchema,
  SPACE_INVADERS_TICK_MS,
  SHIP_ACCEL_PER_TICK,
  SHIP_FRICTION_PER_TICK,
  SHIP_MAX_SPEED,
  BULLET_SPEED,
  BULLET_GRACE_MS,
  ShipSchema,
} from 'types-party-battle/types/space-invaders/SpaceInvadersGameSchema'
import { Direction, DIRECTIONS } from 'types-party-battle/types/snake/DirectionSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { assignScoresByRank } from '../scores/assignScoresByRank'

function isValidDirection(value: unknown): value is Direction {
  return typeof value === 'string' && DIRECTIONS.includes(value as Direction)
}

export class SpaceInvadersGameRoom extends BaseGameRoom<SpaceInvadersGameSchema> {
  static readonly gameType: GameType = 'space-invaders'
  static readonly roomName: string = 'space-invaders_game_room'

  private eliminatedGroups: string[][] = []
  private loop: Delayed | null = null

  override getGameType(): GameType {
    return SpaceInvadersGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; players: { name: string; color: RGBColor }[] }) {
    const width = 100
    const height = 160
    this.state = new SpaceInvadersGameSchema('waiting', width, height)
    super.onCreate(options)

    this.state.players.forEach((player) => {
      const ship = new ShipSchema()
      ship.name = player.name
      ship.x = 10 + Math.random() * (width - 20)
      ship.y = 10 + Math.random() * (height - 20)
      ship.heading = 'up'
      this.state.ships.push(ship)
      this.state.remainingPlayers.push(player.name)
    })

    this.onMessage<Direction>('SetHeading', (client, direction) => {
      const name = this.findPlayerBySessionId(client.sessionId)
      if (!this.isAlive(name)) {
        return
      }
      if (this.state.status !== 'playing') {
        return
      }
      if (!isValidDirection(direction)) {
        return
      }
      const ship = this.findShip(name)
      if (!ship) {
        return
      }
      ship.heading = direction
    })

    this.onMessage<boolean>('SetGas', (client, gas) => {
      const name = this.findPlayerBySessionId(client.sessionId)
      if (!this.isAlive(name)) {
        return
      }
      if (this.state.status !== 'playing') {
        return
      }
      const ship = this.findShip(name)
      if (!ship) {
        return
      }
      ship.gas = !!gas
    })

    this.onMessage('Fire', (client) => {
      const name = this.findPlayerBySessionId(client.sessionId)
      if (!this.isAlive(name)) {
        return
      }
      if (this.state.status !== 'playing') {
        return
      }
      const ship = this.findShip(name)
      if (!ship) {
        return
      }
      const now = Date.now()
      if (now - ship.lastFiredAtMs < FIRE_COOLDOWN_MS) {
        return
      }
      ship.lastFiredAtMs = now
      const direction = ship.heading
      const [dx, dy] = this.directionToUnit(direction)
      const bullet = new BulletSchema()
      bullet.owner = name
      bullet.x = ship.x
      bullet.y = ship.y
      bullet.dx = dx * BULLET_SPEED
      bullet.dy = dy * BULLET_SPEED
      bullet.createdAtMs = now
      this.state.bullets.push(bullet)
    })

    this.startGameWhenReady()
  }

  protected startGame() {
    this.state.status = 'playing'
    this.loop = this.clock.setInterval(() => this.tick(), SPACE_INVADERS_TICK_MS)
  }

  private tick() {
    if (this.state.status !== 'playing') {
      return
    }
    this.state.tick++
    const deaths = new Set<string>()

    this.state.ships.forEach((ship) => {
      const [hx, hy] = this.directionToUnit(ship.heading)
      if (ship.gas) {
        ship.vx = this.clamp(ship.vx + hx * SHIP_ACCEL_PER_TICK, -SHIP_MAX_SPEED, SHIP_MAX_SPEED)
        ship.vy = this.clamp(ship.vy + hy * SHIP_ACCEL_PER_TICK, -SHIP_MAX_SPEED, SHIP_MAX_SPEED)
      } else {
        ship.vx = this.applyFriction(ship.vx)
        ship.vy = this.applyFriction(ship.vy)
      }
      let nextX = ship.x + ship.vx
      let nextY = ship.y + ship.vy
      if (nextX < 0) {
        nextX = 0
        ship.vx = 0
      }
      if (nextY < 0) {
        nextY = 0
        ship.vy = 0
      }
      if (nextX > this.state.width) {
        nextX = this.state.width
        ship.vx = 0
      }
      if (nextY > this.state.height) {
        nextY = this.state.height
        ship.vy = 0
      }
      ship.x = nextX
      ship.y = nextY
    })

    const now = Date.now()
    const remainingBullets: BulletSchema[] = []
    this.state.bullets.forEach((bullet) => {
      const nextX = bullet.x + bullet.dx
      const nextY = bullet.y + bullet.dy
      if (nextX < 0 || nextY < 0 || nextX > this.state.width || nextY > this.state.height) {
        return
      }
      let hit = ''
      for (const ship of this.state.ships) {
        if (ship.name === bullet.owner && now - bullet.createdAtMs < BULLET_GRACE_MS) {
          continue
        }
        if (!this.isAlive(ship.name)) {
          continue
        }
        const dx = nextX - ship.x
        const dy = nextY - ship.y
        const distanceSquared = dx * dx + dy * dy
        if (distanceSquared <= 25) {
          hit = ship.name
          break
        }
      }
      if (hit) {
        deaths.add(hit)
        return
      }
      bullet.x = nextX
      bullet.y = nextY
      remainingBullets.push(bullet)
    })
    this.state.bullets = new ArraySchema<BulletSchema>(...remainingBullets)

    if (deaths.size > 0) {
      const eliminated = Array.from(deaths)
      this.eliminate(eliminated)
      if (this.state.remainingPlayers.length <= 1) {
        this.finishGame()
        this.clock.setTimeout(() => this.onDispose(), 1000)
      }
    }
  }

  private eliminate(names: string[]) {
    names.forEach((name) => {
      const playerIndex = this.state.remainingPlayers.indexOf(name)
      if (playerIndex >= 0) {
        this.state.remainingPlayers.splice(playerIndex, 1)
      }
      const shipIndex = this.state.ships.findIndex((ship) => ship.name === name)
      if (shipIndex >= 0) {
        this.state.ships.splice(shipIndex, 1)
      }
    })
    this.eliminatedGroups.push(names)
  }

  override getScores(): Score[] {
    const groups: string[][] = []
    groups.push([...this.state.remainingPlayers])
    this.eliminatedGroups.forEach((group) => {
      groups.push([...group])
    })
    return assignScoresByRank(groups)
  }

  override onDispose() {
    if (this.loop) {
      this.loop.clear()
    }
    super.onDispose()
  }

  private isAlive(name: string | undefined): boolean {
    return !!name && this.state.remainingPlayers.includes(name)
  }

  private findShip(name: string | undefined): ShipSchema | undefined {
    if (!name) {
      return undefined
    }
    return this.state.ships.find((ship) => ship.name === name)
  }

  private directionToUnit(direction: Direction): [number, number] {
    if (direction === 'up') {
      return [0, -1]
    }
    if (direction === 'down') {
      return [0, 1]
    }
    if (direction === 'left') {
      return [-1, 0]
    }
    return [1, 0]
  }

  private clamp(value: number, min: number, max: number) {
    if (value < min) {
      return min
    }
    if (value > max) {
      return max
    }
    return value
  }

  private applyFriction(value: number) {
    if (value > 0) {
      return Math.max(0, value - SHIP_FRICTION_PER_TICK)
    }
    if (value < 0) {
      return Math.min(0, value + SHIP_FRICTION_PER_TICK)
    }
    return value
  }
}
