'use client'

interface Props {
  gameData: any
  playerName: string
  sessionCode: string
  onPlayTurn: () => void
  loading?: boolean
}

export default function GameScreen({
  gameData,
  playerName,
  sessionCode,
  onPlayTurn,
  loading = false,
}: Props) {
  const currentPlayer = gameData?.currentPlayer
  const isYourTurn = currentPlayer?.name === playerName
  const currentEvent = gameData?.lastEvent
  const players = gameData?.players || []
  const turnNumber = gameData?.turnNumber || 0

  return (
    <div className="min-h-screen p-2 sm:p-4 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-socialist-red">
          🎮 TURNO #{turnNumber}
        </h1>
        <div className="text-center bg-gray-800 px-4 py-2 rounded">
          <p className="text-gray-400 text-xs sm:text-sm">Código</p>
          <p className="text-lg sm:text-xl font-bold font-mono text-political-yellow">
            {sessionCode}
          </p>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Center - Current Event & Actions */}
        <div className="lg:col-span-2">
          {/* Current Player */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Turno de:</p>
            <p className="text-2xl sm:text-3xl font-bold text-political-yellow truncate">
              {currentPlayer?.name || '...'}
            </p>
            {isYourTurn && (
              <p className="text-socialist-red font-bold mt-2 animate-pulse">
                ¡ES TU TURNO!
              </p>
            )}
          </div>

          {/* Event Card */}
          {currentEvent && (
            <div className="bg-gradient-to-br from-radar-blue to-purple-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4">
                {currentEvent.title}
              </h2>
              <p className="text-base sm:text-lg mb-4">{currentEvent.description}</p>
              <div className="flex justify-center text-lg sm:text-2xl">
                {currentEvent.livesChange < 0 && (
                  <span className="text-red-400">❌ {currentEvent.livesChange} Vidas</span>
                )}
                {currentEvent.livesChange > 0 && (
                  <span className="text-green-400">✅ +{currentEvent.livesChange} Vidas</span>
                )}
                {currentEvent.pointsChange > 0 && (
                  <span className="text-yellow-400">⭐ +{currentEvent.pointsChange} Puntos</span>
                )}
                {currentEvent.livesChange === 0 &&
                  currentEvent.pointsChange === 0 && (
                    <span className="text-gray-400">➡️ Sin efecto</span>
                  )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isYourTurn && (
            <button
              onClick={onPlayTurn}
              disabled={loading}
              className="w-full bg-socialist-red hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? '⏳ Tirando dado...' : '🎲 Tirar Dado'}
            </button>
          )}

          {!isYourTurn && (
            <div className="text-center text-gray-400 text-base sm:text-lg bg-gray-800 p-4 rounded-lg">
              ⏳ Esperando a {currentPlayer?.name || '...'}...
            </div>
          )}
        </div>

        {/* Right - Players List (Responsive) */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 h-fit lg:sticky lg:top-4">
          <h3 className="text-lg sm:text-xl font-bold mb-4">📊 Jugadores</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {players.map((player: any, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded text-sm sm:text-base transition ${
                  player.name === playerName
                    ? 'bg-socialist-red ring-2 ring-yellow-400'
                    : player.name === currentPlayer?.name
                    ? 'bg-political-yellow text-black'
                    : 'bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold truncate">{player.name}</span>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs">
                      {Array(Math.max(0, player.lives))
                        .fill(0)
                        .map((_, i) => (
                          <span key={i} className="heart inline-block">
                            ❤️
                          </span>
                        ))}
                    </div>
                    <div className="text-xs mt-1 font-bold">
                      {player.points} pts
                    </div>
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
          <p className="text-red-300 text-sm sm:text-base">
            💀 Eliminados: {gameData.eliminated.map((p: any) => p.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
