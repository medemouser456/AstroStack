// ── NUMEROLOGY CALCULATOR ──────────────────────────────
// Pythagorean + Chaldean systems

const PYTHAGOREAN = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
}

const CHALDEAN = {
  A:1,B:2,C:3,D:4,E:5,U:6,O:7,F:8,I:9,
  K:2,G:3,L:3,M:4,N:5,P:8,Q:8,R:2,
  S:3,T:4,V:6,W:6,X:5,Y:1,Z:7,H:5,J:1
}

const LIFE_PATH_MEANINGS = {
  1: 'Leader, pioneer, independent, original, ambitious. Natural born leader who forges new paths.',
  2: 'Diplomat, peacemaker, sensitive, cooperative, intuitive. Thrives in partnerships.',
  3: 'Creative, communicative, expressive, optimistic, social. Natural entertainer and artist.',
  4: 'Builder, organizer, practical, disciplined, hardworking. Creates lasting foundations.',
  5: 'Freedom-seeker, adventurous, versatile, curious, sensual. Needs change and variety.',
  6: 'Nurturer, responsible, caring, harmonious, family-oriented. Natural healer and counselor.',
  7: 'Seeker, analyst, introspective, spiritual, intellectual. Deeply philosophical nature.',
  8: 'Achiever, authority, ambitious, business-minded, powerful. Material and spiritual mastery.',
  9: 'Humanitarian, compassionate, wise, artistic, generous. Old soul with universal love.',
  11: 'Master Intuitive — highly sensitive, spiritual, inspirational. Carries extra karmic responsibility.',
  22: 'Master Builder — combines vision with practicality. Can achieve extraordinary things.',
  33: 'Master Teacher — pure love and compassion. Rare and highly spiritual number.',
}

export function calculateNumerology(fullName, dobStr) {
  // Clean name
  const name = fullName.toUpperCase().replace(/[^A-Z]/g, '')
  const vowels = 'AEIOU'

  // Life Path Number
  const lifePath = reduceToSingleDigit(
    dobStr.replace(/-/g, '').split('').reduce((sum, d) => sum + parseInt(d), 0)
  )

  // Expression/Destiny Number (full name — Pythagorean)
  const destinyNumber = reduceToSingleDigit(
    name.split('').reduce((sum, c) => sum + (PYTHAGOREAN[c] || 0), 0)
  )

  // Soul Urge Number (vowels only)
  const soulUrge = reduceToSingleDigit(
    name.split('').filter(c => vowels.includes(c))
      .reduce((sum, c) => sum + (PYTHAGOREAN[c] || 0), 0)
  )

  // Personality Number (consonants only)
  const personality = reduceToSingleDigit(
    name.split('').filter(c => !vowels.includes(c))
      .reduce((sum, c) => sum + (PYTHAGOREAN[c] || 0), 0)
  )

  // Personal Year
  const today = new Date()
  const currentYear = today.getFullYear()
  const [_, month, day] = dobStr.split('-')
  const personalYear = reduceToSingleDigit(
    parseInt(month) + parseInt(day) +
    currentYear.toString().split('').reduce((sum, d) => sum + parseInt(d), 0)
  )

  // Chaldean name number
  const chaldeanNumber = reduceToSingleDigit(
    name.split('').reduce((sum, c) => sum + (CHALDEAN[c] || 0), 0)
  )

  // Lucky numbers
  const luckyNumbers = getLuckyNumbers(lifePath)

  // Lucky days
  const luckyDays = getLuckyDays(lifePath)

  // Lucky colors
  const luckyColors = getLuckyColors(lifePath)

  return {
    lifePath,
    lifePathMeaning: LIFE_PATH_MEANINGS[lifePath],
    destinyNumber,
    soulUrge,
    personality,
    personalYear,
    chaldeanNumber,
    luckyNumbers,
    luckyDays,
    luckyColors,
    nameCompatibility: lifePath === destinyNumber ? 'Perfect alignment' :
      Math.abs(lifePath - destinyNumber) <= 2 ? 'Good alignment' : 'Needs correction'
  }
}

function reduceToSingleDigit(num) {
  // Keep master numbers 11, 22, 33
  if ([11, 22, 33].includes(num)) return num
  while (num > 9) {
    num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0)
    if ([11, 22, 33].includes(num)) return num
  }
  return num
}

function getLuckyNumbers(lifePath) {
  const luckyMap = {
    1: [1, 10, 19, 28], 2: [2, 11, 20, 29],
    3: [3, 12, 21, 30], 4: [4, 13, 22, 31],
    5: [5, 14, 23], 6: [6, 15, 24],
    7: [7, 16, 25], 8: [8, 17, 26],
    9: [9, 18, 27], 11: [11, 2, 29],
    22: [22, 4, 13], 33: [33, 6, 15]
  }
  return luckyMap[lifePath] || [lifePath]
}

function getLuckyDays(lifePath) {
  const dayMap = {
    1: 'Sunday', 2: 'Monday', 3: 'Thursday',
    4: 'Saturday', 5: 'Wednesday', 6: 'Friday',
    7: 'Monday', 8: 'Saturday', 9: 'Tuesday',
    11: 'Monday', 22: 'Saturday', 33: 'Friday'
  }
  return dayMap[lifePath] || 'Sunday'
}

function getLuckyColors(lifePath) {
  const colorMap = {
    1: ['Gold', 'Orange', 'Yellow'],
    2: ['Silver', 'White', 'Cream'],
    3: ['Yellow', 'Purple', 'Pink'],
    4: ['Blue', 'Grey', 'Green'],
    5: ['Silver', 'Grey', 'White'],
    6: ['Blue', 'Pink', 'Green'],
    7: ['White', 'Violet', 'Purple'],
    8: ['Black', 'Dark Blue', 'Brown'],
    9: ['Red', 'Crimson', 'Pink'],
    11: ['Silver', 'Indigo', 'White'],
    22: ['Earth tones', 'Brown', 'Green'],
    33: ['Gold', 'Pink', 'Violet']
  }
  return colorMap[lifePath] || ['White']
}