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
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  return d
}

function addYears(date, years) {
  return addDays(date, years * 365.25)
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
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
  const degreeInNakshatra = moonData?.nakshatra?.degreeInNak || 0
  const dashaYears = DASHA_SEQUENCE.find(d => d.planet === dashaLord).years
  const balance = ((nakshatraSpan - degreeInNakshatra) / nakshatraSpan) * dashaYears

  const dob = new Date(dobStr)
  const timeline = []
  let startIndex = DASHA_SEQUENCE.findIndex(d => d.planet === dashaLord)
  let currentDate = new Date(dob)

  // First dasha with balance
  const firstEnd = addYears(currentDate, balance)
  const firstAntars = calculateAntardashas(dashaLord, balance, currentDate)
  timeline.push({
    planet: dashaLord,
    start: formatDate(currentDate),
    end: formatDate(firstEnd),
    years: balance,
    antardashas: firstAntars
  })
  currentDate = firstEnd

  // Remaining 8 full dashas
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

  const currentMaha = timeline.find(d =>
    new Date(d.start) <= today && new Date(d.end) >= today
  )

  let currentAntar = null
  let currentPratyantar = null

  if (currentMaha?.antardashas) {
    currentAntar = currentMaha.antardashas.find(a =>
      new Date(a.start) <= today && new Date(a.end) >= today
    )
    if (currentAntar) {
      const pratyantars = calculatePratyantardashas(
        currentMaha.planet,
        currentAntar.planet,
        currentAntar.years,
        new Date(currentAntar.start)
      )
      currentPratyantar = pratyantars.find(p =>
        new Date(p.start) <= today && new Date(p.end) >= today
      )
    }
  }

  return {
    moonNakshatra,
    dashaLord,
    balance: balance.toFixed(2),
    timeline,
    mahadasha: currentMaha ? {
      planet: currentMaha.planet,
      start: currentMaha.start,
      end: currentMaha.end
    } : null,
    antardasha: currentAntar ? {
      planet: currentAntar.planet,
      start: currentAntar.start,
      end: currentAntar.end
    } : null,
    pratyantardasha: currentPratyantar ? {
      planet: currentPratyantar.planet,
      start: currentPratyantar.start,
      end: currentPratyantar.end
    } : null
  }
}