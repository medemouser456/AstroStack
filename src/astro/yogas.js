import { HOUSE_LORDS } from './engine.js'

// ── YOGA & DOSHA DETECTION ENGINE ─────────────────────
export function detectYogas(chart) {
  const positive = []
  const negative = []
  const doshas = []

  const planets = chart.planets
  const houses = chart.houses
  const lagna = chart.lagna

  // Helper functions
  function planetInHouse(planetName, houseNum) {
    return planets[planetName.toLowerCase()]?.house === houseNum
  }

  function houseLord(houseNum) {
    return HOUSE_LORDS[houses[houseNum]?.sign]
  }

  function lordHouse(planetName) {
    return planets[planetName.toLowerCase()]?.house
  }

  function planetsConjunct(p1, p2) {
    const h1 = planets[p1.toLowerCase()]?.house
    const h2 = planets[p2.toLowerCase()]?.house
    return h1 && h2 && h1 === h2
  }

  function inKendra(houseNum) {
    return [1, 4, 7, 10].includes(houseNum)
  }

  function inTrikona(houseNum) {
    return [1, 5, 9].includes(houseNum)
  }

  function isExalted(planetName) {
    return planets[planetName.toLowerCase()]?.strength === 'Exalted'
  }

  function isDebilitated(planetName) {
    return planets[planetName.toLowerCase()]?.strength === 'Debilitated'
  }

  function isInOwnSign(planetName) {
    return planets[planetName.toLowerCase()]?.strength === 'Own Sign'
  }

  // ── POSITIVE YOGAS ─────────────────────────────────

  // 1. GAJ KESARI YOGA — Jupiter in Kendra from Moon
  const moonHouse = lordHouse('Moon')
  const jupHouse = lordHouse('Jupiter')
  if (moonHouse && jupHouse) {
    const diff = Math.abs(jupHouse - moonHouse)
    if ([0, 3, 6, 9].includes(diff)) {
      positive.push({
        name: 'Gaj Kesari Yoga',
        description: 'Jupiter in Kendra from Moon — wisdom, fame, respected by society',
        planets: ['Jupiter', 'Moon'],
        strength: isExalted('Jupiter') ? 'Very Strong' : 'Moderate'
      })
    }
  }

  // 2. RAJ YOGA — Kendra + Trikona lord conjunction/exchange
  const kendraLords = [1, 4, 7, 10].map(h => houseLord(h))
  const trikonaLords = [1, 5, 9].map(h => houseLord(h))

  kendraLords.forEach(kl => {
    trikonaLords.forEach(tl => {
      if (kl && tl && kl !== tl) {
        if (planetsConjunct(kl, tl) ||
          (lordHouse(kl) === lordHouse(tl)) ||
          (lordHouse(kl) === planets[tl.toLowerCase()]?.house)) {
          positive.push({
            name: `Raj Yoga (${kl}-${tl})`,
            description: `Lords of Kendra and Trikona connected — authority, success, power`,
            planets: [kl, tl],
            strength: 'Strong'
          })
        }
      }
    })
  })

  // 3. DHANA YOGA — wealth lords connected
  const wealthLords = [2, 5, 9, 11].map(h => houseLord(h))
  let wealthConnections = 0
  for (let i = 0; i < wealthLords.length; i++) {
    for (let j = i + 1; j < wealthLords.length; j++) {
      if (wealthLords[i] && wealthLords[j] &&
        planetsConjunct(wealthLords[i], wealthLords[j])) {
        wealthConnections++
      }
    }
  }
  if (wealthConnections > 0) {
    positive.push({
      name: 'Dhana Yoga',
      description: 'Wealth house lords connected — financial prosperity',
      strength: wealthConnections >= 2 ? 'Very Strong' : 'Moderate'
    })
  }

  // 4. PANCH MAHAPURUSH YOGAS
  const mahapurushPlanets = [
    { planet: 'Mars', name: 'Ruchaka', quality: 'physical strength, courage, leadership' },
    { planet: 'Mercury', name: 'Bhadra', quality: 'intelligence, communication, business' },
    { planet: 'Jupiter', name: 'Hamsa', quality: 'wisdom, spirituality, good fortune' },
    { planet: 'Venus', name: 'Malavya', quality: 'beauty, luxury, artistic talent' },
    { planet: 'Saturn', name: 'Shasha', quality: 'discipline, authority, servant leadership' },
  ]

  mahapurushPlanets.forEach(mp => {
    if ((isExalted(mp.planet) || isInOwnSign(mp.planet)) &&
      inKendra(lordHouse(mp.planet))) {
      positive.push({
        name: `${mp.name} Yoga (Panch Mahapurush)`,
        description: `${mp.planet} powerful in Kendra — ${mp.quality}`,
        planets: [mp.planet],
        strength: isExalted(mp.planet) ? 'Very Strong' : 'Strong'
      })
    }
  })

  // 5. BUDHADITYA YOGA — Sun + Mercury together
  if (planetsConjunct('Sun', 'Mercury')) {
    positive.push({
      name: 'Budhaditya Yoga',
      description: 'Sun and Mercury together — sharp intellect, communication skills',
      planets: ['Sun', 'Mercury'],
      strength: isExalted('Sun') ? 'Very Strong' : 'Moderate'
    })
  }

  // 6. CHANDRA-MANGAL YOGA
  if (planetsConjunct('Moon', 'Mars')) {
    positive.push({
      name: 'Chandra-Mangal Yoga',
      description: 'Moon and Mars together — drive, wealth through effort, emotional strength',
      planets: ['Moon', 'Mars'],
      strength: 'Moderate'
    })
  }

  // 7. NEECHA BHANGA RAJ YOGA
  const debilitatedPlanets = Object.entries(planets)
    .filter(([_, p]) => p.strength === 'Debilitated')
  debilitatedPlanets.forEach(([name, p]) => {
    // Check cancellation conditions
    const debLord = HOUSE_LORDS[p.sign]
    if (inKendra(lordHouse(debLord)) || inKendra(p.house)) {
      positive.push({
        name: `Neecha Bhanga Raj Yoga (${p.name})`,
        description: `Debilitation of ${p.name} cancelled — rise after initial struggle`,
        planets: [p.name],
        strength: 'Strong'
      })
    }
  })

  // 8. VIPARITA RAJ YOGA
  const dusthanaLords = [6, 8, 12].map(h => houseLord(h))
  dusthanaLords.forEach(dl => {
    if (dl && [6, 8, 12].includes(lordHouse(dl))) {
      positive.push({
        name: 'Viparita Raj Yoga',
        description: 'Dusthana lord in dusthana — rise from adversity, turning challenges to victories',
        planets: [dl],
        strength: 'Moderate'
      })
    }
  })

  // ── CHALLENGING YOGAS ──────────────────────────────

  // 9. KAAL SARP YOGA
  const rahuHouse = lordHouse('Rahu')
  const ketuHouse = lordHouse('Ketu')
  if (rahuHouse && ketuHouse) {
    const allPlanetHouses = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
      .map(p => lordHouse(p))
    const rahuKetuMin = Math.min(rahuHouse, ketuHouse)
    const rahuKetuMax = Math.max(rahuHouse, ketuHouse)
    const allBetween = allPlanetHouses.every(h =>
      h >= rahuKetuMin && h <= rahuKetuMax
    )
    if (allBetween) {
      negative.push({
        name: 'Kaal Sarp Yoga',
        description: 'All planets between Rahu-Ketu — karmic intensity, obstacles followed by sudden rise',
        remedy: 'Kaal Sarp puja at Trimbakeshwar, offer milk to Shiva Linga'
      })
    }
  }

  // 10. SHAKAT YOGA — Jupiter in 6/8/12 from Moon
  if (moonHouse && jupHouse) {
    const diff = ((jupHouse - moonHouse) + 12) % 12
    if ([5, 7, 11].includes(diff)) {
      negative.push({
        name: 'Shakat Yoga',
        description: 'Jupiter in 6/8/12 from Moon — fluctuating fortune, wheel of ups and downs',
        remedy: 'Worship Jupiter on Thursdays, donate yellow items'
      })
    }
  }

  // 11. KEMDRUM YOGA — No planets in 2nd or 12th from Moon
  const moonH = lordHouse('Moon')
  const secondFromMoon = ((moonH + 0) % 12) + 1
  const twelfthFromMoon = ((moonH - 2 + 12) % 12) + 1
  const planetsAroundMoon = Object.values(planets)
    .filter(p => p.name !== 'Moon' && p.name !== 'Rahu' && p.name !== 'Ketu')
    .some(p => p.house === secondFromMoon || p.house === twelfthFromMoon)

  if (!planetsAroundMoon) {
    negative.push({
      name: 'Kemadruma Yoga',
      description: 'No planets flanking Moon — emotional isolation, struggles (check Navamsha for cancellation)',
      remedy: 'Strengthen Moon — wear Pearl, serve mother, keep water near bed'
    })
  }

  // ── DOSHAS ─────────────────────────────────────────

  // 12. MANGAL DOSHA
  const marsHouse = lordHouse('Mars')
  if ([1, 2, 4, 7, 8, 12].includes(marsHouse)) {
    doshas.push({
      name: 'Mangal Dosha',
      house: marsHouse,
      description: `Mars in ${marsHouse}th house — affects marriage harmony`,
      severity: marsHouse === 7 ? 'High' : marsHouse === 8 ? 'High' : 'Moderate',
      remedy: 'Perform Mangal Dosha Shanti puja, marry a Manglik partner, or marry after 28 years of age'
    })
  }

  // 13. SADESATI — Saturn transiting over Moon sign
  // (Simplified — would need current Saturn position for exact)
  doshas.push({
    name: 'Sadesati Check',
    description: 'Requires current Saturn transit data — calculated separately',
    remedy: 'If active: Shani Chalisa every Saturday, donate mustard oil'
  })

  // 14. GURU CHANDAL YOGA — Jupiter + Rahu together
  if (planetsConjunct('Jupiter', 'Rahu')) {
    negative.push({
      name: 'Guru Chandal Yoga',
      description: 'Jupiter and Rahu together — wisdom in unorthodox ways, unconventional beliefs',
      remedy: 'Worship Vishnu, avoid shortcuts in life, respect teachers'
    })
  }

  // 15. ANGARAK YOGA — Mars + Rahu together
  if (planetsConjunct('Mars', 'Rahu')) {
    negative.push({
      name: 'Angarak Yoga',
      description: 'Mars and Rahu together — explosive energy, accidents possible, aggressive tendencies',
      remedy: 'Hanuman Chalisa daily, avoid anger, donate red lentils on Tuesday'
    })
  }

  return { positive, negative, doshas }
}