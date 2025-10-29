import { GameType } from 'types-party-battle/types/GameSchema'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { Direction, DIRECTIONS } from 'types-party-battle/types/snake/DirectionSchema'
import {
  BULLET_GRACE_MS,
  BULLET_SPEED,
  BulletSchema,
  FIRE_COOLDOWN_MS,
  SHIP_ACCEL_PER_TICK,
  SHIP_FRICTION_PER_TICK,
  SHIP_MAX_SPEED,
  ShipSchema,
  SPACE_INVADERS_TICK_MS,
  SpaceInvadersGameSchema,
} from 'types-party-battle/types/space-invaders/SpaceInvadersGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { assignScoresByRank } from '../scores/assignScoresByRank'

function isValidDirection(value: unknown): value is Direction {
  return typeof value === 'string' && DIRECTIONS.includes(value as Direction)
}

export class SpaceInvadersGameRoom extends BaseGameRoom<SpaceInvadersGameSchema> {
  static readonly gameType: GameType = 'space-invaders'
  static readonly roomName: string = 'space-invaders_game_room'

  private eliminatedPlayers: string[][] = []

  override getGameType(): GameType {
    return SpaceInvadersGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; players: { name: string; color: RGBColor }[] }) {
    const width = 100
    const height = 160
    this.state = new SpaceInvadersGameSchema('waiting', width, height)

    super.onCreate(options)

    this.state.players.forEach((p) => {
      const s = new ShipSchema()
      s.name = p.name
      s.x = 10 + Math.random() * (width - 20)
      s.y = 10 + Math.random() * (height - 20)
      s.heading = 'up'
      this.state.ships.push(s)
      this.state.remainingPlayers.push(p.name)
    })

    this.onMessage<Direction>('SetHeading', (client, dir) => {
      const name = this.findPlayerBySessionId(client.sessionId)
      if (!name) return
      if (this.state.status !== 'playing') return
      if (!this.isPlayerAlive(name)) return
      if (!isValidDirection(dir)) return
      const ship = this.findShip(name)
      if (!ship) return
      ship.heading = dir
    })

    this.onMessage<boolean>('SetGas', (client, gas) => {
      console.log('SetGas', gas)
      const name = this.findPlayerBySessionId(client.sessionId)
      if (!name) return
      if (this.state.status !== 'playing') return
      if (!this.isPlayerAlive(name)) return
      const ship = this.findShip(name)
      if (!ship) return
      ship.gas = !!gas
    })

    this.onMessage('Fire', (client) => {
      const name = this.findPlayerBySessionId(client.sessionId)
      if (!name) return
      if (this.state.status !== 'playing') return
      if (!this.isPlayerAlive(name)) return
      const ship = this.findShip(name)
      if (!ship) return
      const now = Date.now()
      if (now - ship.lastFiredAtMs < FIRE_COOLDOWN_MS) return
      ship.lastFiredAtMs = now
      const [dx, dy] = this.directionToUnit(ship.heading)
      const b = new BulletSchema()
      b.owner = name
      b.x = ship.x
      b.y = ship.y
      b.dx = dx * BULLET_SPEED
      b.dy = dy * BULLET_SPEED
      b.createdAtMs = now
      this.state.bullets.push(b)
    })

    this.startGameWhenReady()
  }

  protected startGame() {
    this.state.status = 'playing'
    this.setSimulationInterval(() => this.tick(), SPACE_INVADERS_TICK_MS)
  }

  private tick() {
    if (this.state.status !== 'playing') return
    this.state.tick++

    this.state.ships.forEach((s) => {
      const [hx, hy] = this.directionToUnit(s.heading)
      if (s.gas) {
        s.vx = this.clamp(s.vx + hx * SHIP_ACCEL_PER_TICK, -SHIP_MAX_SPEED, SHIP_MAX_SPEED)
        s.vy = this.clamp(s.vy + hy * SHIP_ACCEL_PER_TICK, -SHIP_MAX_SPEED, SHIP_MAX_SPEED)
      } else {
        s.vx = this.applyFriction(s.vx)
        s.vy = this.applyFriction(s.vy)
      }
      let nx = s.x + s.vx
      let ny = s.y + s.vy
      if (nx < 0) {
        nx = 0
        s.vx = 0
      }
      if (ny < 0) {
        ny = 0
        s.vy = 0
      }
      if (nx > this.state.width) {
        nx = this.state.width
        s.vx = 0
      }
      if (ny > this.state.height) {
        ny = this.state.height
        s.vy = 0
      }
      s.x = nx
      s.y = ny
    })

    const now = Date.now()
    for (let i = this.state.bullets.length - 1; i >= 0; i--) {
      const b = this.state.bullets[i]
      const nx = b.x + b.dx
      const ny = b.y + b.dy
      if (nx < 0 || ny < 0 || nx > this.state.width || ny > this.state.height) {
        this.state.bullets.splice(i, 1)
        continue
      }
      let hit = ''
      for (const s of this.state.ships) {
        if (s.name === b.owner && now - b.createdAtMs < BULLET_GRACE_MS) continue
        if (!this.isPlayerAlive(s.name)) continue
        const dx = nx - s.x
        const dy = ny - s.y
        const d2 = dx * dx + dy * dy
        if (d2 <= 25) {
          hit = s.name
          break
        }
      }
      if (hit) {
        this.eliminate([hit])
        this.state.bullets.splice(i, 1)
        continue
      }
      b.x = nx
      b.y = ny
    }

    if (this.state.remainingPlayers.length <= 1 && this.state.status === 'playing') {
      this.state.status = 'paused'
      this.clock.setTimeout(() => {
        this.finishGame()
      }, 1000)
    }
  }

  override getScores(): Score[] {
    const groups: string[][] = []
    groups.push([...this.state.remainingPlayers])
    for (const names of this.eliminatedPlayers) {
      groups.push([...names])
    }
    return assignScoresByRank(groups)
  }

  private eliminate(names: string[]) {
    if (names.length === 0) return
    this.eliminatedPlayers.push(names)
    names.forEach((name) => {
      const idx = this.state.remainingPlayers.indexOf(name)
      if (idx >= 0) this.state.remainingPlayers.splice(idx, 1)
      const shipIdx = this.state.ships.findIndex((s) => s.name === name)
      if (shipIdx >= 0) this.state.ships.splice(shipIdx, 1)
    })
  }

  private isPlayerAlive(name: string): boolean {
    return this.state.remainingPlayers.includes(name)
  }

  private findShip(name: string): ShipSchema | undefined {
    return this.state.ships.find((s) => s.name === name)
  }

  private directionToUnit(d: Direction): [number, number] {
    if (d === 'up') return [0, -1]
    if (d === 'down') return [0, 1]
    if (d === 'left') return [-1, 0]
    return [1, 0]
  }

  private clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v))
  }

  private applyFriction(v: number) {
    if (v > 0) return Math.max(0, v - SHIP_FRICTION_PER_TICK)
    if (v < 0) return Math.min(0, v + SHIP_FRICTION_PER_TICK)
    return v
  }
}
