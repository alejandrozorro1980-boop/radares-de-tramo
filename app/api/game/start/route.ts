import { NextRequest, NextResponse } from 'next/server'
import { gameState } from '@/lib/gameState'

export async function POST(request: NextRequest) {
  const { sessionCode } = await request.json()

  if (!sessionCode) {
    return NextResponse.json({ error: 'Missing session code' }, { status: 400 })
  }

  const session = gameState.startGame(sessionCode.toUpperCase())
  if (!session) {
    return NextResponse.json({ error: 'Session not found or invalid' }, { status: 404 })
  }

  return NextResponse.json({
    sessionCode: session.code,
    players: session.players,
    currentPlayer: session.players[0],
    started: true,
  })
}
