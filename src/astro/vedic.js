// ── VIMSHOTTARI DASHA CALCULATOR ───────────────────────
// Based on Moon's nakshatra at birth

const DASHA_SEQUENCE = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 },
]

const NAKSHATRA_LORDS = {
  'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
  'Rohini': 'Moon', 'Mrigashira': 'Mars', 'Ardra': 'Rahu',
  'Punarvasu': 'Jupiter', 'Pushya': 'Saturn', 'Ashlesha': 'Mercury',
  'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
  'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu',
  'Vishakha': 'Jupiter', 'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury',
  'Moola': 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
  'Shravana': 'Moon', 'Dhanishtha': 'Mars', 'Shatabhisha': 'Rahu',
  'Purva Bhadra': 'Jupiter', 'Uttara Bhadra': 'Saturn', 'Revati': 'Mercury',
}

export function calculateDasha(moonData, dobStr) {
  const moonNakshatra = moonData.nakshatra.name
  const dashaLord = NAKSHATRA_LORDS[moonNakshatra]

  // Calculate balance of first dasha at birth
  const nakshatraSpan = 13.333333 // degrees
  const degreeInNakshatra = moonData.nakshatra.degreeInNak
  const dashaYears = DASHA_SEQUENCE.find(d => d.planet === dashaLord).years

  // Balance = (remaining degrees in nakshatra / total nakshatra span) * dasha years
  const balance = ((nakshatraSpan - degreeInNakshatra) / nakshatraSpan) * dashaYears

  // Build complete dasha timeline from birth
  const dob = new Date(dobStr)
  const dashaTimeline = []

  // Find starting dasha lord index
  let startIndex = DASHA_SEQUENCE.findIndex(d => d.planet === dashaLord)
  let currentDate = new Date(dob)

  // First dasha with balance
  const firstDasha = DASHA_SEQUENCE[startIndex]
  const firstEndDate = addYears(currentDate, balance)
  dashaTimeline.push({
    planet: firstDasha.planet,
    start: formatDate(currentDate),
    end: formatDate(firstEndDate),
    years: balance,
    antardashas: calculateAntardashas(firstDasha.planet, balance, currentDate)
  })
  currentDate = firstEndDate

  // Remaining dashas — full cycles
  for (let i = 1; i < 9; i++) {
    const index = (startIndex + i) % 9
    const dasha = DASHA_SEQUENCE[index]
    const endDate = addYears(currentDate, dasha.years)
    dashaTimeline.push({
      planet: dasha.planet,
      start: formatDate(currentDate),
      end: formatDate(endDate),
      years: dasha.years,
      antardashas: calculateAntardashas(dasha.planet, dasha.years, currentDate)
    })
    currentDate = endDate
  }

  // Find current dasha
  const today = new Date()
  const currentMaha = dashaTimeline.find(d =>
    new Date(d.start) <= today && new Date(d.end) >= today
  )

  let currentAntar = null
  let currentPratyantar = null

  if (currentMaha) {
    currentAntar = currentMaha.antardashas?.find(a =>
      new Date(a.start) <= today && new Date(a.end) >= today
    )
    if (currentAntar) {
      currentPratyantar = calculatePratyantardasha(
        currentMaha.planet,
        currentAntar.planet,
        currentAntar.years,
        new Date(currentAntar.start)
      ).find(p => new Date(p.start) <= today && new Date(p.end) >= today)
    }
  }

  return {
    moonNakshatra,
    dashaLord,
    balance: balance.toFixed(2),
    timeline: dashaTimeline,
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

function calculateAntardashas(mahaLord, mahaYears, startDate) {
  const mahaIndex = DASHA_SEQUENCE.findIndex(d => d.planet === mahaLord)
  const antardashas = []
  let currentDate = new Date(startDate)

  for (let i = 0; i < 9; i++) {
    const index = (mahaIndex + i) % 9
    const antarLord = DASHA_SEQUENCE[index].planet
    const antarLordYears = DASHA_SEQUENCE[index].years
    const antarYears = (mahaYears * antarLordYears) / 120
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

function calculatePratyantardasha(mahaLord, antarLord, antarYears, startDate) {
  const antarIndex = DASHA_SEQUENCE.findIndex(d => d.planet === antarLord)
  const pratyantars = []
  let currentDate = new Date(startDate)

  for (let i = 0; i < 9; i++) {
    const index = (antarIndex + i) % 9
    const pratLord = DASHA_SEQUENCE[index].planet
    const pratLordYears = DASHA_SEQUENCE[index].years
    const pratYears = (antarYears * pratLordYears) / 120
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

// Helper functions
function addYears(date, years) {
  const d = new Date(date)
  const days = years * 365.25
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  return d
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}