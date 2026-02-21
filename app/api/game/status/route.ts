import { NextRequest, NextResponse } from 'next/server'
import { gameState } from '@/lib/gameState'

export async function GET(request: NextRequest) {
  const sessionCode = request.nextUrl.searchParams.get('code')

  if (!sessionCode) {
    return NextResponse.json({ error: 'Missing session code' }, { status: 400 })
  }

  const session = gameState.getSession(sessionCode.toUpperCase())
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({
    sessionCode: session.code,
    players: session.players,
    currentPlayer: session.players[session.currentPlayerIdx],
    turnNumber: session.turnNumber,
    started: session.started,
    gameOver: session.gameOver,
    winner: session.winner,
    eliminated: session.eliminated,
    host: session.host,
    lastEvent: session.lastEvent,
  })
}
