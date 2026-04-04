// ── CHINESE ASTROLOGY CALCULATOR ──────────────────────

const ANIMAL_SIGNS = [
  { name: 'Rat', element: 'Water', polarity: 'Yang', years: [1924,1936,1948,1960,1972,1984,1996,2008,2020] },
  { name: 'Ox', element: 'Earth', polarity: 'Yin', years: [1925,1937,1949,1961,1973,1985,1997,2009,2021] },
  { name: 'Tiger', element: 'Wood', polarity: 'Yang', years: [1926,1938,1950,1962,1974,1986,1998,2010,2022] },
  { name: 'Rabbit', element: 'Wood', polarity: 'Yin', years: [1927,1939,1951,1963,1975,1987,1999,2011,2023] },
  { name: 'Dragon', element: 'Earth', polarity: 'Yang', years: [1928,1940,1952,1964,1976,1988,2000,2012,2024] },
  { name: 'Snake', element: 'Fire', polarity: 'Yin', years: [1929,1941,1953,1965,1977,1989,2001,2013,2025] },
  { name: 'Horse', element: 'Fire', polarity: 'Yang', years: [1930,1942,1954,1966,1978,1990,2002,2014,2026] },
  { name: 'Goat', element: 'Earth', polarity: 'Yin', years: [1931,1943,1955,1967,1979,1991,2003,2015,2027] },
  { name: 'Monkey', element: 'Metal', polarity: 'Yang', years: [1932,1944,1956,1968,1980,1992,2004,2016,2028] },
  { name: 'Rooster', element: 'Metal', polarity: 'Yin', years: [1933,1945,1957,1969,1981,1993,2005,2017,2029] },
  { name: 'Dog', element: 'Earth', polarity: 'Yang', years: [1934,1946,1958,1970,1982,1994,2006,2018,2030] },
  { name: 'Pig', element: 'Water', polarity: 'Yin', years: [1935,1947,1959,1971,1983,1995,2007,2019,2031] },
]

const YEAR_ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water']

const ELEMENT_TRAITS = {
  Wood: 'Growth, creativity, flexibility, compassion, idealism',
  Fire: 'Passion, enthusiasm, leadership, transformation, energy',
  Earth: 'Stability, reliability, practicality, nurturing, grounding',
  Metal: 'Precision, discipline, righteousness, determination, strength',
  Water: 'Wisdom, adaptability, intuition, depth, communication',
}

const ANIMAL_COMPATIBILITY = {
  Rat: ['Dragon', 'Monkey', 'Ox'],
  Ox: ['Rat', 'Snake', 'Rooster'],
  Tiger: ['Horse', 'Dog', 'Pig'],
  Rabbit: ['Goat', 'Pig', 'Dog'],
  Dragon: ['Rat', 'Monkey', 'Rooster'],
  Snake: ['Ox', 'Rooster', 'Monkey'],
  Horse: ['Tiger', 'Dog', 'Goat'],
  Goat: ['Rabbit', 'Horse', 'Pig'],
  Monkey: ['Rat', 'Dragon', 'Snake'],
  Rooster: ['Ox', 'Dragon', 'Snake'],
  Dog: ['Tiger', 'Rabbit', 'Horse'],
  Pig: ['Tiger', 'Rabbit', 'Goat'],
}

const CURRENT_YEAR_SIGN = 'Horse' // 2026
const CURRENT_YEAR_ELEMENT = 'Fire'

export function calculateChinese(dobStr) {
  const year = parseInt(dobStr.split('-')[0])
  const month = parseInt(dobStr.split('-')[1])

  // Chinese New Year is approximately Feb 4-21
  // If born in Jan or early Feb, use previous year's sign
  const adjustedYear = month === 1 ? year - 1 : year

  // Find animal sign
  const animalData = ANIMAL_SIGNS.find(a => a.years.includes(adjustedYear))
    || ANIMAL_SIGNS[adjustedYear % 12]

  // Birth year element
  const elementIndex = (adjustedYear - 4) % 10
  const birthYearElement = YEAR_ELEMENTS[Math.abs(elementIndex)]

  // Current year relationship
  const currentYearImpact = getYearImpact(animalData.name, CURRENT_YEAR_SIGN)

  // Lucky items
  const luckyItems = getLuckyItems(animalData.name)

  return {
    animalSign: animalData.name,
    fixedElement: animalData.element,
    birthYearElement,
    polarity: animalData.polarity,
    elementTrait: ELEMENT_TRAITS[animalData.element],
    compatibleSigns: ANIMAL_COMPATIBILITY[animalData.name],
    currentYear: `${CURRENT_YEAR_ELEMENT} ${CURRENT_YEAR_SIGN} Year (2026)`,
    currentYearImpact,
    luckyItems,
    personality: getAnimalPersonality(animalData.name)
  }
}

function getYearImpact(birthSign, currentYearSign) {
  const compatible = ANIMAL_COMPATIBILITY[birthSign]
  if (compatible?.includes(currentYearSign)) {
    return `Favorable year! ${currentYearSign} year supports ${birthSign} energy — good for new ventures`
  }
  if (birthSign === currentYearSign) {
    return `Ben Ming Nian (your birth year) — challenging but transformative. Wear red for protection`
  }
  return `Neutral to moderate year. Focus on steady progress rather than big risks`
}

function getLuckyItems(sign) {
  const items = {
    Rat: { colors: ['Blue', 'Gold', 'Green'], numbers: [2, 3], flowers: 'Lily' },
    Ox: { colors: ['White', 'Yellow', 'Green'], numbers: [1, 4], flowers: 'Tulip' },
    Tiger: { colors: ['Blue', 'Grey', 'Orange'], numbers: [1, 3, 4], flowers: 'Cineraria' },
    Rabbit: { colors: ['Red', 'Pink', 'Purple'], numbers: [3, 4, 6], flowers: 'Snapdragon' },
    Dragon: { colors: ['Gold', 'Silver', 'Grayish Yellow'], numbers: [1, 6, 7], flowers: 'Bleeding Heart' },
    Snake: { colors: ['Black', 'Red', 'Yellow'], numbers: [2, 8, 9], flowers: 'Orchid' },
    Horse: { colors: ['Yellow', 'Green'], numbers: [2, 3, 7], flowers: 'Sunflower' },
    Goat: { colors: ['Brown', 'Red', 'Purple'], numbers: [2, 7], flowers: 'Carnation' },
    Monkey: { colors: ['White', 'Blue', 'Gold'], numbers: [4, 9], flowers: 'Chrysanthemum' },
    Rooster: { colors: ['Gold', 'Brown', 'Yellow'], numbers: [5, 7, 8], flowers: 'Gladiola' },
    Dog: { colors: ['Green', 'Red', 'Purple'], numbers: [3, 4, 9], flowers: 'Rose' },
    Pig: { colors: ['Yellow', 'Grey', 'Brown'], numbers: [2, 5, 8], flowers: 'Marguerite' },
  }
  return items[sign] || { colors: ['White'], numbers: [1], flowers: 'Lotus' }
}

function getAnimalPersonality(sign) {
  const personalities = {
    Rat: 'Quick-witted, resourceful, versatile, adaptable. Natural problem-solver with magnetic charm.',
    Ox: 'Diligent, dependable, strong, determined. Reliable and patient with great inner strength.',
    Tiger: 'Brave, confident, competitive, unpredictable. Natural leader with magnetic presence.',
    Rabbit: 'Gentle, elegant, kind, responsible. Artistic and diplomatic with refined taste.',
    Dragon: 'Energetic, fearless, warm-hearted, charismatic. Most vibrant sign — born leader.',
    Snake: 'Enigmatic, wise, graceful, intuitive. Deep thinker with natural sophistication.',
    Horse: 'Animated, active, energetic, passionate. Free spirit who loves adventure and freedom.',
    Goat: 'Creative, imaginative, gentle, compassionate. Artistic soul with gentle demeanor.',
    Monkey: 'Witty, intelligent, versatile, inventive. Quick learner with excellent problem-solving.',
    Rooster: 'Observant, hardworking, courageous, confident. Perfectionistic and highly organized.',
    Dog: 'Loyal, honest, kind, cautious. Most faithful sign — deeply values justice and truth.',
    Pig: 'Compassionate, generous, diligent, naive. Pure-hearted with enormous capacity for love.',
  }
  return personalities[sign] || ''
}