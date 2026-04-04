// ── BLESSED ASTRO CALCULATION ENGINE ──────────────────
// Powered by Swiss Ephemeris
// Calculates complete birth chart for all 11 astrology models

import swisseph as swe from 'swisseph'
import { calculateVedicChart } from './vedic.js'
import { calculateDasha } from './dasha.js'
import { detectYogas } from './yogas.js'
import { calculateNumerology } from './numerology.js'
import { calculateChinese } from './chinese.js'
import { calculateWestern } from './western.js'
import { calculateKP } from './kp.js'

// ── CONSTANTS ──────────────────────────────────────────
export const AYANAMSHA = {
  LAHIRI: 1,      // Standard Vedic — most used in India
  KP: 33,         // Krishnamurti Paddhati
  RAMAN: 3,       // B.V. Raman system
  TROPICAL: 0,    // Western astrology — no ayanamsha
}

export const PLANETS = {
  SUN: 0, MOON: 1, MARS: 4, MERCURY: 2,
  JUPITER: 5, VENUS: 3, SATURN: 6,
  RAHU: 11, KETU: 11, // Ketu = Rahu + 180°
  URANUS: 7, NEPTUNE: 8, PLUTO: 9 // Western only
}

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

export const SIGNS_HINDI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क',
  'सिंह', 'कन्या', 'तुला', 'वृश्चिक',
  'धनु', 'मकर', 'कुम्भ', 'मीन'
]

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', degrees: [0, 13.333] },
  { name: 'Bharani', lord: 'Venus', degrees: [13.333, 26.666] },
  { name: 'Krittika', lord: 'Sun', degrees: [26.666, 40] },
  { name: 'Rohini', lord: 'Moon', degrees: [40, 53.333] },
  { name: 'Mrigashira', lord: 'Mars', degrees: [53.333, 66.666] },
  { name: 'Ardra', lord: 'Rahu', degrees: [66.666, 80] },
  { name: 'Punarvasu', lord: 'Jupiter', degrees: [80, 93.333] },
  { name: 'Pushya', lord: 'Saturn', degrees: [93.333, 106.666] },
  { name: 'Ashlesha', lord: 'Mercury', degrees: [106.666, 120] },
  { name: 'Magha', lord: 'Ketu', degrees: [120, 133.333] },
  { name: 'Purva Phalguni', lord: 'Venus', degrees: [133.333, 146.666] },
  { name: 'Uttara Phalguni', lord: 'Sun', degrees: [146.666, 160] },
  { name: 'Hasta', lord: 'Moon', degrees: [160, 173.333] },
  { name: 'Chitra', lord: 'Mars', degrees: [173.333, 186.666] },
  { name: 'Swati', lord: 'Rahu', degrees: [186.666, 200] },
  { name: 'Vishakha', lord: 'Jupiter', degrees: [200, 213.333] },
  { name: 'Anuradha', lord: 'Saturn', degrees: [213.333, 226.666] },
  { name: 'Jyeshtha', lord: 'Mercury', degrees: [226.666, 240] },
  { name: 'Moola', lord: 'Ketu', degrees: [240, 253.333] },
  { name: 'Purva Ashadha', lord: 'Venus', degrees: [253.333, 266.666] },
  { name: 'Uttara Ashadha', lord: 'Sun', degrees: [266.666, 280] },
  { name: 'Shravana', lord: 'Moon', degrees: [280, 293.333] },
  { name: 'Dhanishtha', lord: 'Mars', degrees: [293.333, 306.666] },
  { name: 'Shatabhisha', lord: 'Rahu', degrees: [306.666, 320] },
  { name: 'Purva Bhadra', lord: 'Jupiter', degrees: [320, 333.333] },
  { name: 'Uttara Bhadra', lord: 'Saturn', degrees: [333.333, 346.666] },
  { name: 'Revati', lord: 'Mercury', degrees: [346.666, 360] },
]

export const PLANET_NAMES = {
  0: 'Sun', 1: 'Moon', 2: 'Mercury', 3: 'Venus',
  4: 'Mars', 5: 'Jupiter', 6: 'Saturn',
  7: 'Uranus', 8: 'Neptune', 9: 'Pluto',
  11: 'Rahu'
}

export const HOUSE_LORDS = {
  'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
  'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
  'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
  'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
}

export const EXALTATION = {
  'Sun': { sign: 'Aries', degree: 10 },
  'Moon': { sign: 'Taurus', degree: 3 },
  'Mars': { sign: 'Capricorn', degree: 28 },
  'Mercury': { sign: 'Virgo', degree: 15 },
  'Jupiter': { sign: 'Cancer', degree: 5 },
  'Venus': { sign: 'Pisces', degree: 27 },
  'Saturn': { sign: 'Libra', degree: 20 },
  'Rahu': { sign: 'Gemini', degree: 0 },
  'Ketu': { sign: 'Sagittarius', degree: 0 },
}

export const DEBILITATION = {
  'Sun': 'Libra', 'Moon': 'Scorpio', 'Mars': 'Cancer',
  'Mercury': 'Pisces', 'Jupiter': 'Capricorn', 'Venus': 'Virgo',
  'Saturn': 'Aries', 'Rahu': 'Sagittarius', 'Ketu': 'Gemini'
}

export const OWN_SIGNS = {
  'Sun': ['Leo'],
  'Moon': ['Cancer'],
  'Mars': ['Aries', 'Scorpio'],
  'Mercury': ['Gemini', 'Virgo'],
  'Jupiter': ['Sagittarius', 'Pisces'],
  'Venus': ['Taurus', 'Libra'],
  'Saturn': ['Capricorn', 'Aquarius'],
}

// ── UTILITY FUNCTIONS ──────────────────────────────────
export function getSign(longitude) {
  return SIGNS[Math.floor(longitude / 30)]
}

export function getDegreeInSign(longitude) {
  return longitude % 30
}

export function getNakshatra(longitude) {
  const totalDegree = longitude % 360
  const nakshatraIndex = Math.floor(totalDegree / 13.333333)
  const nak = NAKSHATRAS[nakshatraIndex]
  const degreeInNak = totalDegree - (nakshatraIndex * 13.333333)
  const pada = Math.floor(degreeInNak / 3.333333) + 1
  return { ...nak, pada: Math.min(pada, 4), degreeInNak }
}

export function getPlanetStrength(planetName, sign) {
  if (EXALTATION[planetName]?.sign === sign) return 'Exalted'
  if (DEBILITATION[planetName] === sign) return 'Debilitated'
  if (OWN_SIGNS[planetName]?.includes(sign)) return 'Own Sign'

  // Friendly/Enemy signs
  const FRIENDS = {
    'Sun': ['Moon', 'Mars', 'Jupiter'],
    'Moon': ['Sun', 'Mercury'],
    'Mars': ['Sun', 'Moon', 'Jupiter'],
    'Mercury': ['Sun', 'Venus'],
    'Jupiter': ['Sun', 'Moon', 'Mars'],
    'Venus': ['Mercury', 'Saturn'],
    'Saturn': ['Mercury', 'Venus'],
  }

  const signLord = HOUSE_LORDS[sign]
  if (FRIENDS[planetName]?.includes(signLord)) return 'Friendly Sign'
  return 'Neutral/Enemy Sign'
}

// ── JULIAN DAY CONVERSION ──────────────────────────────
export function getJulianDay(dateStr, timeStr, timezone) {
  // Parse date and time
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, minute] = (timeStr || '12:00').split(':').map(Number)

  // Convert local time to UTC
  const timezoneOffset = getTimezoneOffset(timezone)
  const utcHour = hour + minute / 60 - timezoneOffset

  // Swiss Ephemeris Julian Day
  const jd = swe.swe_julday(year, month, day, utcHour, swe.SE_GREG_CAL)
  return jd
}

function getTimezoneOffset(timezone) {
  // Common timezone offsets
  const offsets = {
    'Asia/Kolkata': 5.5,
    'Asia/Mumbai': 5.5,
    'America/New_York': -5,
    'America/Los_Angeles': -8,
    'Europe/London': 0,
    'Europe/Paris': 1,
    'Asia/Dubai': 4,
    'Asia/Singapore': 8,
    'Australia/Sydney': 10,
    'Asia/Tokyo': 9,
  }
  return offsets[timezone] || 5.5 // Default to IST
}

// ── GEOCODING ──────────────────────────────────────────
export async function getCoordinates(placeName) {
  // Use nominatim for geocoding (free)
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`
  )
  const data = await response.json()
  if (data && data[0]) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      timezone: await getTimezone(data[0].lat, data[0].lon)
    }
  }
  // Default to Mumbai if geocoding fails
  return { lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata' }
}

async function getTimezone(lat, lng) {
  // Simple timezone estimation based on longitude
  const offset = Math.round(lng / 15)
  const timezones = {
    5: 'Asia/Kolkata', // IST
    0: 'Europe/London',
    '-5': 'America/New_York',
    '-8': 'America/Los_Angeles',
    4: 'Asia/Dubai',
    8: 'Asia/Singapore',
    9: 'Asia/Tokyo',
  }
  return timezones[offset] || 'Asia/Kolkata'
}

// ── MAIN CALCULATION FUNCTION ──────────────────────────
export async function calculateFullChart(userDetails) {
  const { name, dob, tob, birthPlace, gender, currentCity } = userDetails

  try {
    // 1. Get coordinates
    const coords = await getCoordinates(birthPlace)

    // 2. Get Julian Day
    const jd = getJulianDay(dob, tob, coords.timezone)

    // 3. Set ephemeris path
    swe.swe_set_ephe_path('./node_modules/swisseph/ephe')

    // 4. Calculate all charts
    const vedicChart = calculateVedicChart(jd, coords.lat, coords.lng)
    const dashaData = calculateDasha(vedicChart.planets.moon, dob)
    const yogas = detectYogas(vedicChart)
    const numerology = calculateNumerology(name, dob)
    const chinese = calculateChinese(dob)
    const western = calculateWestern(jd, coords.lat, coords.lng)
    const kp = calculateKP(jd, coords.lat, coords.lng)

    // 5. Current transits
    const todayJD = getJulianDay(
      new Date().toISOString().split('T')[0],
      '12:00',
      'Asia/Kolkata'
    )
    const currentTransits = calculateVedicChart(todayJD, coords.lat, coords.lng)

    // 6. Compile complete chart
    const fullChart = {
      // Personal
      name, dob, tob, birthPlace, gender,
      coords,

      // Vedic
      vedic: vedicChart,
      dasha: dashaData,
      yogas,

      // Other systems
      western,
      kp,
      numerology,
      chinese,

      // Current state
      currentTransits: currentTransits.planets,
      calculatedAt: new Date().toISOString()
    }

    return { success: true, chart: fullChart }

  } catch (error) {
    console.error('Chart calculation error:', error)
    return { success: false, error: error.message }
  }
}

// ── FORMAT CHART FOR AI PROMPT ─────────────────────────
export function formatChartForAI(chart, model, domain, language) {
  const v = chart.vedic
  const d = chart.dasha

  return `
═══════════════════════════════════════════
BIRTH CHART DATA (Swiss Ephemeris Calculated)
═══════════════════════════════════════════
Name: ${chart.name}
Date of Birth: ${chart.dob}
Time of Birth: ${chart.tob || 'Unknown — using Sunrise time'}
Place of Birth: ${chart.birthPlace}
Coordinates: ${chart.coords.lat}°N, ${chart.coords.lng}°E
Gender: ${chart.gender}

LAGNA (ASCENDANT):
Sign: ${v.lagna.sign} | Degree: ${v.lagna.degree.toFixed(2)}°
Nakshatra: ${v.lagna.nakshatra.name} | Pada: ${v.lagna.nakshatra.pada}
Lagna Lord: ${v.lagna.lord} (placed in ${v.planets[v.lagna.lord.toLowerCase()]?.house}th house)

PLANETARY POSITIONS (Sidereal — Lahiri Ayanamsha):
${formatPlanets(v.planets)}

HOUSE SIGNS:
${formatHouses(v.houses)}

CURRENT DASHA PERIOD:
Mahadasha: ${d.mahadasha.planet} (${d.mahadasha.start} to ${d.mahadasha.end})
Antardasha: ${d.antardasha.planet} (${d.antardasha.start} to ${d.antardasha.end})
Pratyantardasha: ${d.pratyantardasha.planet} (${d.pratyantardasha.start} to ${d.pratyantardasha.end})

YOGAS DETECTED (${chart.yogas.positive.length} positive, ${chart.yogas.negative.length} challenging):
Positive: ${chart.yogas.positive.map(y => y.name).join(', ') || 'None detected'}
Challenging: ${chart.yogas.negative.map(y => y.name).join(', ') || 'None detected'}

CURRENT TRANSITS (Today):
${formatTransits(chart.currentTransits, v.planets)}

NUMEROLOGY:
Life Path: ${chart.numerology.lifePath}
Personal Year: ${chart.numerology.personalYear}
Destiny Number: ${chart.numerology.destinyNumber}

CHINESE ASTROLOGY:
Animal Sign: ${chart.chinese.animalSign}
Element: ${chart.chinese.element}
Current Year Impact: ${chart.chinese.currentYearImpact}

QUERY DOMAIN: ${domain.name} (${domain.house})
ASTROLOGY MODEL: ${model.name}
LANGUAGE: ${language === 'hi' ? 'Hindi (Devanagari)' : 'English'}
═══════════════════════════════════════════
`
}

function formatPlanets(planets) {
  return Object.entries(planets).map(([name, p]) => {
    const retrograde = p.isRetrograde ? ' (R)' : ''
    const combust = p.isCombust ? ' (Combust)' : ''
    return `${name.padEnd(10)}: ${p.sign.padEnd(14)} House ${p.house.toString().padEnd(3)} | ${p.degree.toFixed(2)}° | ${p.nakshatra.name} Pada ${p.nakshatra.pada} | ${p.strength}${retrograde}${combust}`
  }).join('\n')
}

function formatHouses(houses) {
  return Object.entries(houses).map(([num, h]) =>
    `House ${num.padEnd(2)}: ${h.sign} | Lord: ${HOUSE_LORDS[h.sign]}`
  ).join('\n')
}

function formatTransits(currentPlanets, natalPlanets) {
  return Object.entries(currentPlanets).map(([name, p]) => {
    const natalHouse = natalPlanets[name]?.house
    return `${name.padEnd(10)}: Currently in ${p.sign} (${p.house}th house from Lagna) — transiting ${natalHouse ? `natal ${name}'s house` : ''}`
  }).join('\n')
}