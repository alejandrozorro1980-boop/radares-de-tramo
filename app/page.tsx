'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import LobbyScreen from '@/components/LobbyScreen'
import GameScreen from '@/components/GameScreen'
import WaitingScreen from '@/components/WaitingScreen'

type GameState = 'lobby' | 'waiting' | 'game' | 'game-over'

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('lobby')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [sessionCode, setSessionCode] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [gameData, setGameData] = useState<any>(null)

  useEffect(() => {
    const newSocket = io(undefined, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      const id = newSocket.id || Math.random().toString(36).substr(2, 9)
      setPlayerId(id)
    })

    newSocket.on('session-created', (data) => {
      setSessionCode(data.sessionCode)
      setGameState('waiting')
    })

    newSocket.on('session-joined', (data) => {
      setSessionCode(data.sessionCode)
      setGameState('waiting')
    })

    newSocket.on('game-started', (data) => {
      setGameData(data)
      setGameState('game')
    })

    newSocket.on('game-updated', (data) => {
      setGameData(data)
    })

    newSocket.on('game-over', (data) => {
      setGameData(data)
      setGameState('game-over')
    })

    newSocket.on('error', (message) => {
      alert('Error: ' + message)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const handleCreateSession = (name: string) => {
    setPlayerName(name)
    if (socket) {
      socket.emit('create-session', { playerName: name })
    }
  }

  const handleJoinSession = (name: string, code: string) => {
    setPlayerName(name)
    if (socket) {
      socket.emit('join-session', { playerName: name, sessionCode: code })
    }
  }

  const handleStartGame = () => {
    if (socket) {
      socket.emit('start-game', { sessionCode })
    }
  }

  const handlePlayTurn = (action: string) => {
    if (socket) {
      socket.emit('player-turn', { sessionCode, playerId, action })
    }
  }

  const handlePlayAgain = () => {
    setGameState('lobby')
    setSessionCode('')
    setGameData(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {gameState === 'lobby' && (
        <LobbyScreen
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
        />
      )}

      {gameState === 'waiting' && (
        <WaitingScreen
          sessionCode={sessionCode}
          gameData={gameData}
          playerName={playerName}
          onStartGame={handleStartGame}
        />
      )}

      {gameState === 'game' && (
        <GameScreen
          gameData={gameData}
          playerId={playerId}
          sessionCode={sessionCode}
          onPlayTurn={handlePlayTurn}
        />
      )}

      {gameState === 'game-over' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-8">🏁 ¡JUEGO TERMINADO! 🏁</h1>
            <div className="space-y-4 mb-8">
              {gameData?.players
                .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
                .map((p: any, i: number) => (
                  <div key={i} className="text-2xl">
                    {i === 0 && '🥇'} {i === 1 && '🥈'} {i === 2 && '🥉'}{' '}
                    {p.name}: {p.points} puntos
                  </div>
                ))}
            </div>
            <button
              onClick={handlePlayAgain}
              className="bg-socialist-red px-6 py-3 rounded-lg font-bold text-lg hover:bg-red-700"
            >
              Jugar de Nuevo
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
