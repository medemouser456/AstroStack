// ── VEDIC D1 & D9 CHART RENDERER ────────────────────
// North Indian Style Diamond Chart with proper house placement

const PLANET_SYMBOLS = {
  'sun': '☉', 'moon': '☽', 'mars': '♂', 'mercury': '☿',
  'jupiter': '♃', 'venus': '♀', 'saturn': '♄', 'rahu': '☊', 'ketu': '☋'
}

const SIGN_SYMBOLS = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
}

// ── MAIN EXPORT: D1/D9 Tabs ─────────────────────────
export function renderD9Tabs(chart) {
  if (!chart || !chart.vedic) {
    return `<div class="chart-panel chart-panel-empty">
      <div class="chart-message">📊 Enter birth details to view chart</div>
    </div>`
  }

  return `
    <div class="chart-panel">
      <div class="chart-panel-header">
        <div class="chart-panel-title">Vedic Astrology</div>
        <div class="chart-panel-actions">
          <button class="chart-btn" onclick="exportChartPDF('Vedic Astrology')" title="Export PDF">📥 PDF</button>
          <button class="chart-btn" onclick="exportChartPNG('Vedic Astrology')" title="Export PNG">🖼️ PNG</button>
        </div>
      </div>
      
      <div class="chart-tabs">
        <button class="chart-tab active" id="tab-d1" onclick="switchVedicChart('D1')">D1 Rasi Chart</button>
        <button class="chart-tab" id="tab-d9" onclick="switchVedicChart('D9')">D9 Navamsha</button>
      </div>
      
      <div id="vedic-chart-container" class="chart-container">
        ${renderVedicChart(chart, 'D1')}
      </div>
      
      ${renderChartSummary(chart.vedic)}
    </div>
  `
}

// ── RENDER SINGLE CHART (D1 or D9) ──────────────────
export function renderVedicChart(chart, chartType = 'D1') {
  const data = chartType === 'D1' ? chart.vedic : (chart.navamsha || chart.vedic)
  
  const svgWidth = 420
  const svgHeight = 420
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  const size = 180  // Half-width of diamond

  // North Indian Chart: Diamond with 12 triangular houses
  const houses = generateNorthIndianHouses(centerX, centerY, size)
  
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" class="vedic-chart" style="max-width:100%;height:auto;">
    <defs>
      <style>
        .house-line { stroke: #C8960C; stroke-width: 1.5; fill: none; }
        .house-line-lagna { stroke: #FF6600; stroke-width: 2.5; fill: none; }
        .house-fill { fill: rgba(255,102,0,0.03); }
        .house-fill-lagna { fill: rgba(255,102,0,0.08); }
        .sign-label { font-size: 11px; text-anchor: middle; fill: #C8960C; font-family: serif; }
        .house-num { font-size: 9px; text-anchor: middle; fill: #6B5B45; font-family: 'Inter', sans-serif; }
        .planet-text { font-size: 15px; text-anchor: middle; dominant-baseline: middle; cursor: pointer; }
        .planet-retro { font-size: 8px; fill: #FF6600; }
        .planet-combust { fill: #ff4444; }
        .chart-bg { fill: #0a0a14; }
        .tooltip-box { fill: #1E0A2E; stroke: #FF6600; stroke-width: 1; }
        .tooltip-text { font-size: 10px; fill: #FFF3E0; }
      </style>
    </defs>
    
    <rect width="${svgWidth}" height="${svgHeight}" class="chart-bg" rx="8" />
  `

  // Draw house fills (subtle background for lagna)
  houses.forEach((house, i) => {
    const isLagna = i === 0
    const pathData = house.corners.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
    svg += `<path d="${pathData}" class="${isLagna ? 'house-fill-lagna' : 'house-fill'}" />`
  })

  // Draw house boundaries
  houses.forEach((house, i) => {
    const isLagna = i === 0
    const corners = house.corners
    for (let j = 0; j < corners.length; j++) {
      const p1 = corners[j]
      const p2 = corners[(j + 1) % corners.length]
      svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="${isLagna ? 'house-line-lagna' : 'house-line'}" />`
    }
  })

  // Draw sign labels in each house
  houses.forEach((house, i) => {
    const houseNum = i + 1
    const signName = data.houses[houseNum]?.sign || ''
    const signSymbol = SIGN_SYMBOLS[signName] || signName.substring(0, 2)
    const labelPos = house.labelPoint
    
    svg += `<text x="${labelPos.x}" y="${labelPos.y - 6}" class="sign-label">${signSymbol}</text>`
    svg += `<text x="${labelPos.x}" y="${labelPos.y + 8}" class="house-num">${houseNum}</text>`
  })

  // Place planets in their houses
  const planetGroups = groupPlanetsByHouse(data.planets)
  
  houses.forEach((house, i) => {
    const houseNum = i + 1
    const planetsInHouse = planetGroups[houseNum] || []
    
    if (planetsInHouse.length > 0) {
      const positions = calculatePlanetPositionsInHouse(house, planetsInHouse.length)
      
      planetsInHouse.forEach((planet, idx) => {
        const pos = positions[idx]
        const symbol = PLANET_SYMBOLS[planet.name.toLowerCase()] || planet.name[0]
        const retroMark = planet.isRetrograde ? '<tspan class="planet-retro" dx="-8" dy="-10">℞</tspan>' : ''
        const combustClass = planet.isCombust ? 'planet-combust' : ''
        
        svg += `
          <g class="planet-group" data-planet="${planet.name}" style="cursor:pointer;">
            <text x="${pos.x}" y="${pos.y}" class="planet-text ${combustClass}">${symbol}${retroMark}</text>
          </g>
        `
      })
    }
  })

  svg += `</svg>`

  return svg
}

// ── CHART SUMMARY ─────────────────────────────────────
function renderChartSummary(vedic) {
  const lagna = vedic.lagna
  const planets = vedic.planets
  
  // Count planets in each house for summary
  const houseCounts = {}
  Object.values(planets).forEach(p => {
    houseCounts[p.house] = (houseCounts[p.house] || 0) + 1
  })
  
  return `
    <div class="chart-summary">
      <div class="chart-title">Chart Summary</div>
      <div class="chart-info">
        <strong>Lagna:</strong> ${lagna.sign} ${lagna.degree.toFixed(1)}° | ${lagna.nakshatra?.name || ''} Pada ${lagna.nakshatra?.pada || ''}<br/>
        <strong>Lagna Lord:</strong> ${lagna.lord || ''}<br/>
        <strong>Planets:</strong> ${Object.values(planets).map(p => p.name).join(', ')}<br/>
        <strong>Retrograde:</strong> ${Object.values(planets).filter(p => p.isRetrograde).map(p => p.name).join(', ') || 'None'}<br/>
        <strong>Combust:</strong> ${Object.values(planets).filter(p => p.isCombust).map(p => p.name).join(', ') || 'None'}
      </div>
    </div>
  `
}

// ── NORTH INDIAN HOUSE GEOMETRY ───────────────────────
function generateNorthIndianHouses(cx, cy, size) {
  // North Indian diamond: 4 main points (N, E, S, W)
  // Houses are triangular sections within the diamond
  
  const n = { x: cx, y: cy - size }      // Top (House 10/11/12 area)
  const e = { x: cx + size, y: cy }      // Right (House 1/2/3 area) 
  const s = { x: cx, y: cy + size }      // Bottom (House 4/5/6 area)
  const w = { x: cx - size, y: cy }      // Left (House 7/8/9 area)
  
  // Center point
  const c = { x: cx, y: cy }
  
  const houses = []
  
  // House 12: Top triangle (between N and NE edge)
  const ne1 = { x: cx + size * 0.33, y: cy - size * 0.67 }
  houses.push({
    corners: [n, ne1, c],
    labelPoint: { x: cx + size * 0.15, y: cy - size * 0.45 }
  })
  
  // House 1: Top-right center (Lagna) - TRIANGLE
  const ne2 = { x: cx + size * 0.67, y: cy - size * 0.33 }
  houses.push({
    corners: [ne1, ne2, c],
    labelPoint: { x: cx + size * 0.35, y: cy - size * 0.25 },
    isLagna: true
  })
  
  // House 2: Top-right edge
  houses.push({
    corners: [ne2, e, c],
    labelPoint: { x: cx + size * 0.55, y: cy - size * 0.1 }
  })
  
  // House 3: Right-top
  const se1 = { x: cx + size * 0.67, y: cy + size * 0.33 }
  houses.push({
    corners: [e, se1, c],
    labelPoint: { x: cx + size * 0.55, y: cy + size * 0.1 }
  })
  
  // House 4: Right-center
  const se2 = { x: cx + size * 0.33, y: cy + size * 0.67 }
  houses.push({
    corners: [se1, se2, c],
    labelPoint: { x: cx + size * 0.35, y: cy + size * 0.25 }
  })
  
  // House 5: Right-bottom
  houses.push({
    corners: [se2, s, c],
    labelPoint: { x: cx + size * 0.15, y: cy + size * 0.45 }
  })
  
  // House 6: Bottom-right
  const sw1 = { x: cx - size * 0.33, y: cy + size * 0.67 }
  houses.push({
    corners: [s, sw1, c],
    labelPoint: { x: cx - size * 0.15, y: cy + size * 0.45 }
  })
  
  // House 7: Bottom-center
  const sw2 = { x: cx - size * 0.67, y: cy + size * 0.33 }
  houses.push({
    corners: [sw1, sw2, c],
    labelPoint: { x: cx - size * 0.35, y: cy + size * 0.25 }
  })
  
  // House 8: Bottom-left
  houses.push({
    corners: [sw2, w, c],
    labelPoint: { x: cx - size * 0.55, y: cy + size * 0.1 }
  })
  
  // House 9: Left-bottom
  const nw1 = { x: cx - size * 0.67, y: cy - size * 0.33 }
  houses.push({
    corners: [w, nw1, c],
    labelPoint: { x: cx - size * 0.55, y: cy - size * 0.1 }
  })
  
  // House 10: Left-center
  const nw2 = { x: cx - size * 0.33, y: cy - size * 0.67 }
  houses.push({
    corners: [nw1, nw2, c],
    labelPoint: { x: cx - size * 0.35, y: cy - size * 0.25 }
  })
  
  // House 11: Left-top
  houses.push({
    corners: [nw2, n, c],
    labelPoint: { x: cx - size * 0.15, y: cy - size * 0.45 }
  })
  
  return houses
}

// ── PLANET POSITIONING ────────────────────────────────
function groupPlanetsByHouse(planets) {
  const groups = {}
  Object.values(planets).forEach(planet => {
    const house = planet.house || 1
    if (!groups[house]) groups[house] = []
    groups[house].push(planet)
  })
  return groups
}

function calculatePlanetPositionsInHouse(house, planetCount) {
  const corners = house.corners
  // Calculate centroid of house
  const centroid = {
    x: corners.reduce((sum, p) => sum + p.x, 0) / corners.length,
    y: corners.reduce((sum, p) => sum + p.y, 0) / corners.length
  }
  
  // Spread planets around centroid
  const positions = []
  
  if (planetCount === 1) {
    positions.push({ x: centroid.x, y: centroid.y })
  } else if (planetCount === 2) {
    positions.push(
      { x: centroid.x - 8, y: centroid.y - 5 },
      { x: centroid.x + 8, y: centroid.y + 5 }
    )
  } else if (planetCount === 3) {
    positions.push(
      { x: centroid.x, y: centroid.y - 10 },
      { x: centroid.x - 10, y: centroid.y + 8 },
      { x: centroid.x + 10, y: centroid.y + 8 }
    )
  } else {
    // 4+ planets - spread in small grid
    const cols = Math.ceil(Math.sqrt(planetCount))
    const rows = Math.ceil(planetCount / cols)
    const startX = centroid.x - (cols - 1) * 10
    const startY = centroid.y - (rows - 1) * 8
    
    for (let i = 0; i < planetCount; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      positions.push({
        x: startX + col * 20,
        y: startY + row * 16
      })
    }
  }
  
  return positions
}

// ── D9 NAVAMSHA CALCULATION ───────────────────────────
export function calculateNavamsha(vedicChart) {
  // Navamsha: Each sign divided into 9 parts (3°20' each)
  // Planet's navamsha position = (degree_in_sign / 3.333) → determines new sign
  
  const navamshaPlanets = {}
  const signOrder = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
  
  Object.entries(vedicChart.planets).forEach(([name, planet]) => {
    const signIndex = signOrder.indexOf(planet.sign)
    const degreeInSign = planet.degree
    
    // Navamsha division: 9 parts per sign
    const navamshaPart = Math.floor(degreeInSign / 3.333)
    
    // For movable signs (Aries, Cancer, Libra, Capricorn): navamsha starts from same sign
    // For fixed signs: starts from 5th sign
    // For dual signs: starts from 9th sign
    const signType = signIndex % 3  // 0=movable, 1=fixed, 2=dual
    let startNavamshaSign
    
    if (signType === 0) startNavamshaSign = signIndex  // Movable
    else if (signType === 1) startNavamshaSign = (signIndex + 4) % 12  // Fixed
    else startNavamshaSign = (signIndex + 8) % 12  // Dual
    
    const navamshaSignIndex = (startNavamshaSign + navamshaPart) % 12
    const navamshaSign = signOrder[navamshaSignIndex]
    
    navamshaPlanets[name] = {
      ...planet,
      sign: navamshaSign,
      navamshaSign: navamshaSign,
      originalSign: planet.sign,
      navamshaPart: navamshaPart + 1
    }
  })
  
  // Calculate navamsha lagna
  const lagnaSignIndex = signOrder.indexOf(vedicChart.lagna.sign)
  const lagnaDegree = vedicChart.lagna.degree
  const lagnaNavamshaPart = Math.floor(lagnaDegree / 3.333)
  const lagnaSignType = lagnaSignIndex % 3
  
  let lagnaStartNavamsha
  if (lagnaSignType === 0) lagnaStartNavamsha = lagnaSignIndex
  else if (lagnaSignType === 1) lagnaStartNavamsha = (lagnaSignIndex + 4) % 12
  else lagnaStartNavamsha = (lagnaSignIndex + 8) % 12
  
  const navamshaLagnaIndex = (lagnaStartNavamsha + lagnaNavamshaPart) % 12
  const navamshaLagnaSign = signOrder[navamshaLagnaIndex]
  
  return {
    lagna: {
      ...vedicChart.lagna,
      sign: navamshaLagnaSign,
      navamshaSign: navamshaLagnaSign,
      originalSign: vedicChart.lagna.sign
    },
    planets: navamshaPlanets,
    houses: generateNavamshaHouses(navamshaLagnaSign, signOrder),
    ayanamsha: vedicChart.ayanamsha
  }
}

function generateNavamshaHouses(lagnaSign, signOrder) {
  const lagnaIndex = signOrder.indexOf(lagnaSign)
  const houses = {}
  
  for (let i = 1; i <= 12; i++) {
    const signIndex = (lagnaIndex + i - 1) % 12
    const sign = signOrder[signIndex]
    houses[i] = {
      sign: sign,
      degree: 0,
      lord: getSignLord(sign),
      longitude: signIndex * 30
    }
  }
  
  return houses
}

function getSignLord(sign) {
  const lords = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
    'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
    'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
    'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
  }
  return lords[sign] || ''
}