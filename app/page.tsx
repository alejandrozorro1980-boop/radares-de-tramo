'use client'

import { useEffect, useState } from 'react'
import LobbyScreen from '@/components/LobbyScreen'
import GameScreen from '@/components/GameScreen'
import WaitingScreen from '@/components/WaitingScreen'

type GameState = 'lobby' | 'waiting' | 'game' | 'game-over'

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('lobby')
  const [sessionCode, setSessionCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [gameData, setGameData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)

  // Polling function
  const pollGameStatus = async (code: string) => {
    try {
      const res = await fetch(`/api/game/status?code=${code}`)
      const data = await res.json()
      setGameData(data)

      if (data.started && !data.gameOver) {
        setGameState('game')
      } else if (data.gameOver) {
        setGameState('game-over')
      }
    } catch (err) {
      console.error('Polling error:', err)
    }
  }

  // Start polling when in waiting or game state
  useEffect(() => {
    if ((gameState === 'waiting' || gameState === 'game') && sessionCode) {
      const interval = setInterval(() => {
        pollGameStatus(sessionCode)
      }, 500) // Poll every 500ms
      setPollInterval(interval)

      return () => clearInterval(interval)
    }
  }, [gameState, sessionCode])

  const handleCreateSession = async (name: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: name }),
      })
      const data = await res.json()
      setPlayerName(name)
      setSessionCode(data.sessionCode)
      setGameData(data)
      setGameState('waiting')
    } catch (err) {
      setError('Error creating session')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinSession = async (name: string, code: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/game/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: name, sessionCode: code }),
      })
      if (!res.ok) throw new Error('Join failed')
      const data = await res.json()
      setPlayerName(name)
      setSessionCode(data.sessionCode)
      setGameData(data)
      setGameState('waiting')
    } catch (err) {
      setError('Session no encontrada o llena')
    } finally {
      setLoading(false)
    }
  }

  const handleStartGame = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionCode }),
      })
      const data = await res.json()
      setGameData(data)
      setGameState('game')
    } catch (err) {
      setError('Error starting game')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayTurn = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/game/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionCode }),
      })
      const data = await res.json()
      setGameData(data)

      if (data.gameOver) {
        setGameState('game-over')
      }
    } catch (err) {
      setError('Error during turn')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAgain = () => {
    setGameState('lobby')
    setSessionCode('')
    setGameData(null)
    setError('')
    if (pollInterval) clearInterval(pollInterval)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded z-50">
          {error}
        </div>
      )}

      {gameState === 'lobby' && (
        <LobbyScreen
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
          loading={loading}
        />
      )}

      {gameState === 'waiting' && (
        <WaitingScreen
          sessionCode={sessionCode}
          gameData={gameData}
          playerName={playerName}
          onStartGame={handleStartGame}
          loading={loading}
        />
      )}

      {gameState === 'game' && (
        <GameScreen
          gameData={gameData}
          playerName={playerName}
          sessionCode={sessionCode}
          onPlayTurn={handlePlayTurn}
          loading={loading}
        />
      )}

      {gameState === 'game-over' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-8 text-socialist-red">
              🏁 ¡JUEGO TERMINADO! 🏁
            </h1>
            <div className="space-y-4 mb-8 max-w-md">
              {gameData?.players
                ?.sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
                .map((p: any, i: number) => (
                  <div key={i} className="text-2xl">
                    {i === 0 && '🥇'} {i === 1 && '🥈'} {i === 2 && '🥉'}{' '}
                    {p.name}: {p.points} puntos ({p.lives} vidas)
                  </div>
                ))}
            </div>
            <button
              onClick={handlePlayAgain}
              className="bg-socialist-red px-6 py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition"
            >
              Jugar de Nuevo
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
