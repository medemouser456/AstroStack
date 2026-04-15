import swe from 'swisseph'
import {
  SIGNS, NAKSHATRAS, HOUSE_LORDS, AYANAMSHA,
  normalizeAngle, getSign, getDegreeInSign,
  getNakshatra, getPlanetStrength
} from './engine.js'

export function calculateVedicChart(jd, lat, lng) {
  swe.swe_set_sid_mode(AYANAMSHA.LAHIRI, 0, 0)
  const ayanamsha = swe.swe_get_ayanamsa_ut(jd)

  // Houses with Placidus
  const housesData = swe.swe_houses(jd, lat, lng, 'P')
  const ascRaw = housesData.ascendant - ayanamsha
  const lagnaLongitude = normalizeAngle(ascRaw)
  const lagnaSign = getSign(lagnaLongitude)
  const lagnaNakshatra = getNakshatra(lagnaLongitude)

  // Sun position for combustion check
  const sunRaw = swe.swe_calc_ut(jd, 0, swe.SEFLG_SIDEREAL)
  const sunLongitude = normalizeAngle(sunRaw.longitude - ayanamsha)

  const planetList = [
    { id:0, name:'Sun' },
    { id:1, name:'Moon' },
    { id:4, name:'Mars' },
    { id:2, name:'Mercury' },
    { id:5, name:'Jupiter' },
    { id:3, name:'Venus' },
    { id:6, name:'Saturn' },
    { id:11, name:'Rahu' },
  ]

  const planetData = {}

  for (const planet of planetList) {
    const result = swe.swe_calc_ut(jd, planet.id, swe.SEFLG_SIDEREAL)
    const longitude = normalizeAngle(result.longitude - ayanamsha)
    const sign = getSign(longitude)
    const degreeInSign = getDegreeInSign(longitude)
    const nakshatra = getNakshatra(longitude)
    const house = getHouseNumber(longitude, lagnaLongitude)
    const strength = getPlanetStrength(planet.name, sign)
    const isRetrograde = result.longitudeSpeed < 0
    const distFromSun = Math.min(
      Math.abs(longitude - sunLongitude),
      360 - Math.abs(longitude - sunLongitude)
    )
    const isCombust = !['Sun','Moon','Rahu','Ketu'].includes(planet.name) && distFromSun < 8

    planetData[planet.name.toLowerCase()] = {
      name: planet.name,
      longitude,
      sign,
      degree: degreeInSign,
      nakshatra,
      house,
      strength,
      isRetrograde,
      isCombust,
      lord: HOUSE_LORDS[sign]
    }
  }

  // Ketu = Rahu + 180
  const rahuLong = planetData['rahu'].longitude
  const ketuLong = normalizeAngle(rahuLong + 180)
  planetData['ketu'] = {
    name: 'Ketu',
    longitude: ketuLong,
    sign: getSign(ketuLong),
    degree: getDegreeInSign(ketuLong),
    nakshatra: getNakshatra(ketuLong),
    house: getHouseNumber(ketuLong, lagnaLongitude),
    strength: getPlanetStrength('Ketu', getSign(ketuLong)),
    isRetrograde: true,
    isCombust: false,
    lord: HOUSE_LORDS[getSign(ketuLong)]
  }

  // 12 houses (equal house from lagna)
 // 12 equal houses from lagna
const houseData = {}
for (let i = 0; i < 12; i++) {
  // Each house starts exactly 30° from previous
  // House 1 starts at lagna longitude
  const houseCuspLong = normalizeAngle(lagnaLongitude + (i * 30))
  const houseSign = getSign(houseCuspLong)
  houseData[i + 1] = {
    sign: houseSign,
    degree: getDegreeInSign(houseCuspLong),
    lord: HOUSE_LORDS[houseSign],
    longitude: houseCuspLong
  }
}

  return {
    lagna: {
      sign: lagnaSign,
      degree: getDegreeInSign(lagnaLongitude),
      longitude: lagnaLongitude,
      nakshatra: lagnaNakshatra,
      lord: HOUSE_LORDS[lagnaSign]
    },
    planets: planetData,
    houses: houseData,
    ayanamsha: ayanamsha.toFixed(4)
  }
}

function getHouseNumber(planetLongitude, lagnaLongitude) {
  const diff = normalizeAngle(planetLongitude - lagnaLongitude)
  const house = diff === 0 ? 1 : Math.ceil(diff / 30)
  return house > 12 ? house - 12 : house
}