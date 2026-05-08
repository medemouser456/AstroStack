// ── KP CHART RENDERER ──────────────────────────────────
export function renderKPChart(chart) {
  if (!chart || !chart.kp) return '<div class="chart-error">KP Chart data unavailable</div>'

  const kp = chart.kp
  const vedic = chart.vedic

  // Circular KP chart with cusps
  const svgWidth = 400
  const svgHeight = 400
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  const outerRadius = 140
  const innerRadius = 80

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" class="kp-chart">
    <defs>
      <style>
        .kp-circle { fill: none; stroke: #1a9fff; stroke-width: 2; }
        .kp-cusp { fill: none; stroke: #00ff88; stroke-width: 1.5; }
        .kp-planet { font-size: 14px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; cursor: pointer; fill: #ffa500; }
        .kp-label { font-size: 10px; text-anchor: middle; fill: #cccccc; }
      </style>
    </defs>

    <!-- Background -->
    <rect width="${svgWidth}" height="${svgHeight}" fill="#0a0a14" />

    <!-- Outer circle -->
    <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" class="kp-circle" />
    
    <!-- Inner circle -->
    <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" class="kp-circle" />
  `

  // Draw 12 cusps
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180)
    const x1 = centerX + innerRadius * Math.cos(angle)
    const y1 = centerY + innerRadius * Math.sin(angle)
    const x2 = centerX + outerRadius * Math.cos(angle)
    const y2 = centerY + outerRadius * Math.sin(angle)
    
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="kp-cusp" />`
    
    // House number
    const labelX = centerX + (outerRadius + 20) * Math.cos(angle)
    const labelY = centerY + (outerRadius + 20) * Math.sin(angle)
    svg += `<text x="${labelX}" y="${labelY}" class="kp-label">H${i + 1}</text>`
  }

  // Draw planets on circle
  Object.entries(vedic.planets).forEach(([name, planet]) => {
    const angle = ((planet.degree || 0) - 90) * (Math.PI / 180)
    const x = centerX + ((outerRadius + innerRadius) / 2) * Math.cos(angle)
    const y = centerY + ((outerRadius + innerRadius) / 2) * Math.sin(angle)
    
    svg += `<text x="${x}" y="${y}" class="kp-planet" data-planet="${name}" title="${name}">${getPlanetSymbol(name)}</text>`
  })

  svg += `</svg>`

  // KP Houses table with sub-lords
  let houseTable = `
    <div class="chart-summary">
      <div class="chart-title">KP Houses & Cuspal Sub-lords</div>
      <table class="kp-table">
        <tr style="background: #1a3a52; border-bottom: 2px solid #00ff88;">
          <th>House</th><th>Sign</th><th>Cusp Lord</th><th>Sub Lord</th><th>Significators</th>
        </tr>
  `

  for (let h = 1; h <= 12; h++) {
    const house = vedic.houses[h]
    houseTable += `
      <tr>
        <td>H${h}</td>
        <td>${house?.sign}</td>
        <td>${getHouseLord(h)}</td>
        <td>${getSubLord(h, kp)}</td>
        <td>${getSignificators(h, vedic).join(', ')}</td>
      </tr>
    `
  }

  houseTable += `</table>`

  // Ruling planets at current time
  const ruling = getRulingPlanets()
  let rulingTable = `
    <div style="margin-top: 16px;">
      <div class="chart-title" style="font-size: 14px;">Ruling Planets (Current)</div>
      <p style="font-size: 11px; color: #cccccc; margin: 4px 0;">
        <strong>Day Lord:</strong> ${ruling.dayLord} | 
        <strong>Moon Sign:</strong> ${ruling.moonSign} | 
        <strong>Time Lord:</strong> ${ruling.timeLord}
      </p>
    </div>
  `

  return svg + houseTable + rulingTable
}

// ── HELPERS ────────────────────────────────────────────
function getPlanetSymbol(name) {
  const symbols = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
  }
  return symbols[name] || name[0]
}

function getHouseLord(houseNum) {
  const lords = { 1: '♈', 2: '♉', 3: '♊', 4: '♋', 5: '♌', 6: '♍', 7: '♎', 8: '♏', 9: '♐', 10: '♑', 11: '♒', 12: '♓' }
  return lords[houseNum] || '?'
}

function getSubLord(houseNum, kp) {
  // Placeholder - in real implementation, calculate from KP system
  return 'Ca' // Caput or similar
}

function getSignificators(houseNum, vedic) {
  // Get planets that significate this house
  const planets = Object.values(vedic.planets)
    .filter(p => p.house === houseNum)
    .map(p => p.name.substring(0, 2))
  return planets.length > 0 ? planets : ['—']
}

function getRulingPlanets() {
  const now = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return {
    dayLord: days[now.getDay()],
    moonSign: '♌', // Placeholder
    timeLord: '♃'  // Placeholder
  }
}
