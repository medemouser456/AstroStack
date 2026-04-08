import swe from 'swisseph'
import { NAKSHATRAS, HOUSE_LORDS, AYANAMSHA, normalizeAngle, getSign, getDegreeInSign } from './engine.js'

// ── KP ASTROLOGY CALCULATOR ────────────────────────────

const DASHA_YEARS = {
  Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7,
  Rahu:18, Jupiter:16, Saturn:19, Mercury:17
}

const DASHA_SEQUENCE = [
  'Ketu','Venus','Sun','Moon','Mars',
  'Rahu','Jupiter','Saturn','Mercury'
]

function getSubLord(longitude) {
  const norm = normalizeAngle(longitude)
  const nakIndex = Math.min(Math.floor(norm / 13.333333), 26)
  const nakStart = nakIndex * 13.333333
  const nakSpan = 13.333333
  const degInNak = norm - nakStart

  // Find starting lord for this nakshatra
  const startLordIndex = nakIndex % 9

  let subStart = 0
  for (let i = 0; i < 9; i++) {
    const lordIndex = (startLordIndex + i) % 9
    const lord = DASHA_SEQUENCE[lordIndex]
    const subSpan = (DASHA_YEARS[lord] / 120) * nakSpan
    const subEnd = subStart + subSpan
    if (degInNak >= subStart && degInNak < subEnd) {
      return lord
    }
    subStart = subEnd
  }
  return DASHA_SEQUENCE[startLordIndex]
}

function getSubSubLord(longitude) {
  const norm = normalizeAngle(longitude)
  const nakIndex = Math.min(Math.floor(norm / 13.333333), 26)
  const nakStart = nakIndex * 13.333333
  const nakSpan = 13.333333
  const degInNak = norm - nakStart
  const startLordIndex = nakIndex % 9

  let subStart = 0
  for (let i = 0; i < 9; i++) {
    const lordIndex = (startLordIndex + i) % 9
    const lord = DASHA_SEQUENCE[lordIndex]
    const subSpan = (DASHA_YEARS[lord] / 120) * nakSpan
    const subEnd = subStart + subSpan

    if (degInNak >= subStart && degInNak < subEnd) {
      // Now find sub-sub-lord within this sub
      const degInSub = degInNak - subStart
      let ssStart = 0
      for (let j = 0; j < 9; j++) {
        const ssLordIndex = (lordIndex + j) % 9
        const ssLord = DASHA_SEQUENCE[ssLordIndex]
        const ssSpan = (DASHA_YEARS[ssLord] / 120) * subSpan
        const ssEnd = ssStart + ssSpan
        if (degInSub >= ssStart && degInSub < ssEnd) {
          return ssLord
        }
        ssStart = ssEnd
      }
      return lord
    }
    subStart = subEnd
  }
  return DASHA_SEQUENCE[startLordIndex]
}

export function calculateKP(jd, lat, lng) {
  try {
    // KP Ayanamsha
    swe.swe_set_sid_mode(AYANAMSHA.KP, 0, 0)
    const kpAyanamsha = swe.swe_get_ayanamsa_ut(jd)

    // Houses with Placidus
    const housesData = swe.swe_houses(jd, lat, lng, 'P')

    // Cuspal sub-lords for all 12 houses
    const cuspalSubLords = {}
    for (let i = 1; i <= 12; i++) {
      const cuspRaw = (housesData.cusps ? housesData.cusps[i] : housesData.ascendant + (i-1)*30 || housesData.ascendant) - kpAyanamsha
      const cuspLong = normalizeAngle(cuspRaw)
      const sign = getSign(cuspLong)
      const nakIndex = Math.min(Math.floor(cuspLong / 13.333333), 26)
      const nak = NAKSHATRAS[nakIndex]
      const subLord = getSubLord(cuspLong)
      const subSubLord = getSubSubLord(cuspLong)

      cuspalSubLords[i] = {
        sign,
        degree: getDegreeInSign(cuspLong).toFixed(2),
        signLord: HOUSE_LORDS[sign],
        nakshatraLord: nak?.lord || '',
        subLord,
        subSubLord,
        nakshatra: nak?.name || '',
      }
    }

    // Moon details for ruling planets
    const moonResult = swe.swe_calc_ut(jd, 1, swe.SEFLG_SIDEREAL)
    const moonLong = normalizeAngle(moonResult.longitude - kpAyanamsha)
    const moonSign = getSign(moonLong)
    const moonNakIndex = Math.min(Math.floor(moonLong / 13.333333), 26)
    const moonNak = NAKSHATRAS[moonNakIndex]
    const moonSubLord = getSubLord(moonLong)

    // Lagna details
    const ascRaw = housesData.ascendant - kpAyanamsha
    const ascLong = normalizeAngle(ascRaw)
    const lagnaSign = getSign(ascLong)
    const lagnaNakIndex = Math.min(Math.floor(ascLong / 13.333333), 26)
    const lagnaNak = NAKSHATRAS[lagnaNakIndex]

    // Ruling planets
    const rulingPlanets = [
      { planet: HOUSE_LORDS[lagnaSign], reason: 'Lagna Sign Lord' },
      { planet: lagnaNak?.lord, reason: 'Lagna Star Lord' },
      { planet: HOUSE_LORDS[moonSign], reason: 'Moon Sign Lord' },
      { planet: moonNak?.lord, reason: 'Moon Star Lord' },
      { planet: moonSubLord, reason: 'Moon Sub Lord' },
    ].filter(rp => rp.planet)

    return {
      cuspalSubLords,
      rulingPlanets,
      moonDetails: {
        sign: moonSign,
        signLord: HOUSE_LORDS[moonSign],
        nakshatra: moonNak?.name,
        nakshatraLord: moonNak?.lord,
        subLord: moonSubLord,
      },
      kpAyanamsha: kpAyanamsha.toFixed(4),
    }
  } catch(e) {
    console.error('KP calculation error:', e)
    return { cuspalSubLords:{}, rulingPlanets:[], error: e.message }
  }
}