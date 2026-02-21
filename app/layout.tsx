import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RADARES DE TRAMO - The Game',
  description: 'Juego multijugador satírico sobre radares, PSOE y Sara Santaolalla',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
