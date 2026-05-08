// ── WESTERN ASTROLOGY CHART ────────────────────────
export function renderWesternChart(chart) {
  if (!chart || !chart.western) return '<div class="chart-error">Western chart data unavailable</div>'

  const western = chart.western
  const vedic = chart.vedic

  const svgWidth = 400
  const svgHeight = 400
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  const radius = 140

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" class="western-chart">
    <defs>
      <style>
        .western-circle { fill: none; stroke: #6a4c93; stroke-width: 2; }
        .western-sign { font-size: 11px; text-anchor: middle; fill: #b19cd9; }
        .western-planet { font-size: 14px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; cursor: pointer; fill: #ffa500; }
        .western-degree { font-size: 9px; fill: #999; text-anchor: middle; }
      </style>
    </defs>

    <!-- Background -->
    <rect width="${svgWidth}" height="${svgHeight}" fill="#0a0a14" />

    <!-- Outer circle -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius}" class="western-circle" />

    <!-- Inner circle (aspect wheel) -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius - 30}" class="western-circle" />
  `

  // Draw zodiac signs (12 sections)
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

  signs.forEach((sign, i) => {
    const angle = ((i * 30) - 90) * (Math.PI / 180)
    const labelX = centerX + (radius + 20) * Math.cos(angle)
    const labelY = centerY + (radius + 20) * Math.sin(angle)
    
    svg += `<text x="${labelX}" y="${labelY}" class="western-sign">${signSymbols[i]}</text>`
  })

  // Draw planets
  Object.entries(vedic.planets).forEach(([name, planet]) => {
    const angle = ((planet.degree || 0) - 90) * (Math.PI / 180)
    const x = centerX + (radius - 15) * Math.cos(angle)
    const y = centerY + (radius - 15) * Math.sin(angle)
    
    svg += `
      <circle cx="${x}" cy="${y}" r="7" fill="#0a0a14" stroke="#ffa500" stroke-width="1" />
      <text x="${x}" y="${y}" class="western-planet" data-planet="${name}">${getPlanetSymbol(name)}</text>
    `
  })

  // Sun sign emphasis
  const sunSign = western.sun?.sign || 'Leo'
  const sunDegree = western.sun?.degree || 0
  
  svg += `</svg>`

  let html = svg + `
    <div class="chart-summary">
      <div class="chart-title">Western Astrology</div>
      <strong>Sun Sign:</strong> ${sunSign} ${sunDegree.toFixed(1)}°<br/>
      <strong>Moon Sign:</strong> ${western.moon?.sign || '—'}<br/>
      <strong>Rising Sign:</strong> ${western.rising?.sign || '—'}<br/>
      <div style="margin-top: 8px; font-size: 11px; color: #999;">
        The Sun represents core identity and life purpose.
      </div>
    </div>
  `

  return html
}

function getPlanetSymbol(name) {
  const symbols = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋'
  }
  return symbols[name] || name[0]
}
