import swisseph as swe from 'swisseph'
import { SIGNS, PLANET_NAMES, getSign, getDegreeInSign, getNakshatra } from './engine.js'

// ── WESTERN ASTROLOGY CALCULATOR ──────────────────────
// Uses Tropical zodiac (no ayanamsha)

const ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8, nature: 'Intensifying' },
  { name: 'Opposition', angle: 180, orb: 8, nature: 'Challenging' },
  { name: 'Trine', angle: 120, orb: 8, nature: 'Harmonious' },
  { name: 'Square', angle: 90, orb: 6, nature: 'Challenging' },
  { name: 'Sextile', angle: 60, orb: 6, nature: 'Opportunistic' },
  { name: 'Quincunx', angle: 150, orb: 3, nature: 'Adjusting' },
  { name: 'Semi-sextile', angle: 30, orb: 2, nature: 'Minor positive' },
]

const SUN_SIGN_MEANINGS = {
  'Aries': 'Pioneer, bold, impulsive, passionate, self-motivated',
  'Taurus': 'Stable, sensual, patient, determined, materialistic',
  'Gemini': 'Curious, adaptable, communicative, witty, restless',
  'Cancer': 'Nurturing, intuitive, emotional, protective, home-loving',
  'Leo': 'Creative, generous, dramatic, confident, warm-hearted',
  'Virgo': 'Analytical, precise, helpful, health-conscious, perfectionist',
  'Libra': 'Diplomatic, aesthetic, fair, indecisive, relationship-focused',
  'Scorpio': 'Intense, secretive, transformative, passionate, magnetic',
  'Sagittarius': 'Optimistic, adventurous, philosophical, frank, freedom-loving',
  'Capricorn': 'Ambitious, disciplined, responsible, serious, practical',
  'Aquarius': 'Innovative, humanitarian, independent, eccentric, visionary',
  'Pisces': 'Empathetic, dreamy, spiritual, compassionate, artistic',
}

export function calculateWestern(jd, lat, lng) {
  // Western uses TROPICAL — no ayanamsha
  const planetList = [
    { id: 0, name: 'Sun' },
    { id: 1, name: 'Moon' },
    { id: 4, name: 'Mars' },
    { id: 2, name: 'Mercury' },
    { id: 5, name: 'Jupiter' },
    { id: 3, name: 'Venus' },
    { id: 6, name: 'Saturn' },
    { id: 7, name: 'Uranus' },
    { id: 8, name: 'Neptune' },
    { id: 9, name: 'Pluto' },
    { id: 11, name: 'NorthNode' },
  ]

  const planets = {}

  for (const planet of planetList) {
    const result = swe.swe_calc_ut(jd, planet.id, 0) // No sidereal flag = tropical
    const longitude = result.longitude % 360
    const sign = getSign(longitude)

    planets[planet.name.toLowerCase()] = {
      name: planet.name,
      longitude,
      sign,
      degree: getDegreeInSign(longitude),
      isRetrograde: result.longitudeSpeed < 0,
    }
  }

  // Ascendant (tropical)
  const houses = swe.swe_houses(jd, lat, lng, 'P')
  const ascendant = houses.ascendant % 360
  const risingSign = getSign(ascendant)

  // Calculate aspects between planets
  const aspects = calculateAspects(planets)

  // Current major transits (2026)
  const currentTransits = getCurrentTransits()

  return {
    sunSign: planets['sun'].sign,
    sunSignMeaning: SUN_SIGN_MEANINGS[planets['sun'].sign],
    moonSign: planets['moon'].sign,
    risingSign,
    planets,
    aspects,
    currentTransits,
    chartType: 'Tropical Western'
  }
}

function calculateAspects(planets) {
  const aspectList = []
  const planetNames = Object.keys(planets)

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const p1 = planets[planetNames[i]]
      const p2 = planets[planetNames[j]]
      const angle = Math.abs(p1.longitude - p2.longitude)
      const normalizedAngle = angle > 180 ? 360 - angle : angle

      for (const aspect of ASPECTS) {
        const diff = Math.abs(normalizedAngle - aspect.angle)
        if (diff <= aspect.orb) {
          aspectList.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect: aspect.name,
            orb: diff.toFixed(1),
            nature: aspect.nature,
            applying: p1.longitude < p2.longitude
          })
        }
      }
    }
  }
  return aspectList
}

function getCurrentTransits() {
  // 2026 major transits
  return [
    'Saturn in Pisces — dissolution of boundaries, spiritual lessons',
    'Jupiter in Cancer — expansion of home, family, emotional growth',
    'Pluto in Aquarius — transformation of society, technology revolution',
    'Uranus in Gemini — revolution in communication and transportation',
    'Neptune in Aries — spiritual awakening, new idealism',
  ]
}