import swe from 'swisseph'

// ── CONSTANTS ──────────────────────────────────────────
export const AYANAMSHA = {
  LAHIRI: 1,
  KP: 33,
  RAMAN: 3,
  TROPICAL: 0,
}

export const SIGNS = [
  'Aries','Taurus','Gemini','Cancer',
  'Leo','Virgo','Libra','Scorpio',
  'Sagittarius','Capricorn','Aquarius','Pisces'
]

export const NAKSHATRAS = [
  { name:'Ashwini', lord:'Ketu' },
  { name:'Bharani', lord:'Venus' },
  { name:'Krittika', lord:'Sun' },
  { name:'Rohini', lord:'Moon' },
  { name:'Mrigashira', lord:'Mars' },
  { name:'Ardra', lord:'Rahu' },
  { name:'Punarvasu', lord:'Jupiter' },
  { name:'Pushya', lord:'Saturn' },
  { name:'Ashlesha', lord:'Mercury' },
  { name:'Magha', lord:'Ketu' },
  { name:'Purva Phalguni', lord:'Venus' },
  { name:'Uttara Phalguni', lord:'Sun' },
  { name:'Hasta', lord:'Moon' },
  { name:'Chitra', lord:'Mars' },
  { name:'Swati', lord:'Rahu' },
  { name:'Vishakha', lord:'Jupiter' },
  { name:'Anuradha', lord:'Saturn' },
  { name:'Jyeshtha', lord:'Mercury' },
  { name:'Moola', lord:'Ketu' },
  { name:'Purva Ashadha', lord:'Venus' },
  { name:'Uttara Ashadha', lord:'Sun' },
  { name:'Shravana', lord:'Moon' },
  { name:'Dhanishtha', lord:'Mars' },
  { name:'Shatabhisha', lord:'Rahu' },
  { name:'Purva Bhadra', lord:'Jupiter' },
  { name:'Uttara Bhadra', lord:'Saturn' },
  { name:'Revati', lord:'Mercury' },
]

export const HOUSE_LORDS = {
  'Aries':'Mars','Taurus':'Venus','Gemini':'Mercury',
  'Cancer':'Moon','Leo':'Sun','Virgo':'Mercury',
  'Libra':'Venus','Scorpio':'Mars','Sagittarius':'Jupiter',
  'Capricorn':'Saturn','Aquarius':'Saturn','Pisces':'Jupiter'
}

export const EXALTATION = {
  'Sun':{ sign:'Aries', degree:10 },
  'Moon':{ sign:'Taurus', degree:3 },
  'Mars':{ sign:'Capricorn', degree:28 },
  'Mercury':{ sign:'Virgo', degree:15 },
  'Jupiter':{ sign:'Cancer', degree:5 },
  'Venus':{ sign:'Pisces', degree:27 },
  'Saturn':{ sign:'Libra', degree:20 },
  'Rahu':{ sign:'Gemini', degree:0 },
  'Ketu':{ sign:'Sagittarius', degree:0 },
}

export const DEBILITATION = {
  'Sun':'Libra','Moon':'Scorpio','Mars':'Cancer',
  'Mercury':'Pisces','Jupiter':'Capricorn','Venus':'Virgo',
  'Saturn':'Aries','Rahu':'Sagittarius','Ketu':'Gemini'
}

export const OWN_SIGNS = {
  'Sun':['Leo'],
  'Moon':['Cancer'],
  'Mars':['Aries','Scorpio'],
  'Mercury':['Gemini','Virgo'],
  'Jupiter':['Sagittarius','Pisces'],
  'Venus':['Taurus','Libra'],
  'Saturn':['Capricorn','Aquarius'],
}

// ── UTILITY FUNCTIONS ──────────────────────────────────
export function normalizeAngle(angle) {
  while (angle < 0) angle += 360
  while (angle >= 360) angle -= 360
  return angle
}

export function getSign(longitude) {
  return SIGNS[Math.floor(normalizeAngle(longitude) / 30)]
}

export function getDegreeInSign(longitude) {
  return normalizeAngle(longitude) % 30
}

export function getNakshatra(longitude) {
  const totalDegree = normalizeAngle(longitude)
  const nakshatraIndex = Math.min(Math.floor(totalDegree / 13.333333), 26)
  const nak = NAKSHATRAS[nakshatraIndex]
  const degreeInNak = totalDegree - (nakshatraIndex * 13.333333)
  const pada = Math.min(Math.floor(degreeInNak / 3.333333) + 1, 4)
  return { ...nak, pada, degreeInNak }
}

export function getPlanetStrength(planetName, sign) {
  if (EXALTATION[planetName]?.sign === sign) return 'Exalted'
  if (DEBILITATION[planetName] === sign) return 'Debilitated'
  if (OWN_SIGNS[planetName]?.includes(sign)) return 'Own Sign'
  return 'Neutral'
}

export function getTimezoneOffset(timezone) {
  const offsets = {
    'Asia/Kolkata': 5.5, 'Asia/Mumbai': 5.5,
    'America/New_York': -5, 'America/Los_Angeles': -8,
    'Europe/London': 0, 'Europe/Paris': 1,
    'Asia/Dubai': 4, 'Asia/Singapore': 8,
    'Australia/Sydney': 10, 'Asia/Tokyo': 9,
  }
  return offsets[timezone] || 5.5
}

export function getJulianDay(dateStr, timeStr, timezoneOffset) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const timeParts = (timeStr || '12:00').split(':').map(Number)
  const hour = timeParts[0] || 12
  const minute = timeParts[1] || 0
  const second = timeParts[2] || 0

  // Exact UTC conversion including seconds
  const localHour = hour + minute / 60 + second / 3600
  const utcHour = localHour - timezoneOffset

  // Handle day rollover
  let adjustedDay = day
  let adjustedMonth = month
  let adjustedYear = year
  let adjustedHour = utcHour

  if (adjustedHour < 0) {
    adjustedHour += 24
    adjustedDay -= 1
    if (adjustedDay < 1) {
      adjustedMonth -= 1
      if (adjustedMonth < 1) {
        adjustedMonth = 12
        adjustedYear -= 1
      }
      const daysInMonth = new Date(adjustedYear, adjustedMonth, 0).getDate()
      adjustedDay = daysInMonth
    }
  } else if (adjustedHour >= 24) {
    adjustedHour -= 24
    adjustedDay += 1
  }

  console.log(`Julian Day calc: ${adjustedYear}-${adjustedMonth}-${adjustedDay} ${adjustedHour.toFixed(4)} UTC`)
  return swe.swe_julday(adjustedYear, adjustedMonth, adjustedDay, adjustedHour, swe.SE_GREG_CAL)
}
export async function getCoordinates(placeName) {
  try {
    // Get coordinates from Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'BlessedAstro/1.0' } }
    )
    const data = await response.json()

    if (data && data[0]) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)

      // Get exact timezone using geo-tz
      let timezoneOffset = 5.5 // default IST
      try {
        const { find } = await import('geo-tz')
        const timezones = find(lat, lng)
        if (timezones && timezones[0]) {
          // Get current UTC offset for this timezone
          const tz = timezones[0]
          const now = new Date()
          const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
          const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }))
          timezoneOffset = (tzDate - utcDate) / (1000 * 60 * 60)
          console.log(`Timezone: ${tz}, Offset: ${timezoneOffset}`)
        }
      } catch(tzError) {
        // Fallback to longitude-based estimate
        timezoneOffset = Math.round(lng / 15 * 2) / 2
        // Special case for India
        if (lng >= 68 && lng <= 97) timezoneOffset = 5.5
        console.log('geo-tz fallback, offset:', timezoneOffset)
      }

      return { lat, lng, timezoneOffset }
    }
  } catch(e) {
    console.error('Geocoding error:', e)
  }

  // Default Mumbai
  return { lat: 19.0760, lng: 72.8777, timezoneOffset: 5.5 }
}

// ── FORMAT CHART FOR AI ────────────────────────────────
export function formatChartForAI(chart, model, domain, language) {
  if (!chart) return 'No birth chart available.'
  const v = chart.vedic
  const d = chart.dasha
  if (!v || !d) return 'Chart calculation incomplete.'

  const planetLines = Object.entries(v.planets).map(([name, p]) => {
    const retro = p.isRetrograde ? ' (R)' : ''
    const combust = p.isCombust ? ' (Combust)' : ''
    return `  ${p.name.padEnd(10)}: ${p.sign.padEnd(14)} House ${String(p.house).padEnd(3)} | ${p.degree.toFixed(2)}° | ${p.nakshatra?.name || ''} Pada ${p.nakshatra?.pada || ''} | ${p.strength}${retro}${combust}`
  }).join('\n')

  const houseLines = Object.entries(v.houses).map(([num, h]) =>
    `  House ${num.padEnd(2)}: ${h.sign} (Lord: ${h.lord})`
  ).join('\n')

  const yogaList = chart.yogas?.positive?.map(y => `  ✦ ${y.name} — ${y.description}`).join('\n') || '  None detected'
  const doshaList = chart.yogas?.doshas?.map(d => `  ⚠ ${d.name} — ${d.description}`).join('\n') || '  None detected'

  return `
═══════════════════════════════════════════
BIRTH CHART (Swiss Ephemeris — Lahiri Ayanamsha)
═══════════════════════════════════════════
Name    : ${chart.name}
DOB     : ${chart.dob}
TOB     : ${chart.tob || 'Unknown'}
Place   : ${chart.birthPlace}
Gender  : ${chart.gender}

LAGNA (ASCENDANT):
  Sign      : ${v.lagna.sign} ${v.lagna.degree.toFixed(2)}°
  Nakshatra : ${v.lagna.nakshatra?.name} Pada ${v.lagna.nakshatra?.pada}
  Lagna Lord: ${v.lagna.lord}

PLANETARY POSITIONS:
${planetLines}

HOUSE SIGNS:
${houseLines}

CURRENT DASHA:
  Mahadasha     : ${d.mahadasha?.planet} (${d.mahadasha?.start} to ${d.mahadasha?.end})
  Antardasha    : ${d.antardasha?.planet} (${d.antardasha?.start} to ${d.antardasha?.end})
  Pratyantardasha: ${d.pratyantardasha?.planet || 'Calculating...'}

YOGAS DETECTED:
${yogaList}

DOSHAS:
${doshaList}

NUMEROLOGY:
  Life Path     : ${chart.numerology?.lifePath}
  Personal Year : ${chart.numerology?.personalYear}
  Lucky Numbers : ${chart.numerology?.luckyNumbers?.join(', ')}

CHINESE ASTROLOGY:
  Animal Sign   : ${chart.chinese?.animalSign}
  Element       : ${chart.chinese?.element}
  2026 Impact   : ${chart.chinese?.currentYearImpact}

QUERY DOMAIN : ${domain?.name} (${domain?.house})
MODEL        : ${model?.name}
LANGUAGE     : ${language === 'hi' ? 'Hindi' : 'English'}
═══════════════════════════════════════════
`
}

// ── MAIN CALCULATION FUNCTION ──────────────────────────
export async function calculateFullChart(userDetails) {
  const { name, dob, tob, birthPlace, gender } = userDetails
  try {
    const { calculateVedicChart } = await import('./vedic.js')
    const { calculateDasha } = await import('./dasha.js')
    const { detectYogas } = await import('./yogas.js')
    const { calculateNumerology } = await import('./numerology.js')
    const { calculateChinese } = await import('./chinese.js')
    const { calculateWestern } = await import('./western.js')
    const { calculateKP } = await import('./kp.js')

    const coords = await getCoordinates(birthPlace)
    swe.swe_set_ephe_path('./node_modules/swisseph/ephe')

    const jd = getJulianDay(dob, tob, coords.timezoneOffset)
    const vedicChart = calculateVedicChart(jd, coords.lat, coords.lng)
    const dashaData = calculateDasha(vedicChart.planets.moon, dob)
    const yogas = detectYogas(vedicChart)
    const numerology = calculateNumerology(name, dob)
    const chinese = calculateChinese(dob)
    const western = calculateWestern(jd, coords.lat, coords.lng)
    const kp = calculateKP(jd, coords.lat, coords.lng)

    const todayJD = getJulianDay(
      new Date().toISOString().split('T')[0],
      '12:00', coords.timezoneOffset
    )
    const currentTransits = calculateVedicChart(todayJD, coords.lat, coords.lng)

    return {
      success: true,
      chart: {
        name, dob, tob, birthPlace, gender, coords,
        vedic: vedicChart,
        dasha: dashaData,
        yogas,
        western,
        kp,
        numerology,
        chinese,
        currentTransits: currentTransits.planets,
        calculatedAt: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Chart error:', error)
    return { success: false, error: error.message }
  }
}