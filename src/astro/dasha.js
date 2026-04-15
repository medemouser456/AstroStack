// ── VIMSHOTTARI DASHA CALCULATOR ──────────────────────

const DASHA_SEQUENCE = [
  { planet:'Ketu', years:7 },
  { planet:'Venus', years:20 },
  { planet:'Sun', years:6 },
  { planet:'Moon', years:10 },
  { planet:'Mars', years:7 },
  { planet:'Rahu', years:18 },
  { planet:'Jupiter', years:16 },
  { planet:'Saturn', years:19 },
  { planet:'Mercury', years:17 },
]

const NAKSHATRA_LORDS = {
  'Ashwini':'Ketu','Bharani':'Venus','Krittika':'Sun',
  'Rohini':'Moon','Mrigashira':'Mars','Ardra':'Rahu',
  'Punarvasu':'Jupiter','Pushya':'Saturn','Ashlesha':'Mercury',
  'Magha':'Ketu','Purva Phalguni':'Venus','Uttara Phalguni':'Sun',
  'Hasta':'Moon','Chitra':'Mars','Swati':'Rahu',
  'Vishakha':'Jupiter','Anuradha':'Saturn','Jyeshtha':'Mercury',
  'Moola':'Ketu','Purva Ashadha':'Venus','Uttara Ashadha':'Sun',
  'Shravana':'Moon','Dhanishtha':'Mars','Shatabhisha':'Rahu',
  'Purva Bhadra':'Jupiter','Uttara Bhadra':'Saturn','Revati':'Mercury',
}
function addDays(date, days) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  return d
}

function addYears(date, years) {
  if (!years || isNaN(years)) return new Date(date)
  return addDays(date, years * 365.25)
}

function formatDate(date) {
  if (!date || isNaN(date.getTime())) return 'Unknown'
  return date.toISOString().split('T')[0]
}

function changeToTotalDegrees(sign, degreeInSign) {
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                 'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
  const signIndex = signs.indexOf(sign)
  return (signIndex * 30) + degreeInSign
}

function calculateAntardashas(mahaLord, mahaYears, startDate) {
  const mahaIndex = DASHA_SEQUENCE.findIndex(d => d.planet === mahaLord)
  const antardashas = []
  let currentDate = new Date(startDate)
  for (let i = 0; i < 9; i++) {
    const index = (mahaIndex + i) % 9
    const antarLord = DASHA_SEQUENCE[index].planet
    const antarYears = (mahaYears * DASHA_SEQUENCE[index].years) / 120
    const endDate = addYears(currentDate, antarYears)
    antardashas.push({
      planet: antarLord,
      start: formatDate(currentDate),
      end: formatDate(endDate),
      years: antarYears
    })
    currentDate = endDate
  }
  return antardashas
}

function calculatePratyantardashas(mahaLord, antarLord, antarYears, startDate) {
  const antarIndex = DASHA_SEQUENCE.findIndex(d => d.planet === antarLord)
  const pratyantars = []
  let currentDate = new Date(startDate)
  for (let i = 0; i < 9; i++) {
    const index = (antarIndex + i) % 9
    const pratLord = DASHA_SEQUENCE[index].planet
    const pratYears = (antarYears * DASHA_SEQUENCE[index].years) / 120
    const endDate = addYears(currentDate, pratYears)
    pratyantars.push({
      planet: pratLord,
      start: formatDate(currentDate),
      end: formatDate(endDate),
      years: pratYears
    })
    currentDate = endDate
  }
  return pratyantars
}

export function calculateDasha(moonData, dobStr) {
  const moonNakshatra = moonData?.nakshatra?.name || 'Ashwini'
  const dashaLord = NAKSHATRA_LORDS[moonNakshatra] || 'Ketu'
  const nakshatraSpan = 13.333333
  
  // Ensure degreeInNakshatra is properly extracted from nakshatra object
  let degreeInNakshatra = 0
  if (moonData?.nakshatra?.degreeInNak !== undefined) {
    degreeInNakshatra = moonData.nakshatra.degreeInNak
  } else if (moonData?.degree !== undefined) {
    // Fallback: calculate from degree in sign
    const degreeInZodiac = changeToTotalDegrees(moonData.sign, moonData.degree)
    const nakshatraIndex = Math.floor(degreeInZodiac / nakshatraSpan)
    degreeInNakshatra = degreeInZodiac - (nakshatraIndex * nakshatraSpan)
  }
  
  const dashaYears = DASHA_SEQUENCE.find(d => d.planet === dashaLord).years
  // Balance: remaining portion of the starting dasha nakshatra
  const balance = ((nakshatraSpan - degreeInNakshatra) / nakshatraSpan) * dashaYears

  const dob = new Date(dobStr)
  const timeline = []
  let startIndex = DASHA_SEQUENCE.findIndex(d => d.planet === dashaLord)
  let currentDate = new Date(dob)

  // First dasha with balance (partial period)
  const firstEnd = addYears(currentDate, balance)
  const firstAntars = calculateAntardashas(dashaLord, balance, currentDate)
  timeline.push({
    planet: dashaLord,
    start: formatDate(currentDate),
    end: formatDate(firstEnd),
    years: parseFloat(balance.toFixed(4)),
    antardashas: firstAntars
  })
  currentDate = firstEnd

  // Remaining 8 full dashas (cycling through sequence)
  for (let i = 1; i < 9; i++) {
    const index = (startIndex + i) % 9
    const dasha = DASHA_SEQUENCE[index]
    const endDate = addYears(currentDate, dasha.years)
    const antars = calculateAntardashas(dasha.planet, dasha.years, currentDate)
    timeline.push({
      planet: dasha.planet,
      start: formatDate(currentDate),
      end: formatDate(endDate),
      years: dasha.years,
      antardashas: antars
    })
    currentDate = endDate
  }

  // Find current periods
  const today = new Date()

  const currentMaha = timeline.find(d => {
    const startDate = new Date(d.start)
    const endDate = new Date(d.end)
    return startDate <= today && endDate >= today
  })

  let currentAntar = null
  let currentPratyantar = null

  if (currentMaha?.antardashas) {
    currentAntar = currentMaha.antardashas.find(a => {
      const startDate = new Date(a.start)
      const endDate = new Date(a.end)
      return startDate <= today && endDate >= today
    })
    if (currentAntar) {
      const pratyantars = calculatePratyantardashas(
        currentMaha.planet,
        currentAntar.planet,
        currentAntar.years,
        new Date(currentAntar.start)
      )
      currentPratyantar = pratyantars.find(p => {
        const startDate = new Date(p.start)
        const endDate = new Date(p.end)
        return startDate <= today && endDate >= today
      })
    }
  }

  // Debug info
  const debugInfo = {
    moonNakshatra,
    dashaLord,
    degreeInNakshatra: degreeInNakshatra.toFixed(2),
    balance: balance.toFixed(4),
    birthDate: formatDate(dob),
    todayDate: formatDate(today),
    timelineCount: timeline.length
  }

  return {
    moonNakshatra,
    dashaLord,
    balance: balance.toFixed(4),
    degreeInNakshatra: degreeInNakshatra.toFixed(2),
    timeline,
    debugInfo,
    mahadasha: currentMaha ? {
      planet: currentMaha.planet,
      start: currentMaha.start,
      end: currentMaha.end,
      years: currentMaha.years
    } : null,
    antardasha: currentAntar ? {
      planet: currentAntar.planet,
      start: currentAntar.start,
      end: currentAntar.end,
      years: currentAntar.years
    } : null,
    pratyantardasha: currentPratyantar ? {
      planet: currentPratyantar.planet,
      start: currentPratyantar.start,
      end: currentPratyantar.end,
      years: currentPratyantar.years
    } : null
  }
}