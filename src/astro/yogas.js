import { HOUSE_LORDS } from './engine.js'

export function detectYogas(chart) {
  const positive = []
  const negative = []
  const doshas = []
  const planets = chart.planets
  const houses = chart.houses

  function lordHouse(p) { return planets[p.toLowerCase()]?.house }
  function houseLord(h) { return HOUSE_LORDS[houses[h]?.sign] }
  function planetsConjunct(p1, p2) {
    const h1 = lordHouse(p1)
    const h2 = lordHouse(p2)
    return h1 && h2 && h1 === h2
  }
  function inKendra(h) { return [1,4,7,10].includes(h) }
  function isExalted(p) { return planets[p.toLowerCase()]?.strength === 'Exalted' }
  function isOwn(p) { return planets[p.toLowerCase()]?.strength === 'Own Sign' }

  const moonH = lordHouse('Moon')
  const jupH = lordHouse('Jupiter')

  if (moonH && jupH) {
    const diff = ((jupH - moonH + 12) % 12)
    if ([0,3,6,9].includes(diff)) {
      positive.push({ name:'Gaj Kesari Yoga', description:'Jupiter in Kendra from Moon — wisdom, fame, prosperity', strength: isExalted('Jupiter') ? 'Very Strong' : 'Strong' })
    }
  }

  const kendraLords = [1,4,7,10].map(h => houseLord(h)).filter(Boolean)
  const trikonaLords = [1,5,9].map(h => houseLord(h)).filter(Boolean)
  kendraLords.forEach(kl => {
    trikonaLords.forEach(tl => {
      if (kl !== tl && planetsConjunct(kl, tl)) {
        positive.push({ name:`Raj Yoga (${kl}-${tl})`, description:'Kendra and Trikona lords conjunct — authority, success', strength:'Strong' })
      }
    })
  })

  ;[
    { planet:'Mars', name:'Ruchaka', quality:'courage, leadership' },
    { planet:'Mercury', name:'Bhadra', quality:'intelligence, business' },
    { planet:'Jupiter', name:'Hamsa', quality:'wisdom, good fortune' },
    { planet:'Venus', name:'Malavya', quality:'beauty, luxury, arts' },
    { planet:'Saturn', name:'Shasha', quality:'discipline, authority' },
  ].forEach(mp => {
    const h = lordHouse(mp.planet)
    if (h && inKendra(h) && (isExalted(mp.planet) || isOwn(mp.planet))) {
      positive.push({ name:`${mp.name} Yoga`, description:`${mp.planet} strong in Kendra — ${mp.quality}`, strength: isExalted(mp.planet) ? 'Very Strong' : 'Strong' })
    }
  })

  if (planetsConjunct('Sun', 'Mercury')) {
    positive.push({ name:'Budhaditya Yoga', description:'Sun and Mercury together — sharp intellect', strength:'Moderate' })
  }

  if (planetsConjunct('Moon', 'Mars')) {
    positive.push({ name:'Chandra-Mangal Yoga', description:'Moon and Mars — drive, wealth through effort', strength:'Moderate' })
  }

  const wealthLords = [2,5,9,11].map(h => houseLord(h)).filter(Boolean)
  let wealthCount = 0
  for (let i = 0; i < wealthLords.length; i++) {
    for (let j = i+1; j < wealthLords.length; j++) {
      if (wealthLords[i] !== wealthLords[j] && planetsConjunct(wealthLords[i], wealthLords[j])) wealthCount++
    }
  }
  if (wealthCount > 0) {
    positive.push({ name:'Dhana Yoga', description:'Wealth house lords connected — financial prosperity', strength: wealthCount >= 2 ? 'Very Strong' : 'Moderate' })
  }

  Object.values(planets).forEach(p => {
    if (p.strength === 'Debilitated') {
      const debLord = HOUSE_LORDS[p.sign]
      if (inKendra(lordHouse(debLord)) || inKendra(p.house)) {
        positive.push({ name:`Neecha Bhanga Raj Yoga (${p.name})`, description:`${p.name} debilitation cancelled — rise after struggle`, strength:'Strong' })
      }
    }
  })

  ;[6,8,12].forEach(h => {
    const lord = houseLord(h)
    if (lord && [6,8,12].includes(lordHouse(lord))) {
      positive.push({ name:`Viparita Raj Yoga`, description:'Dusthana lord in dusthana — rise from adversity', strength:'Moderate' })
    }
  })

  const rahuH = lordHouse('Rahu')
  const ketuH = lordHouse('Ketu')
  if (rahuH && ketuH) {
    const minH = Math.min(rahuH, ketuH)
    const maxH = Math.max(rahuH, ketuH)
    const allBetween = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn']
      .map(p => lordHouse(p)).filter(Boolean)
      .every(h => h >= minH && h <= maxH)
    if (allBetween) {
      negative.push({ name:'Kaal Sarp Yoga', description:'All planets between Rahu-Ketu — karmic intensity', remedy:'Kaal Sarp puja at Trimbakeshwar' })
    }
  }

  if (planetsConjunct('Jupiter', 'Rahu')) {
    negative.push({ name:'Guru Chandal Yoga', description:'Jupiter and Rahu conjunct — unconventional beliefs', remedy:'Worship Vishnu, respect teachers' })
  }

  if (planetsConjunct('Mars', 'Rahu')) {
    negative.push({ name:'Angarak Yoga', description:'Mars and Rahu conjunct — explosive energy', remedy:'Hanuman Chalisa daily' })
  }

  const marsH = lordHouse('Mars')
  if ([1,2,4,7,8,12].includes(marsH)) {
    doshas.push({ name:'Mangal Dosha', house:marsH, description:`Mars in ${marsH}th house — affects marital harmony`, severity:[7,8].includes(marsH)?'High':'Moderate', remedy:'Mangal Dosha Shanti puja' })
  }

  if (moonH && jupH) {
    const diff = ((jupH - moonH + 12) % 12)
    if ([5,7,11].includes(diff)) {
      negative.push({ name:'Shakat Yoga', description:'Jupiter in 6/8/12 from Moon — fluctuating fortune', remedy:'Worship Jupiter on Thursdays' })
    }
  }

  return { positive, negative, doshas }
}
