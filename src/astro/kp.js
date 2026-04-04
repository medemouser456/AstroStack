import { calculateVedicChart } from './vedic.js'
import { AYANAMSHA, NAKSHATRAS, HOUSE_LORDS } from './engine.js'
import swisseph as swe from 'swisseph'

// ── KP ASTROLOGY CALCULATOR ────────────────────────────
// Krishnamurti Paddhati — Sub-lord theory

// KP Sub-lord table — each nakshatra divided into 9 sub-lords
// proportional to Vimshottari dasha years
const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
}

const TOTAL_YEARS = 120

// Each nakshatra = 13°20' = 800'
// Sub-divisions proportional to dasha years
function getSubLordTable() {
  const subLords = []
  const nakshatraSequence = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
    'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ]

  NAKSHATRAS.forEach((nak, nakIndex) => {
    const nakStart = nakIndex * (800 / 60) // in degrees
    const lordIndex = nakIndex % 9
    let subStart = nakStart
    const nakSpan = 13.333333

    for (let i = 0; i < 9; i++) {
      const subIndex = (lordIndex + i) % 9
      const subLord = nakshatraSequence[subIndex]
      const subSpan = (DASHA_YEARS[subLord] / TOTAL_YEARS) * nakSpan
      const subEnd = subStart + subSpan

      subLords.push({
        nakshatra: nak.name,
        nakshatraLord: nak.lord,
        subLord,
        startDegree: subStart,
        endDegree: subEnd,
      })

      subStart = subEnd
    }
  })

  return subLords
}

function getSubLord(longitude) {
  const subLordTable = getSubLordTable()
  const normalizedLong = longitude % 360
  const entry = subLordTable.find(sl =>
    normalizedLong >= sl.startDegree && normalizedLong < sl.endDegree
  )
  return entry?.subLord || 'Unknown'
}

export function calculateKP(jd, lat, lng) {
  // KP uses its own ayanamsha (slightly different from Lahiri)
  swe.swe_set_sid_mode(AYANAMSHA.KP, 0, 0)

  const kpAyanamsha = swe.swe_get_ayanamsa_ut(jd)

  // Calculate houses with Placidus (KP standard)
  const houses = swe.swe_houses(jd, lat, lng, 'P')

  // Cuspal sub-lords for all 12 houses
  const cuspalSubLords = {}
  for (let i = 0; i < 12; i++) {
    const cuspLongitude = houses.cusps[i + 1] - kpAyanamsha
    const normalizedCusp = ((cuspLongitude % 360) + 360) % 360
    const sign = Math.floor(normalizedCusp / 30)
    const nakshatra = NAKSHATRAS[Math.floor(normalizedCusp / 13.333333)]
    const subLord = getSubLord(normalizedCusp)

    cuspalSubLords[i + 1] = {
      sign: ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
             'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][sign],
      degree: normalizedCusp % 30,
      nakshatra: nakshatra?.name,
      nakshatraLord: nakshatra?.lord,
      subLord,
      signLord: HOUSE_LORDS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
        'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][sign]]
    }
  }

  // Ruling planets at this moment
  const ascendant = houses.ascendant - kpAyanamsha
  const normalizedAsc = ((ascendant % 360) + 360) % 360
  const lagnaSign = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
    'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][Math.floor(normalizedAsc / 30)]
  const lagnaLord = HOUSE_LORDS[lagnaSign]
  const lagnaNak = NAKSHATRAS[Math.floor(normalizedAsc / 13.333333)]

  // Moon details for KP
  const moonResult = swe.swe_calc_ut(jd, 1, swe.SEFLG_SIDEREAL)
  const moonLong = ((moonResult.longitude - kpAyanamsha) % 360 + 360) % 360
  const moonSign = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
    'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][Math.floor(moonLong / 30)]
  const moonSignLord = HOUSE_LORDS[moonSign]
  const moonNak = NAKSHATRAS[Math.floor(moonLong / 13.333333)]
  const moonSubLord = getSubLord(moonLong)

  const rulingPlanets = [
    { planet: lagnaLord, reason: 'Lagna Sign Lord' },
    { planet: lagnaNak?.lord, reason: 'Lagna Star Lord' },
    { planet: moonSignLord, reason: 'Moon Sign Lord' },
    { planet: moonNak?.lord, reason: 'Moon Star Lord' },
    { planet: moonSubLord, reason: 'Moon Sub Lord' },
  ].filter(rp => rp.planet)

  return {
    cuspalSubLords,
    rulingPlanets,
    moonDetails: {
      sign: moonSign,
      signLord: moonSignLord,
      nakshatra: moonNak?.name,
      nakshatraLord: moonNak?.lord,
      subLord: moonSubLord,
    },
    kpAyanamsha: kpAyanamsha.toFixed(4),
    note: 'KP uses Placidus houses and KP Ayanamsha for precise sub-lord calculations'
  }
}