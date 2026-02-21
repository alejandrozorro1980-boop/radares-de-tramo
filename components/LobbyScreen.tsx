'use client'

import { useState } from 'react'

interface Props {
  onCreateSession: (name: string) => void
  onJoinSession: (name: string, code: string) => void
  loading?: boolean
}

export default function LobbyScreen({ onCreateSession, onJoinSession, loading = false }: Props) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu')
  const [playerName, setPlayerName] = useState('')
  const [sessionCode, setSessionCode] = useState('')

  const handleCreate = () => {
    if (playerName.trim() && !loading) {
      onCreateSession(playerName)
    }
  }

  const handleJoin = () => {
    if (playerName.trim() && sessionCode.trim() && !loading) {
      onJoinSession(playerName, sessionCode.toUpperCase())
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full">
        {mode === 'menu' && (
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2 text-socialist-red">
              🚗 RADARES DE TRAMO 🚨
            </h1>
            <p className="text-xl mb-4 text-yellow-400 font-bold">
              ¡El juego más satírico sobre política y multas!
            </p>
            <div className="space-y-4 mt-8">
              <button
                onClick={() => setMode('create')}
                className="w-full bg-socialist-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition"
              >
                ➕ Crear Nueva Partida
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full bg-radar-blue hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg text-lg transition"
              >
                🔗 Unirse a Partida
              </button>
            </div>
            <div className="mt-8 p-4 bg-gray-700 rounded-lg text-sm text-left">
              <p className="mb-2">
                <strong>¿Cómo jugar?</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>2-7 jugadores máximo</li>
                <li>Evita radares (eventos)</li>
                <li>Último con vidas gana</li>
                <li>Duración: 15-20 min</li>
              </ul>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center">
              ➕ Crear Partida
            </h2>
            <input
              type="text"
              placeholder="Tu nombre (nick)"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={loading}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-socialist-red disabled:opacity-50"
              maxLength={20}
            />
            <div className="space-y-2">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full bg-socialist-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Crear'}
              </button>
              <button
                onClick={() => {
                  setMode('menu')
                  setPlayerName('')
                }}
                disabled={loading}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Atrás
              </button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center">
              🔗 Unirse a Partida
            </h2>
            <input
              type="text"
              placeholder="Tu nombre (nick)"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={loading}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-radar-blue disabled:opacity-50"
              maxLength={20}
            />
            <input
              type="text"
              placeholder="Código de sesión (ej: ABC123)"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              disabled={loading}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-radar-blue text-center text-2xl letter-spacing-2 font-mono disabled:opacity-50"
              maxLength={6}
            />
            <div className="space-y-2">
              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full bg-radar-blue hover:bg-blue-900 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uniéndose...' : 'Unirse'}
              </button>
              <button
                onClick={() => {
                  setMode('menu')
                  setPlayerName('')
                  setSessionCode('')
                }}
                disabled={loading}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Atrás
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
