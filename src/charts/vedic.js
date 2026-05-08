// ── VEDIC D1 & D9 CHART RENDERER ────────────────────
export function renderVedicChart(chart, chartType = 'D1') {
  if (!chart || !chart.vedic) return '<div class="chart-error">Chart data unavailable</div>'

  const data = chartType === 'D1' ? chart.vedic : chart.navamsha || chart.vedic
  const svgWidth = 400
  const svgHeight = 400
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  const outerRadius = 150
  const innerRadius = 100

  // North Indian Chart: Diamond shape
  const points = generateDiamondPoints(centerX, centerY, outerRadius)
  
  // Build SVG
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" class="vedic-chart">
    <defs>
      <style>
        .chart-house { fill: none; stroke: #ffa500; stroke-width: 2; }
        .chart-lagna { fill: none; stroke: #ff6600; stroke-width: 3; }
        .chart-planet { font-size: 16px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; cursor: pointer; }
        .chart-sign { font-size: 12px; text-anchor: middle; fill: #cccccc; }
        .chart-tooltip { fill: white; stroke: #ffa500; stroke-width: 1; border-radius: 4px; }
        .tooltip-text { font-size: 11px; fill: #000; }
      </style>
    </defs>

    <!-- Background -->
    <rect width="${svgWidth}" height="${svgHeight}" fill="#0a0a14" />
  `

  // Draw 12 houses (diamond shape)
  for (let i = 0; i < 12; i++) {
    const p1 = points[i]
    const p2 = points[(i + 1) % 12]
    const isLagna = i === 0
    const classStr = isLagna ? 'chart-lagna' : 'chart-house'
    svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="${classStr}" />`
  }

  // Draw house numbers and signs
  for (let i = 0; i < 12; i++) {
    const mid = getMidpoint(points[i], points[(i + 1) % 12])
    const house = i + 1
    const sign = data.houses[house]?.sign || '?'
    
    svg += `<text x="${mid.x}" y="${mid.y - 10}" class="chart-sign">H${house}</text>`
    svg += `<text x="${mid.x}" y="${mid.y + 8}" class="chart-sign">${sign}</text>`
  }

  // Draw planets in houses
  const planetPositions = getPlanetPositions(data.planets, data.houses)
  Object.entries(planetPositions).forEach(([planetName, posInfo]) => {
    const pos = posInfo.position
    if (pos) {
      svg += `
        <circle cx="${pos.x}" cy="${pos.y}" r="6" fill="#1a1a2e" stroke="#ffa500" stroke-width="1" />
        <text x="${pos.x}" y="${pos.y}" class="chart-planet" data-planet="${planetName}" title="${planetName}">
          ${getPlanetSymbol(planetName)}
        </text>
      `
    }
  })

  svg += `</svg>`

  // Chart interpretation
  const lagna = data.lagna
  const summary = `
    <div class="chart-summary">
      <div class="chart-title">Vedic Chart - ${chartType}</div>
      <div class="chart-info">
        <strong>Lagna:</strong> ${lagna.sign} ${lagna.degree.toFixed(1)}° | ${lagna.nakshatra?.name} Pada ${lagna.nakshatra?.pada}<br/>
        <strong>Lagna Lord:</strong> ${lagna.lord}<br/>
        <strong>Strength:</strong> ${lagna.strength}
      </div>
    </div>
  `

  return svg + summary
}

export function renderD9Tabs(chart) {
  return `
    <div class="chart-tabs">
      <button class="chart-tab active" data-tab="d1" onclick="switchVedicChart(event, 'D1')">D1 Rasi</button>
      <button class="chart-tab" data-tab="d9" onclick="switchVedicChart(event, 'D9')">D9 Navamsha</button>
    </div>
    <div id="vedic-chart" class="chart-container">
      ${renderVedicChart(chart, 'D1')}
    </div>
  `
}

// ── HELPERS ────────────────────────────────────────────
function generateDiamondPoints(cx, cy, r) {
  const points = []
  const angles = [90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255]
  
  angles.forEach(angle => {
    const rad = (angle * Math.PI) / 180
    points.push({
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad)
    })
  })
  return points
}

function getMidpoint(p1, p2) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
}

function getPlanetPositions(planets, houses) {
  const positions = {}
  Object.entries(planets).forEach(([name, planet]) => {
    const house = planet.house || 1
    // Position based on house
    positions[name] = {
      planet,
      position: { x: 200 + Math.random() * 20, y: 200 + Math.random() * 20 }
    }
  })
  return positions
}

function getPlanetSymbol(name) {
  const symbols = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
  }
  return symbols[name] || name[0]
}
