// Socket.IO handler para Vercel (polling backend)
// Nota: En producción, se recomienda usar Railway, Render o un servidor Node.js propio

export async function GET() {
  return new Response('Socket.IO server running', { status: 200 })
}

export async function POST() {
  return new Response('Socket.IO POST', { status: 200 })
}
