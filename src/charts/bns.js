// ── BNS JUPITER CHART ──────────────────────────────
export function renderBNSJupiterChart(chart) {
  if (!chart || !chart.vedic) return '<div class="chart-error">BNS chart data unavailable</div>'

  const vedic = chart.vedic
  const jupiter = vedic.planets.Jupiter
  const natalJupiterHouse = jupiter?.house || 9

  const svgWidth = 380
  const svgHeight = 380
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  const radius = 130

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" class="bns-chart">
    <defs>
      <style>
        .bns-circle { fill: none; stroke: #ffb700; stroke-width: 2; }
        .bns-segment { fill: none; stroke: #ffb700; stroke-width: 1; opacity: 0.5; }
        .bns-house { font-size: 12px; text-anchor: middle; fill: #ffb700; font-weight: bold; }
        .bns-planet { font-size: 16px; text-anchor: middle; dominant-baseline: middle; fill: #ffa500; }
        .bns-highlight { fill: none; stroke: #ff6600; stroke-width: 2.5; }
      </style>
    </defs>

    <!-- Background -->
    <rect width="${svgWidth}" height="${svgHeight}" fill="#0a0a14" />

    <!-- Outer circle -->
    <circle cx="${centerX}" cy="${centerY}" r="${radius}" class="bns-circle" />
  `

  // Draw 12 houses
  for (let h = 1; h <= 12; h++) {
    const angle = ((h - 1) * 30 - 90) * (Math.PI / 180)
    const nextAngle = (h * 30 - 90) * (Math.PI / 180)
    
    const x1 = centerX + radius * Math.cos(angle)
    const y1 = centerY + radius * Math.sin(angle)
    const x2 = centerX + radius * Math.cos(nextAngle)
    const y2 = centerY + radius * Math.sin(nextAngle)
    
    svg += `<line x1="${centerX}" y1="${centerY}" x2="${x1}" y2="${y1}" class="bns-segment" />`

    // House label
    const midAngle = angle + 15 * (Math.PI / 180)
    const labelX = centerX + (radius - 30) * Math.cos(midAngle)
    const labelY = centerY + (radius - 30) * Math.sin(midAngle)
    
    const highlight = h === natalJupiterHouse ? ' style="fill: #ff6600; font-weight: bold;" ' : ''
    svg += `<text x="${labelX}" y="${labelY}" class="bns-house" ${highlight}>H${h}</text>`
  }

  // Highlight natal Jupiter house
  const natalAngle = ((natalJupiterHouse - 1) * 30 - 90) * (Math.PI / 180)
  const natalNextAngle = (natalJupiterHouse * 30 - 90) * (Math.PI / 180)
  
  const nx1 = centerX + radius * Math.cos(natalAngle)
  const ny1 = centerY + radius * Math.sin(natalAngle)
  const nx2 = centerX + radius * Math.cos(natalNextAngle)
  const ny2 = centerY + radius * Math.sin(natalNextAngle)
  
  svg += `<line x1="${centerX}" y1="${centerY}" x2="${nx1}" y2="${ny1}" class="bns-highlight" />`
  svg += `<arc cx="${centerX}" cy="${centerY}" r="${radius}" style="fill: none; stroke: #ff6600; stroke-width: 2.5;" />`

  svg += `</svg>`

  // Jupiter transit table
  let html = svg + `
    <div class="chart-summary">
      <div class="chart-title">BNS - Jupiter Transits</div>
      <p style="font-size: 11px; color: #ffa500; margin: 8px 0;">
        <strong>Natal Jupiter:</strong> House ${natalJupiterHouse} (${jupiter?.sign})<br/>
        <strong>Current Transit:</strong> Calculating...
      </p>
    </div>

    <table class="bns-table" style="width: 100%; font-size: 11px; margin-top: 8px;">
      <tr style="background: #1a3a52; border-bottom: 2px solid #ffb700;">
        <th>House</th><th>Influence</th><th>Duration</th>
      </tr>
  `

  // Simple transit predictions
  for (let h = 1; h <= 12; h++) {
    const influence = getJupiterInfluence(h)
    html += `<tr><td>H${h}</td><td>${influence}</td><td>~13 months</td></tr>`
  }

  html += `</table>`

  return html
}

function getJupiterInfluence(house) {
  const influences = {
    1: 'Confidence & Expansion',
    2: 'Wealth & Stability',
    3: 'Communication',
    4: 'Home & Property',
    5: 'Creativity & Romance',
    6: 'Health Challenges',
    7: 'Marriage & Contracts',
    8: 'Inheritance & Transformation',
    9: 'Spirituality & Travel',
    10: 'Career Advancement',
    11: 'Gains & Networks',
    12: 'Spirituality & Seclusion'
  }
  return influences[house] || 'Neutral'
}
