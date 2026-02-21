'use client'

import { useState, useEffect } from 'react'

interface Props {
  gameData: any
  playerId: string
  sessionCode: string
  onPlayTurn: (action: string) => void
}

export default function GameScreen({
  gameData,
  playerId,
  sessionCode,
  onPlayTurn,
}: Props) {
  const currentPlayer = gameData?.currentPlayer
  const isYourTurn = currentPlayer?.id === playerId
  const currentEvent = gameData?.lastEvent
  const players = gameData?.players || []
  const turnNumber = gameData?.turnNumber || 0

  const handleRollDice = () => {
    if (isYourTurn) {
      onPlayTurn('roll-dice')
    }
  }

  const handlePlayMinigame = () => {
    if (isYourTurn) {
      onPlayTurn('play-minigame')
    }
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-socialist-red">
          🎮 TURNO #{turnNumber}
        </h1>
        <div className="text-center bg-gray-800 px-4 py-2 rounded">
          <p className="text-gray-400 text-sm">Código</p>
          <p className="text-xl font-bold font-mono text-political-yellow">
            {sessionCode}
          </p>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Center - Current Event & Actions */}
        <div className="lg:col-span-2">
          {/* Current Player */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <p className="text-gray-400 text-sm mb-2">Turno de:</p>
            <p className="text-3xl font-bold text-political-yellow">
              {currentPlayer?.name}
            </p>
            {isYourTurn && (
              <p className="text-socialist-red font-bold mt-2">¡ES TU TURNO!</p>
            )}
          </div>

          {/* Event Card */}
          {currentEvent ? (
            <div className="bg-gradient-to-br from-radar-blue to-purple-900 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">{currentEvent.title}</h2>
              <p className="text-lg mb-4">{currentEvent.description}</p>
              <div className="flex justify-around text-2xl">
                {currentEvent.type === 'negative' && (
                  <span className="text-red-400">❌ -1 Vida</span>
                )}
                {currentEvent.type === 'positive' && (
                  <span className="text-green-400">✅ +50 Puntos</span>
                )}
                {currentEvent.type === 'neutral' && (
                  <span className="text-gray-400">➡️ Sin efecto</span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-6 mb-6 text-center">
              <p className="text-xl">Esperando tu turno...</p>
            </div>
          )}

          {/* Action Buttons */}
          {isYourTurn && (
            <div className="space-y-3">
              <button
                onClick={handleRollDice}
                className="w-full bg-socialist-red hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition transform hover:scale-105"
              >
                🎲 Tirar Dado
              </button>
              {turnNumber % 3 === 0 && turnNumber > 0 && (
                <button
                  onClick={handlePlayMinigame}
                  className="w-full bg-political-yellow hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg text-lg transition transform hover:scale-105"
                >
                  ⚡ Mini-juego
                </button>
              )}
            </div>
          )}

          {!isYourTurn && (
            <div className="text-center text-gray-400 text-lg">
              Esperando a {currentPlayer?.name}...
            </div>
          )}
        </div>

        {/* Right - Players List */}
        <div className="bg-gray-800 rounded-lg p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">📊 Jugadores</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {players.map((player: any, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded ${
                  player.id === playerId
                    ? 'bg-socialist-red'
                    : player.id === currentPlayer?.id
                    ? 'bg-political-yellow text-black'
                    : 'bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{player.name}</span>
                  <div className="text-sm text-right">
                    <div>
                      {Array(player.lives)
                        .fill(0)
                        .map((_, i) => (
                          <span key={i} className="heart">
                            ❤️
                          </span>
                        ))}
                    </div>
                    <div className="text-xs mt-1">{player.points} pts</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eliminated Players */}
      {gameData?.eliminated?.length > 0 && (
        <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 text-center">
          <p className="text-red-300">
            💀 Eliminados: {gameData.eliminated.map((p: any) => p.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
