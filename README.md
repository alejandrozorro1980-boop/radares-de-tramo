# 🚗 RADARES DE TRAMO - The Game

Un juego interactivo multijugador y satírico sobre los radares de tramo, la política española, Sara Santaolalla y la corrupción.

## 🎮 Características

- **2-7 jugadores** en tiempo real vía WebSockets
- **Mecánica de turnos**: Cada jugador tira dado y recibe un evento aleatorio
- **50+ eventos satíricos** sobre:
  - Radares de tramo
  - PSOE y política española
  - Sara Santaolalla
  - Corrupción y multas
- **Sistema de vidas (5 iniciales)** - Último en pie gana
- **Puntos** - Desempate por puntuación
- **Mini-juegos** cada 3 turnos
- **Código de sesión** de 6 caracteres para unirse
- **100% responsive** - Funciona en móvil, tablet y desktop
- **Duración**: 15-20 minutos

## 🚀 Inicio Rápido

### Instalación Local

```bash
# Clonar repo
git clone https://github.com/tu-usuario/radares-de-tramo.git
cd radares-de-tramo

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📋 Cómo Jugar

1. **Crear o Unirse a una Partida**
   - Botón "Crear Nueva Partida" - Te da un código de 6 caracteres
   - Botón "Unirse a Partida" - Necesitas el código de tu amigo

2. **Lobby**
   - Espera a que se unan más jugadores (2-7 máximo)
   - El host inicia cuando está listo

3. **Durante la Partida**
   - Cada jugador tira dado cuando es su turno
   - Se activa un evento aleatorio
   - Algunos eventos restan vidas ❌, otros dan puntos ✅
   - Cuando pierdes todas las vidas, estás out
   - Último jugador con vidas gana 🏆

4. **Victoria**
   - Serás el último en pie, o
   - Si pasan 20 minutos, gana quien tenga más puntos

## 🛠️ Stack Técnico

- **Frontend**: React 18 + Next.js 14
- **Styling**: Tailwind CSS
- **WebSockets**: Socket.IO (tiempo real)
- **Backend**: Node.js + Next.js API Routes
- **Session Storage**: En memoria (escalable a Redis)
- **Deploy**: Vercel

## 📁 Estructura del Proyecto

```
radares-de-tramo/
├── app/
│   ├── page.tsx          # Página principal (cliente)
│   ├── layout.tsx        # Layout root
│   └── globals.css       # Estilos globales
├── components/
│   ├── LobbyScreen.tsx   # Pantalla de menú
│   ├── WaitingScreen.tsx # Lobby de espera
│   └── GameScreen.tsx    # Pantalla de juego
├── lib/
│   ├── gameEvents.ts     # 50+ eventos satíricos
│   └── socketHandler.ts  # Lógica de Socket.IO
├── server.js             # Servidor con WebSockets
├── next.config.js        # Config Next.js
├── tailwind.config.js    # Config Tailwind
└── package.json
```

## 🎲 Eventos del Juego (Ejemplos)

### Radares de Tramo ⚠️
- "¡RADAR! Excediste 3 km/h. Multa de €2.500" → -1 vida
- "Radar fantasma detectado. ¿Quién lo pone? Sara desde un helicóptero" → -2 vidas
- "¡JACKPOT: Radar sin batería!" → +50 puntos

### PSOE & Política 🔴
- "El PSOE vota favor de radares. Impuestos disfrazados" → -1 vida
- "Sánchez anuncia: 'Los radares son progresistas'" → -1 vida
- "PSOE promete: 'Sin radares en el siguiente mandato'" → +50 puntos (irónico)

### Sara Santaolalla 👤
- "Sara aparece en TV: 'Los radares salvaban vidas'" → -1 vida
- "Sara cena con ministra de Transportes" → -2 vidas
- "Descubierto: Sara tiene acciones en empresa de radares" → -3 vidas

### Corrupción & Multas 💰
- "Funcionario DGT traficaba con multas falsas" → Sin efecto
- "40% de las multas son errores de software" → +30 puntos
- "Justicia: Las multas son ilegales. Reembolso!" → +100 puntos

## 🌐 Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

O conecta tu GitHub repo directamente a Vercel desde https://vercel.com

**URL Jugable**: https://radares-de-tramo.vercel.app (después de deploy)

## 📱 Funcionalidad Móvil

- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Funciona en iOS y Android
- ✅ No requiere instalación (web app)

## 🔒 Privacidad & Seguridad

- No se almacena información personal
- Sesiones en memoria (se borran después del juego)
- Sin analytics ni tracking
- Código abierto (auditable)

## 🐛 Bugs Conocidos

Ninguno reportado. ¡Reporta si encuentras alguno!

## 💡 Ideas Futuras

- [ ] Minigames más interactivos
- [ ] Avatares y customización
- [ ] Leaderboard global
- [ ] Modos de juego adicionales
- [ ] Sonidos y música
- [ ] Efectos visuales mejorados
- [ ] Persistencia de sesiones (Redis)
- [ ] Modo single-player vs IA

## 👥 Contribuciones

¡Contribuciones bienvenidas! Haz un fork, crea una rama feature y envía un PR.

## 📄 Licencia

MIT - Usa libremente

## 🎭 Disclaimer

Este juego es satírico y está hecho con fines de entretenimiento. Cualquier parecido con personas vivas o eventos reales es pura coincidencia (o no).

---

**Desarrollado con ❤️ y mucha sátira política** 🚗💨

¿Preguntas? Abre una issue en GitHub.
