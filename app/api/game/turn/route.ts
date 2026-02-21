import { NextRequest, NextResponse } from 'next/server'
import { gameState } from '@/lib/gameState'
import { GAME_EVENTS } from '@/lib/gameEvents'

export async function POST(request: NextRequest) {
  const { sessionCode } = await request.json()

  if (!sessionCode) {
    return NextResponse.json({ error: 'Missing session code' }, { status: 400 })
  }

  const session = gameState.getSession(sessionCode.toUpperCase())
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Get random event
  const event = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)]

  // Play turn
  const updatedSession = gameState.playTurn(sessionCode.toUpperCase(), event)

  return NextResponse.json({
    sessionCode: updatedSession?.code,
    players: updatedSession?.players,
    currentPlayer: updatedSession?.players[updatedSession.currentPlayerIdx],
    lastEvent: updatedSession?.lastEvent,
    turnNumber: updatedSession?.turnNumber,
    gameOver: updatedSession?.gameOver,
    winner: updatedSession?.winner,
    eliminated: updatedSession?.eliminated,
  })
}
