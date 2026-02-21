// Game state management - In-memory store
interface Player {
  id: string
  name: string
  lives: number
  points: number
}

interface GameSession {
  id: string
  code: string
  host: string
  players: Player[]
  currentPlayerIdx: number
  turnNumber: number
  started: boolean
  lastEvent: any
  eliminated: Player[]
  startTime: number
  winner?: Player
  gameOver: boolean
}

class GameStateManager {
  private sessions: Map<string, GameSession> = new Map()

  createSession(playerName: string): GameSession {
    const code = this.generateCode()
    const session: GameSession = {
      id: Math.random().toString(36).substr(2, 9),
      code,
      host: playerName,
      players: [{ id: Math.random().toString(36), name: playerName, lives: 5, points: 0 }],
      currentPlayerIdx: 0,
      turnNumber: 0,
      started: false,
      lastEvent: null,
      eliminated: [],
      startTime: Date.now(),
      gameOver: false,
    }
    this.sessions.set(code, session)
    return session
  }

  getSession(code: string): GameSession | null {
    return this.sessions.get(code) || null
  }

  addPlayer(code: string, playerName: string): GameSession | null {
    const session = this.sessions.get(code)
    if (!session) return null

    session.players.push({
      id: Math.random().toString(36),
      name: playerName,
      lives: 5,
      points: 0,
    })
    return session
  }

  startGame(code: string): GameSession | null {
    const session = this.sessions.get(code)
    if (!session || session.players.length < 2) return null

    session.started = true
    session.turnNumber = 1
    return session
  }

  playTurn(code: string, event: any): GameSession | null {
    const session = this.sessions.get(code)
    if (!session || !session.started) return null

    const player = session.players[session.currentPlayerIdx]
    player.lives += event.livesChange
    player.points += event.pointsChange

    if (player.lives <= 0) {
      session.eliminated.push(player)
      session.players.splice(session.currentPlayerIdx, 1)
      if (session.currentPlayerIdx >= session.players.length) {
        session.currentPlayerIdx = 0
      }
    } else {
      session.currentPlayerIdx = (session.currentPlayerIdx + 1) % session.players.length
    }

    session.lastEvent = event
    session.turnNumber++

    if (session.players.length <= 1) {
      session.gameOver = true
      session.winner = session.players[0]
    }

    if (Date.now() - session.startTime > 20 * 60 * 1000) {
      session.gameOver = true
      session.winner = session.players.reduce((a, b) => (a.points > b.points ? a : b))
    }

    return session
  }

  private generateCode(): string {
    let code = ''
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return this.sessions.has(code) ? this.generateCode() : code
  }
}

export const gameState = new GameStateManager()
