const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server: SocketIOServer } = require('socket.io')
const { v4: uuidv4 } = require('uuid')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Game state
const sessions = new Map()
const GAME_EVENTS = require('./lib/gameEvents').GAME_EVENTS

function generateSessionCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  if (sessions.has(code)) {
    return generateSessionCode()
  }
  return code
}

function getRandomEvent() {
  return GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)]
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id)

    socket.on('create-session', (data) => {
      const sessionCode = generateSessionCode()
      const gameSession = {
        id: uuidv4(),
        code: sessionCode,
        host: data.playerName,
        players: [
          {
            id: socket.id,
            name: data.playerName,
            lives: 5,
            points: 0,
          },
        ],
        currentPlayerIdx: 0,
        turnNumber: 0,
        started: false,
        lastEvent: null,
        eliminated: [],
        startTime: Date.now(),
      }

      sessions.set(sessionCode, gameSession)
      socket.join(`session-${sessionCode}`)
      socket.emit('session-created', { sessionCode })

      io.to(`session-${sessionCode}`).emit('game-updated', {
        ...gameSession,
        players: gameSession.players,
      })
    })

    socket.on('join-session', (data) => {
      const session = sessions.get(data.sessionCode)

      if (!session) {
        socket.emit('error', 'Sesión no encontrada')
        return
      }

      if (session.players.length >= 7) {
        socket.emit('error', 'Sesión llena')
        return
      }

      if (session.started) {
        socket.emit('error', 'Juego ya ha comenzado')
        return
      }

      const newPlayer = {
        id: socket.id,
        name: data.playerName,
        lives: 5,
        points: 0,
      }

      session.players.push(newPlayer)
      socket.join(`session-${data.sessionCode}`)
      socket.emit('session-joined', { sessionCode: data.sessionCode })

      io.to(`session-${data.sessionCode}`).emit('game-updated', {
        ...session,
        players: session.players,
      })
    })

    socket.on('start-game', (data) => {
      const session = sessions.get(data.sessionCode)

      if (!session) {
        socket.emit('error', 'Sesión no encontrada')
        return
      }

      if (session.players.length < 2) {
        socket.emit('error', 'Necesitas al menos 2 jugadores')
        return
      }

      session.started = true
      session.turnNumber = 1

      io.to(`session-${data.sessionCode}`).emit('game-started', {
        ...session,
        currentPlayer: session.players[0],
      })
    })

    socket.on('player-turn', (data) => {
      const session = sessions.get(data.sessionCode)

      if (!session || !session.started) {
        socket.emit('error', 'Sesión inválida')
        return
      }

      const currentPlayer = session.players[session.currentPlayerIdx]

      if (currentPlayer.id !== data.playerId) {
        socket.emit('error', 'No es tu turno')
        return
      }

      if (data.action === 'roll-dice') {
        const event = getRandomEvent()
        const dice = Math.floor(Math.random() * 6) + 1

        // Apply event
        currentPlayer.lives += event.livesChange
        currentPlayer.points += event.pointsChange

        // Check if player is eliminated
        if (currentPlayer.lives <= 0) {
          session.eliminated.push(currentPlayer)
          session.players.splice(session.currentPlayerIdx, 1)

          if (session.currentPlayerIdx >= session.players.length) {
            session.currentPlayerIdx = 0
          }
        } else {
          session.currentPlayerIdx =
            (session.currentPlayerIdx + 1) % session.players.length
        }

        session.turnNumber++
        session.lastEvent = { ...event, diceRoll: dice }

        // Check if game is over
        if (session.players.length <= 1) {
          const winner = session.players[0]
          io.to(`session-${data.sessionCode}`).emit('game-over', {
            ...session,
            winner,
          })
          sessions.delete(data.sessionCode)
          return
        }

        // Check timeout
        if (Date.now() - session.startTime > 20 * 60 * 1000) {
          const winner = session.players.reduce((a, b) =>
            a.points > b.points ? a : b
          )
          io.to(`session-${data.sessionCode}`).emit('game-over', {
            ...session,
            winner,
          })
          sessions.delete(data.sessionCode)
          return
        }

        io.to(`session-${data.sessionCode}`).emit('game-updated', {
          ...session,
          currentPlayer: session.players[session.currentPlayerIdx],
          players: session.players,
        })
      }

      if (data.action === 'play-minigame') {
        const winnerIdx = Math.floor(Math.random() * session.players.length)
        session.players[winnerIdx].lives++

        session.currentPlayerIdx =
          (session.currentPlayerIdx + 1) % session.players.length
        session.turnNumber++

        io.to(`session-${data.sessionCode}`).emit('game-updated', {
          ...session,
          currentPlayer: session.players[session.currentPlayerIdx],
          players: session.players,
        })
      }
    })

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id)

      for (const [code, session] of sessions.entries()) {
        const playerIdx = session.players.findIndex((p) => p.id === socket.id)
        if (playerIdx !== -1) {
          session.players.splice(playerIdx, 1)
          if (session.players.length === 0) {
            sessions.delete(code)
          }
        }
      }
    })
  })

  const PORT = process.env.PORT || 3000
  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
