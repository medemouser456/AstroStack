export function renderMatrix(onComplete) {
  // Create fullscreen matrix
  const matrix = document.createElement('div')
  matrix.id = 'matrix-screen'
  matrix.style.cssText = `
    position: fixed; inset: 0; background: #000;
    z-index: 9999; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  `
  matrix.innerHTML = `
    <canvas id="matrix-canvas" style="position:absolute;inset:0;"></canvas>
    <div id="matrix-center" style="
      position:relative; z-index:2; text-align:center;
      padding: 40px; max-width: 800px;
    ">
      <div style="
        font-family:'Cormorant Garamond',serif;
        font-size:72px; font-weight:700; color:#FF6600;
        text-shadow: 0 0 60px rgba(255,102,0,1), 0 0 120px rgba(255,102,0,0.6);
        margin-bottom:20px; line-height:1;
        animation: mGlow 1.5s ease-in-out infinite alternate;
      ">🔮 Blessed Astro</div>
      <div id="matrix-tagline" style="
        font-family:'Cormorant Garamond',serif;
        font-size:28px; color:#C8960C; font-style:italic;
        text-shadow: 0 0 30px rgba(200,150,12,0.8);
        opacity:0; transition: opacity 1s ease;
        line-height:1.4;
      ">"Indian Vedic Wisdom for all Life Decisions"</div>
      <div id="matrix-sub" style="
        font-size:14px; color:#FF8C40; margin-top:20px;
        opacity:0; transition: opacity 1s ease;
        letter-spacing:3px; text-transform:uppercase;
      ">Connecting to the cosmos...</div>
    </div>
    <style>
      @keyframes mGlow {
        from { text-shadow: 0 0 30px rgba(255,102,0,0.7); }
        to { text-shadow: 0 0 80px rgba(255,102,0,1), 0 0 160px rgba(255,102,0,0.5); }
      }
    </style>
  `
  document.body.appendChild(matrix)

  const canvas = document.getElementById('matrix-canvas')
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const chars = 'ॐअआइईउऊएकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह ♈♉♊♋♌♍♎♏♐♑♒♓☉☽♂♃♄♅♆१२३४५६७८९'.split('')
  const fontSize = 16
  let drops = []

  function initDrops() {
    const cols = Math.floor(canvas.width / fontSize)
    drops = Array(cols).fill(1)
  }
  initDrops()

  const colors = ['#FF6600','#C8960C','#FF8C40','#E8B84B','#FFD700','#FF4500','#FFA500']

  function drawMatrix() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = 6
      ctx.font = `${fontSize}px "Noto Sans Devanagari", monospace`
      ctx.fillText(char, i * fontSize, y * fontSize)
      ctx.shadowBlur = 0
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
      drops[i]++
    })
  }

  const interval = setInterval(drawMatrix, 45)

  // Show tagline after 1 second
  setTimeout(() => {
    document.getElementById('matrix-tagline').style.opacity = '1'
  }, 1000)

  // Show sub text after 2 seconds
  setTimeout(() => {
    document.getElementById('matrix-sub').style.opacity = '1'
  }, 2000)

  // Fade out after 5 seconds
  setTimeout(() => {
    clearInterval(interval)
    matrix.style.transition = 'opacity 1s ease'
    matrix.style.opacity = '0'
    setTimeout(() => {
      matrix.remove()
      window.removeEventListener('resize', resize)
      onComplete()
    }, 1000)
  }, 5000)
}

// ── MATRIX BACKGROUND FOR CHAT PAGE ───────────────────
export function startMatrixBackground() {
  const existing = document.getElementById('chat-matrix-canvas')
  if (existing) return

  const canvas = document.createElement('canvas')
  canvas.id = 'chat-matrix-canvas'
  canvas.style.cssText = `
    position: fixed; inset: 0;
    width: 100%; height: 100%;
    z-index: 0; pointer-events: none;
    opacity: 0.12;
  `
  document.body.insertBefore(canvas, document.body.firstChild)

  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const chars = 'ॐ♈♉♊♋♌♍♎♏♐♑♒♓☉☽♂♃♄१२३४५६७८९अआइईउऊ'.split('')
  const fontSize = 14
  let drops = Array(Math.floor(canvas.width / fontSize)).fill(1)

  const colors = ['#FF6600','#C8960C','#FF8C40','#FFD700']

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.04)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)]
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      ctx.font = `${fontSize}px "Noto Sans Devanagari", monospace`
      ctx.fillText(char, i * fontSize, y * fontSize)
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
      drops[i]++
    })
  }

  setInterval(draw, 60)
}