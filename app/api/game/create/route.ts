import { NextRequest, NextResponse } from 'next/server'
import { gameState } from '@/lib/gameState'

export async function POST(request: NextRequest) {
  const { playerName } = await request.json()

  if (!playerName || playerName.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid player name' }, { status: 400 })
  }

  const session = gameState.createSession(playerName)
  return NextResponse.json({
    sessionCode: session.code,
    players: session.players,
  })
}
