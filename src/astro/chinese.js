// ── CHINESE ASTROLOGY CALCULATOR ──────────────────────

const ANIMAL_SIGNS = [
  { name:'Rat', element:'Water', polarity:'Yang', offset:0 },
  { name:'Ox', element:'Earth', polarity:'Yin', offset:1 },
  { name:'Tiger', element:'Wood', polarity:'Yang', offset:2 },
  { name:'Rabbit', element:'Wood', polarity:'Yin', offset:3 },
  { name:'Dragon', element:'Earth', polarity:'Yang', offset:4 },
  { name:'Snake', element:'Fire', polarity:'Yin', offset:5 },
  { name:'Horse', element:'Fire', polarity:'Yang', offset:6 },
  { name:'Goat', element:'Earth', polarity:'Yin', offset:7 },
  { name:'Monkey', element:'Metal', polarity:'Yang', offset:8 },
  { name:'Rooster', element:'Metal', polarity:'Yin', offset:9 },
  { name:'Dog', element:'Earth', polarity:'Yang', offset:10 },
  { name:'Pig', element:'Water', polarity:'Yin', offset:11 },
]

const YEAR_ELEMENTS = [
  'Metal','Metal','Water','Water','Wood','Wood',
  'Fire','Fire','Earth','Earth'
]

const ELEMENT_TRAITS = {
  Wood:'Growth, creativity, flexibility, compassion',
  Fire:'Passion, enthusiasm, leadership, transformation',
  Earth:'Stability, reliability, practicality, nurturing',
  Metal:'Precision, discipline, determination, strength',
  Water:'Wisdom, adaptability, intuition, depth',
}

const ANIMAL_PERSONALITY = {
  Rat:'Quick-witted, resourceful, charming, ambitious',
  Ox:'Diligent, dependable, strong, patient',
  Tiger:'Brave, confident, competitive, unpredictable',
  Rabbit:'Gentle, elegant, kind, diplomatic',
  Dragon:'Energetic, charismatic, fearless, visionary',
  Snake:'Enigmatic, wise, intuitive, sophisticated',
  Horse:'Animated, passionate, free-spirited, energetic',
  Goat:'Creative, compassionate, gentle, artistic',
  Monkey:'Witty, intelligent, inventive, versatile',
  Rooster:'Observant, hardworking, confident, perfectionist',
  Dog:'Loyal, honest, kind, protective',
  Pig:'Compassionate, generous, sincere, loving',
}

const COMPATIBILITY = {
  Rat:['Dragon','Monkey','Ox'],
  Ox:['Rat','Snake','Rooster'],
  Tiger:['Horse','Dog','Pig'],
  Rabbit:['Goat','Pig','Dog'],
  Dragon:['Rat','Monkey','Rooster'],
  Snake:['Ox','Rooster','Monkey'],
  Horse:['Tiger','Dog','Goat'],
  Goat:['Rabbit','Horse','Pig'],
  Monkey:['Rat','Dragon','Snake'],
  Rooster:['Ox','Dragon','Snake'],
  Dog:['Tiger','Rabbit','Horse'],
  Pig:['Tiger','Rabbit','Goat'],
}

const LUCKY_ITEMS = {
  Rat:{ colors:['Blue','Gold','Green'], numbers:[2,3] },
  Ox:{ colors:['White','Yellow','Green'], numbers:[1,4] },
  Tiger:{ colors:['Blue','Grey','Orange'], numbers:[1,3,4] },
  Rabbit:{ colors:['Red','Pink','Purple'], numbers:[3,4,6] },
  Dragon:{ colors:['Gold','Silver','Yellow'], numbers:[1,6,7] },
  Snake:{ colors:['Black','Red','Yellow'], numbers:[2,8,9] },
  Horse:{ colors:['Yellow','Green','Purple'], numbers:[2,3,7] },
  Goat:{ colors:['Brown','Red','Purple'], numbers:[2,7] },
  Monkey:{ colors:['White','Blue','Gold'], numbers:[4,9] },
  Rooster:{ colors:['Gold','Brown','Yellow'], numbers:[5,7,8] },
  Dog:{ colors:['Green','Red','Purple'], numbers:[3,4,9] },
  Pig:{ colors:['Yellow','Grey','Brown'], numbers:[2,5,8] },
}

export function calculateChinese(dobStr) {
  const year = parseInt(dobStr.split('-')[0])
  const month = parseInt(dobStr.split('-')[1])

  // Adjust for Chinese New Year (approx Feb 4)
  const adjustedYear = month === 1 ? year - 1 : year

  // Animal sign based on year cycle
  const animalIndex = ((adjustedYear - 1900) % 12 + 12) % 12
  const animal = ANIMAL_SIGNS[animalIndex]

  // Birth year element (10-year cycle)
  const elementIndex = ((adjustedYear - 1900) % 10 + 10) % 10
  const birthYearElement = YEAR_ELEMENTS[elementIndex]

  // 2026 = Year of Horse (Fire)
  const currentYearAnimal = 'Horse'
  const currentYearElement = 'Fire'

  // Year impact
  let currentYearImpact
  if (animal.name === currentYearAnimal) {
    currentYearImpact = 'Ben Ming Nian — your zodiac year. Wear red for protection. Transformative but challenging.'
  } else if (COMPATIBILITY[animal.name]?.includes(currentYearAnimal)) {
    currentYearImpact = `Favorable ${currentYearElement} ${currentYearAnimal} year for ${animal.name}. Good for new ventures and relationships.`
  } else {
    currentYearImpact = `Moderate year. Steady progress recommended over big risks.`
  }

  return {
    animalSign: animal.name,
    fixedElement: animal.element,
    birthYearElement,
    polarity: animal.polarity,
    elementTrait: ELEMENT_TRAITS[animal.element],
    personality: ANIMAL_PERSONALITY[animal.name],
    compatibleSigns: COMPATIBILITY[animal.name],
    luckyItems: LUCKY_ITEMS[animal.name],
    currentYear: `${currentYearElement} ${currentYearAnimal} Year (2026)`,
    currentYearImpact,
  }
}