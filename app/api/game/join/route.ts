import { NextRequest, NextResponse } from 'next/server'
import { gameState } from '@/lib/gameState'

export async function POST(request: NextRequest) {
  const { playerName, sessionCode } = await request.json()

  if (!playerName || !sessionCode) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const session = gameState.addPlayer(sessionCode.toUpperCase(), playerName)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({
    sessionCode: session.code,
    players: session.players,
    host: session.host,
  })
}
