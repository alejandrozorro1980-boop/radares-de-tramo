'use client'

interface Props {
  sessionCode: string
  gameData: any
  playerName: string
  onStartGame: () => void
  loading?: boolean
}

export default function WaitingScreen({
  sessionCode,
  gameData,
  playerName,
  onStartGame,
  loading = false,
}: Props) {
  const isHost = gameData?.host === playerName
  const playerCount = gameData?.players?.length || 0

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            🚗 ESPERANDO JUGADORES
          </h1>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <p className="text-gray-300 mb-2">Código de Sesión:</p>
            <p className="text-4xl font-bold text-political-yellow font-mono tracking-widest">
              {sessionCode}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Comparte este código con tus amigos
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xl font-bold mb-4">
              Jugadores: {playerCount}/7
            </p>
            <div className="space-y-2">
              {gameData?.players?.map((player: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-700 p-3 rounded flex items-center justify-between"
                >
                  <span>
                    {player.name}
                    {isHost && player.name === playerName && ' (TÚ - HOST)'}
                    {!isHost && player.name === playerName && ' (TÚ)'}
                  </span>
                  <span className="text-lg">
                    {player.name === playerName ? '👤' : '👥'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isHost && playerCount >= 2 && (
            <button
              onClick={onStartGame}
              disabled={loading}
              className="w-full bg-socialist-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Iniciando...' : '▶️ Iniciar Juego'}
            </button>
          )}

          {isHost && playerCount < 2 && (
            <p className="text-yellow-400 font-bold">
              Necesitas al menos 2 jugadores
            </p>
          )}

          {!isHost && (
            <p className="text-gray-400">
              El host iniciará el juego cuando esté listo...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
