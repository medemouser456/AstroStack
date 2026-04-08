// ── NUMEROLOGY CALCULATOR ──────────────────────────────

const PYTHAGOREAN = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
}

const LIFE_PATH_MEANINGS = {
  1:'Leader, pioneer, independent, ambitious. Natural born leader.',
  2:'Diplomat, peacemaker, sensitive, cooperative. Thrives in partnerships.',
  3:'Creative, communicative, expressive, optimistic. Natural entertainer.',
  4:'Builder, organizer, practical, disciplined. Creates lasting foundations.',
  5:'Freedom-seeker, adventurous, versatile, curious. Needs change.',
  6:'Nurturer, responsible, caring, harmonious. Natural healer.',
  7:'Seeker, analyst, introspective, spiritual. Deeply philosophical.',
  8:'Achiever, authority, ambitious, powerful. Material mastery.',
  9:'Humanitarian, compassionate, wise, generous. Old soul.',
  11:'Master Intuitive — highly sensitive, spiritual, inspirational.',
  22:'Master Builder — vision with practicality. Extraordinary achiever.',
  33:'Master Teacher — pure love and compassion. Rare spiritual number.',
}

const LUCKY_COLORS = {
  1:['Gold','Orange','Yellow'],
  2:['Silver','White','Cream'],
  3:['Yellow','Purple','Pink'],
  4:['Blue','Grey','Green'],
  5:['Silver','Grey','Turquoise'],
  6:['Blue','Pink','Green'],
  7:['White','Violet','Purple'],
  8:['Black','Dark Blue','Brown'],
  9:['Red','Crimson','Pink'],
  11:['Silver','Indigo','White'],
  22:['Brown','Green','Earth tones'],
  33:['Gold','Pink','Violet'],
}

function reduceToSingleDigit(num) {
  if ([11,22,33].includes(num)) return num
  while (num > 9) {
    num = String(num).split('').reduce((s,d) => s + parseInt(d), 0)
    if ([11,22,33].includes(num)) return num
  }
  return num
}

export function calculateNumerology(fullName, dobStr) {
  const name = (fullName || '').toUpperCase().replace(/[^A-Z]/g,'')
  const vowels = 'AEIOU'

  // Life Path from DOB
  const digits = dobStr.replace(/-/g,'').split('').map(Number)
  const lifePath = reduceToSingleDigit(digits.reduce((s,d) => s+d, 0))

  // Destiny Number — full name
  const destinyNumber = name.length > 0
    ? reduceToSingleDigit(name.split('').reduce((s,c) => s+(PYTHAGOREAN[c]||0), 0))
    : 0

  // Soul Urge — vowels only
  const soulUrge = name.length > 0
    ? reduceToSingleDigit(name.split('').filter(c => vowels.includes(c)).reduce((s,c) => s+(PYTHAGOREAN[c]||0), 0))
    : 0

  // Personality — consonants only
  const personality = name.length > 0
    ? reduceToSingleDigit(name.split('').filter(c => !vowels.includes(c)).reduce((s,c) => s+(PYTHAGOREAN[c]||0), 0))
    : 0

  // Personal Year
  const today = new Date()
  const [_, month, day] = dobStr.split('-')
  const personalYear = reduceToSingleDigit(
    parseInt(month) + parseInt(day) +
    String(today.getFullYear()).split('').reduce((s,d) => s+parseInt(d), 0)
  )

  // Lucky numbers
  const luckyNumbers = [lifePath, lifePath+9, lifePath+18].map(n => n > 31 ? n-31 : n)

  return {
    lifePath,
    lifePathMeaning: LIFE_PATH_MEANINGS[lifePath] || '',
    destinyNumber,
    soulUrge,
    personality,
    personalYear,
    luckyNumbers,
    luckyColors: LUCKY_COLORS[lifePath] || ['White'],
    nameCompatibility: lifePath === destinyNumber
      ? 'Perfect alignment'
      : Math.abs(lifePath - destinyNumber) <= 2
        ? 'Good alignment'
        : 'Consider name correction'
  }
}