import swe from 'swisseph'
import { SIGNS, getSign, getDegreeInSign, normalizeAngle } from './engine.js'

// ── WESTERN ASTROLOGY CALCULATOR ──────────────────────
// Uses Tropical zodiac — no ayanamsha

const ASPECTS = [
  { name:'Conjunction', angle:0, orb:8, nature:'Intensifying' },
  { name:'Opposition', angle:180, orb:8, nature:'Challenging' },
  { name:'Trine', angle:120, orb:8, nature:'Harmonious' },
  { name:'Square', angle:90, orb:6, nature:'Challenging' },
  { name:'Sextile', angle:60, orb:6, nature:'Opportunistic' },
  { name:'Quincunx', angle:150, orb:3, nature:'Adjusting' },
]

const SUN_SIGN_MEANINGS = {
  Aries:'Pioneer, bold, impulsive, passionate, self-motivated',
  Taurus:'Stable, sensual, patient, determined, materialistic',
  Gemini:'Curious, adaptable, communicative, witty, restless',
  Cancer:'Nurturing, intuitive, emotional, protective, home-loving',
  Leo:'Creative, generous, dramatic, confident, warm-hearted',
  Virgo:'Analytical, precise, helpful, health-conscious, perfectionist',
  Libra:'Diplomatic, aesthetic, fair, indecisive, relationship-focused',
  Scorpio:'Intense, secretive, transformative, passionate, magnetic',
  Sagittarius:'Optimistic, adventurous, philosophical, frank, freedom-loving',
  Capricorn:'Ambitious, disciplined, responsible, serious, practical',
  Aquarius:'Innovative, humanitarian, independent, eccentric, visionary',
  Pisces:'Empathetic, dreamy, spiritual, compassionate, artistic',
}

const RISING_SIGN_TRAITS = {
  Aries:'Projects confidence, direct approach, energetic first impression',
  Taurus:'Projects calmness, reliable, strong and stable presence',
  Gemini:'Projects curiosity, talkative, youthful and quick-minded',
  Cancer:'Projects nurturing warmth, sensitive, protective nature',
  Leo:'Projects charisma, commanding presence, natural authority',
  Virgo:'Projects competence, analytical, neat and detail-oriented',
  Libra:'Projects charm, diplomatic, naturally attractive and balanced',
  Scorpio:'Projects intensity, magnetic, mysterious and powerful',
  Sagittarius:'Projects optimism, adventurous, philosophical and open',
  Capricorn:'Projects seriousness, ambitious, disciplined and professional',
  Aquarius:'Projects uniqueness, unconventional, humanitarian ideals',
  Pisces:'Projects dreaminess, compassionate, artistic and spiritual',
}

export function calculateWestern(jd, lat, lng) {
  // Western = Tropical, no ayanamsha (flag = 0)
  const planetList = [
    { id:0, name:'Sun' },
    { id:1, name:'Moon' },
    { id:4, name:'Mars' },
    { id:2, name:'Mercury' },
    { id:5, name:'Jupiter' },
    { id:3, name:'Venus' },
    { id:6, name:'Saturn' },
    { id:7, name:'Uranus' },
    { id:8, name:'Neptune' },
    { id:9, name:'Pluto' },
  ]

  const planets = {}
  for (const planet of planetList) {
    const result = swe.swe_calc_ut(jd, planet.id, 0) // 0 = tropical
    const longitude = normalizeAngle(result.longitude)
    planets[planet.name.toLowerCase()] = {
      name: planet.name,
      longitude,
      sign: getSign(longitude),
      degree: getDegreeInSign(longitude),
      isRetrograde: result.longitudeSpeed < 0,
    }
  }

  // Ascendant tropical
  const housesData = swe.swe_houses(jd, lat, lng, 'P')
  const ascLongitude = normalizeAngle(housesData.ascendant)
  const risingSign = getSign(ascLongitude)

  // Calculate aspects
  const aspects = []
  const pNames = Object.keys(planets)
  for (let i = 0; i < pNames.length; i++) {
    for (let j = i+1; j < pNames.length; j++) {
      const p1 = planets[pNames[i]]
      const p2 = planets[pNames[j]]
      let angle = Math.abs(p1.longitude - p2.longitude)
      if (angle > 180) angle = 360 - angle
      for (const asp of ASPECTS) {
        const diff = Math.abs(angle - asp.angle)
        if (diff <= asp.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect: asp.name,
            orb: diff.toFixed(1),
            nature: asp.nature,
          })
        }
      }
    }
  }

  return {
    sunSign: planets.sun.sign,
    sunSignMeaning: SUN_SIGN_MEANINGS[planets.sun.sign] || '',
    moonSign: planets.moon.sign,
    risingSign,
    risingSignTrait: RISING_SIGN_TRAITS[risingSign] || '',
    planets,
    aspects,
    currentTransits: [
      'Saturn in Pisces — spiritual lessons, dissolving boundaries',
      'Jupiter in Cancer — expansion of home, family, emotional growth',
      'Pluto in Aquarius — transformation of society and technology',
      'Uranus in Gemini — revolution in communication',
      'Neptune in Aries — new spiritual idealism',
    ]
  }
}